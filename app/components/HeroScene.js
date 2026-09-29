"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// 프로젝트 스크린샷·논문 표지가 기울어진 궤도를 따라 도는 3D 갤러리.
// - 둥근 모서리/깊이 감쇠/호버 테두리는 셰이더에서 처리
// - 화면 밖이거나 탭이 숨겨지면 렌더 루프 정지, prefers-reduced-motion이면 정지 화면만 필요할 때 렌더
// - 언마운트 시 geometry·material·texture·renderer 모두 dispose

const CARD_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const CARD_FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform vec2 uSize;
uniform float uRadius;
uniform float uOpacity;
uniform float uGlobal;
uniform float uHover;
uniform float uDim;
uniform vec3 uAccent;
varying vec2 vUv;

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = (vUv - 0.5) * uSize;
  float d = sdRoundBox(p, uSize * 0.5, uRadius);
  float aa = fwidth(d) * 1.2;
  float mask = 1.0 - smoothstep(-aa, aa, d);
  float alpha = mask * uOpacity * uGlobal;
  if (alpha < 0.004) discard;

  vec3 col = texture2D(uMap, vUv).rgb;
  col *= mix(1.0, 0.3, uDim);
  float rim = 1.0 - smoothstep(0.0, 0.03, -d);
  col = mix(col, vec3(1.0), rim * 0.16 * (1.0 - uHover));
  col = mix(col, uAccent, rim * uHover * 0.95);
  gl_FragColor = vec4(col, alpha);
  #include <colorspace_fragment>
}
`;

const DUST_VERT = /* glsl */ `
uniform float uPixelRatio;
uniform float uSize;
attribute float aScale;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uSize * aScale * uPixelRatio * (10.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const DUST_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * uOpacity);
  #include <colorspace_fragment>
}
`;

const TAU = Math.PI * 2;
const { damp, clamp, smoothstep } = THREE.MathUtils;

function layoutFor(width) {
  if (width < 820) {
    return { narrow: true, radius: 1.95, x: 0, y: 3.0, z: -1, camZ: 13.6, cardScale: 0.6, dpr: 1.5 };
  }
  if (width < 1200) {
    return { narrow: false, radius: 1.9, x: 3.15, y: 0.2, z: -1.2, camZ: 12.8, cardScale: 0.7, dpr: 2 };
  }
  return { narrow: false, radius: 2.5, x: 3.2, y: 0.25, z: -1.2, camZ: 12, cardScale: 0.9, dpr: 2 };
}

export default function HeroScene({ items, activeId, onHover, onSelect, onReady, onError }) {
  const mountRef = useRef(null);
  const activeRef = useRef(activeId);
  const callbacks = useRef({ onHover, onSelect, onReady, onError });
  const invalidateRef = useRef(null);

  useEffect(() => {
    callbacks.current = { onHover, onSelect, onReady, onError };
  });

  useEffect(() => {
    activeRef.current = activeId;
    invalidateRef.current?.();
  }, [activeId]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    // 모션 줄이기 설정은 실행 중에도 바뀔 수 있으므로 계속 추적
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionMq.matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 장식용이므로 고성능 GPU를 강제하지 않음
    } catch (err) {
      callbacks.current.onError?.(err);
      return undefined;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping; // UI 스크린샷 색을 그대로 보여주기 위해 톤매핑 없음
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const rig = new THREE.Group();
    const ring = new THREE.Group();
    rig.add(ring);
    scene.add(rig);

    let layout = layoutFor(mount.clientWidth || window.innerWidth);
    const accent = new THREE.Color("#3ddc97");
    const globalFade = { value: 1 };

    // --- 궤도선
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 160 }, (_, i) => {
        const a = (i / 160) * TAU;
        return new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
      })
    );
    const orbitMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.18, depthWrite: false });
    const orbit = new THREE.LineLoop(orbitGeo, orbitMat);
    orbit.position.y = -0.95;
    ring.add(orbit);

    // --- 먼지 입자 (깊이감)
    const dustCount = layout.narrow ? 240 : 520;
    const dustPos = new Float32Array(dustCount * 3);
    const dustScale = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 22;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      dustPos[i * 3 + 2] = -10 + Math.random() * 13;
      dustScale[i] = 0.4 + Math.random() * 0.9;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("aScale", new THREE.BufferAttribute(dustScale, 1));
    const dustMat = new THREE.ShaderMaterial({
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      uniforms: {
        uColor: { value: new THREE.Color("#a9bddc") },
        uOpacity: { value: 0.55 },
        uPixelRatio: { value: 1 },
        uSize: { value: 2.2 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // --- 카드
    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const textures = [];
    const cards = items.map((item, i) => {
      const aspect = item.w / item.h;
      const isPaper = item.kind === "paper";
      let h = isPaper ? 1.7 : aspect > 2 ? 1.05 : 1.25;
      let w = h * aspect;
      if (w > 2.4) {
        w = 2.4;
        h = w / aspect;
      }
      const material = new THREE.ShaderMaterial({
        vertexShader: CARD_VERT,
        fragmentShader: CARD_FRAG,
        uniforms: {
          uMap: { value: null },
          uSize: { value: new THREE.Vector2(w, h) },
          uRadius: { value: 0.07 },
          uOpacity: { value: 0 },
          uGlobal: globalFade,
          uHover: { value: 0 },
          uDim: { value: 0 },
          uAccent: { value: accent },
        },
        transparent: true,
      });
      const mesh = new THREE.Mesh(planeGeo, material);
      mesh.userData = {
        item,
        w,
        h,
        baseAngle: (i / items.length) * TAU + 0.35,
        yOff: Math.sin(i * 2.1) * 0.42,
        phase: i * 1.37,
        hover: 0,
        fade: 0,
        loadedAt: -1,
        drag: 0, // 0 = 궤도 위치, 1 = 드래그 위치 (놓으면 0으로 돌아가며 궤도로 복귀)
        dragPos: new THREE.Vector3(),
        tilt: 0,
        tiltTarget: 0,
      };
      mesh.visible = false;
      ring.add(mesh);
      return mesh;
    });

    // --- 상태
    const state = {
      running: false,
      visible: true,
      raf: 0,
      last: 0,
      time: 0,
      ringAngle: 0,
      pointer: new THREE.Vector2(0, 0),
      pointerTarget: new THREE.Vector2(0, 0),
      ndc: new THREE.Vector2(0, 0),
      clientX: 0,
      clientY: 0,
      pointerInside: false,
      hovered: null,
      scroll: 0,
      scrollTarget: 0,
      heroHeight: mount.clientHeight || window.innerHeight,
      loaded: 0,
      readySent: false,
      disposed: false,
      spin: 0, // 빈 공간을 끌어 돌린 뒤 남는 관성 (rad/s)
    };
    // 드래그: 카드를 잡으면 카드 이동, 빈 공간을 잡으면 궤도 회전
    const drag = { active: false, moved: false, mode: null, mesh: null, id: null, x0: 0, y0: 0, lastX: 0, lastT: 0 };
    const dragPlane = new THREE.Plane();
    const dragOffset = new THREE.Vector3();
    const dragHit = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const ndcTmp = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const camLocal = new THREE.Vector3();
    const tmp = new THREE.Vector3();

    items.forEach((item, i) => {
      loader.load(
        item.texture,
        (tex) => {
          if (state.disposed) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = Math.min(8, maxAniso);
          textures.push(tex);
          const mesh = cards[i];
          mesh.material.uniforms.uMap.value = tex;
          mesh.userData.loadedAt = state.time + i * 0.09;
          mesh.visible = true;
          state.loaded += 1;
          if (!state.readySent) {
            state.readySent = true;
            callbacks.current.onReady?.();
          }
          invalidate();
        },
        undefined,
        () => {
          state.loaded += 1;
        }
      );
    });

    function resize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      layout = layoutFor(w);
      const dpr = Math.min(window.devicePixelRatio || 1, layout.dpr);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      dustMat.uniforms.uPixelRatio.value = dpr;
      state.heroHeight = h;
      orbit.scale.setScalar(layout.radius);
      invalidate();
    }

    function toNdc(clientX, clientY, out) {
      const rect = canvas.getBoundingClientRect();
      return out.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    }

    function pick(clientX, clientY) {
      raycaster.setFromCamera(toNdc(clientX, clientY, ndcTmp), camera);
      const hits = raycaster.intersectObjects(cards.filter((c) => c.visible && c.userData.fade > 0.5), false);
      return hits.length ? hits[0].object : null;
    }

    function setHovered(mesh) {
      if (state.hovered === mesh) return;
      state.hovered = mesh;
      if (!drag.moved) canvas.style.cursor = mesh ? "grab" : "";
      callbacks.current.onHover?.(mesh ? mesh.userData.item : null);
    }

    function update(dt) {
      const L = layout;
      state.time += dt;
      const t = state.time;
      const anyActive = state.hovered || activeRef.current;

      // 스크롤 진행도 (히어로를 벗어날수록 1)
      state.scroll = reduceMotion ? state.scrollTarget : damp(state.scroll, state.scrollTarget, 6, dt);
      const p = state.scroll;
      globalFade.value = 1 - smoothstep(p, 0.55, 1.0);

      // 포인터 패럴랙스
      if (reduceMotion) {
        state.pointer.set(0, 0); // 모션 줄이기: 패럴랙스 없음
      } else {
        state.pointer.x = damp(state.pointer.x, state.pointerTarget.x, 4, dt);
        state.pointer.y = damp(state.pointer.y, state.pointerTarget.y, 4, dt);
      }

      rig.position.set(L.x, L.y + p * 1.8, L.z);
      rig.rotation.set(0.16 + p * 0.42 - state.pointer.y * 0.05, state.pointer.x * 0.12, -0.05);
      camera.position.set(0, 0.35, L.camZ - p * 1.6);
      camera.lookAt(0, 0.1, 0);

      const spinning = drag.active && drag.moved && drag.mode === "ring";
      if (!reduceMotion && !spinning) {
        state.ringAngle += dt * (anyActive ? 0.004 : 0.055) + state.spin * dt; // 호버 중에는 거의 멈춤
        state.spin = damp(state.spin, 0, 2.4, dt);
      }
      const ringAngle = state.ringAngle + (reduceMotion ? 0 : p * 1.1);

      rig.updateMatrixWorld(true);
      camLocal.copy(camera.position);
      ring.worldToLocal(camLocal);
      const near = camLocal.length() - L.radius;
      const far = camLocal.length() + L.radius;

      for (const mesh of cards) {
        const u = mesh.userData;
        const theta = u.baseAngle + ringAngle;
        const x = Math.cos(theta) * L.radius;
        const z = Math.sin(theta) * L.radius;
        const bob = reduceMotion ? 0 : Math.sin(t * 0.7 + u.phase) * 0.07;
        const y = u.yOff * (L.narrow ? 0.6 : 1) + bob;

        const held = drag.moved && drag.mesh === mesh;
        if (reduceMotion) {
          u.drag = held ? 1 : 0;
          u.tilt = 0;
        } else {
          u.drag = damp(u.drag, held ? 1 : 0, held ? 16 : 3.2, dt); // 놓으면 천천히 궤도로 복귀
          if (!held) u.tiltTarget = 0;
          u.tilt = damp(u.tilt, u.tiltTarget, 8, dt);
        }
        const k = u.drag;
        const px = x + (u.dragPos.x - x) * k;
        const py = y + (u.dragPos.y - y) * k;
        const pz = z + (u.dragPos.z - z) * k;
        mesh.position.set(px, py, pz);

        // 바깥 방향과 카메라 방향을 '벡터'로 섞어 yaw 계산 (각도 보간은 궤도 뒤쪽에서 ±π로 튀어 카드가 뒤집힘)
        const ol = Math.hypot(px, pz) || 1;
        const fx = camLocal.x - px;
        const fz = camLocal.z - pz;
        const fl = Math.hypot(fx, fz) || 1;
        const wf = 0.72 + 0.28 * k;
        const yaw = Math.atan2((1 - wf) * (px / ol) + wf * (fx / fl), (1 - wf) * (pz / ol) + wf * (fz / fl));
        mesh.rotation.set(0, yaw, -u.tilt);

        const isActive = held || mesh === state.hovered || (activeRef.current && u.item.id === activeRef.current);
        u.hover = reduceMotion ? (isActive ? 1 : 0) : damp(u.hover, isActive ? 1 : 0, 10, dt);
        if (u.loadedAt >= 0) {
          u.fade = reduceMotion ? 1 : clamp((t - u.loadedAt) / 0.9, 0, 1);
        }
        const s = L.cardScale * (1 + u.hover * 0.12 + k * 0.06);
        mesh.scale.set(u.w * s, u.h * s, 1);

        const depth = clamp((mesh.position.distanceTo(camLocal) - near) / (far - near), 0, 1);
        const dimFromOthers = anyActive && !isActive ? 0.4 : 0;
        // 텍스트가 있는 화면 왼쪽으로 온 카드는 가독성을 위해 크게 어둡게
        mesh.updateMatrixWorld();
        tmp.setFromMatrixPosition(mesh.matrixWorld).project(camera);
        const behindText = L.narrow ? 0 : 1 - smoothstep(tmp.x, -0.2, 0.24);
        const uni = mesh.material.uniforms;
        uni.uDim.value = isActive
          ? behindText * 0.5
          : Math.min(1, 0.26 + depth * 0.5 + dimFromOthers + behindText * 0.7);
        uni.uHover.value = u.hover;
        uni.uOpacity.value = u.fade * u.fade * (3 - 2 * u.fade);
      }

      dust.rotation.y = reduceMotion ? 0 : t * 0.012;
      dust.position.y = p * 1.2;
      dustMat.uniforms.uOpacity.value = 0.55 * globalFade.value;

      // 카드가 회전해 멈춰 있는 커서 아래로 들어와도 호버되도록 매 프레임 판정
      if (state.pointerInside && !drag.active) {
        raycaster.setFromCamera(state.ndc, camera);
        const hits = raycaster.intersectObjects(cards.filter((c) => c.visible && c.userData.fade > 0.5), false);
        setHovered(hits.length && globalFade.value > 0.5 ? hits[0].object : null);
      }
    }

    function render() {
      renderer.render(scene, camera);
    }

    function frame(now) {
      if (!state.running) return;
      state.raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - state.last) / 1000 || 0.016);
      state.last = now;
      update(dt);
      render();
    }

    function start() {
      if (state.running || reduceMotion || !state.visible || document.hidden || state.disposed) return;
      state.running = true;
      state.last = performance.now();
      state.raf = requestAnimationFrame(frame);
    }

    function stop() {
      state.running = false;
      cancelAnimationFrame(state.raf);
    }

    // 모션 줄이기 모드: 필요할 때만 한 프레임 렌더
    let pending = 0;
    function invalidate() {
      if (!reduceMotion || state.disposed) return;
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        update(0.016);
        render();
      });
    }
    invalidateRef.current = invalidate;

    // --- 이벤트: 호버 · 클릭(이동) · 카드 드래그 · 궤도 회전
    function onPointerMove(e) {
      if (drag.active && e.pointerId === drag.id) {
        const dx = e.clientX - drag.x0;
        const dy = e.clientY - drag.y0;
        if (!drag.moved && Math.hypot(dx, dy) > 6) {
          drag.moved = true;
          canvas.style.cursor = "grabbing";
          if (drag.mesh) setHovered(drag.mesh);
        }
        if (drag.moved) {
          const now = performance.now();
          const stepX = e.clientX - drag.lastX;
          const stepT = Math.max(8, now - drag.lastT) / 1000;
          if (drag.mode === "card") {
            raycaster.setFromCamera(toNdc(e.clientX, e.clientY, ndcTmp), camera);
            if (raycaster.ray.intersectPlane(dragPlane, dragHit)) {
              dragHit.sub(dragOffset);
              ring.worldToLocal(dragHit);
              drag.mesh.userData.dragPos.copy(dragHit);
            }
            drag.mesh.userData.tiltTarget = clamp((stepX / stepT) * 0.0005, -0.3, 0.3);
          } else {
            state.ringAngle += stepX * 0.006;
            state.spin = reduceMotion ? 0 : clamp((stepX * 0.006) / stepT, -3, 3);
          }
          drag.lastX = e.clientX;
          drag.lastT = now;
          invalidate();
        }
        return;
      }
      state.clientX = e.clientX;
      state.clientY = e.clientY;
      toNdc(e.clientX, e.clientY, state.ndc);
      state.pointerTarget.copy(state.ndc);
      state.pointerInside = e.pointerType === "mouse" || e.pointerType === "pen";
      if (reduceMotion) {
        setHovered(pick(e.clientX, e.clientY));
        invalidate();
      }
    }
    function onPointerLeave() {
      if (drag.active) return;
      state.pointerInside = false;
      state.pointerTarget.set(0, 0);
      setHovered(null);
      invalidate();
    }
    function onPointerDown(e) {
      if ((e.pointerType === "mouse" && e.button !== 0) || globalFade.value < 0.5) return;
      const mesh = pick(e.clientX, e.clientY);
      Object.assign(drag, {
        active: true,
        moved: false,
        mode: mesh ? "card" : "ring",
        mesh,
        id: e.pointerId,
        x0: e.clientX,
        y0: e.clientY,
        lastX: e.clientX,
        lastT: performance.now(),
      });
      if (mesh) {
        // 카메라를 향한 평면 위에서 끌도록, 잡은 지점과 카드 중심의 차이를 기억
        mesh.updateMatrixWorld();
        const center = new THREE.Vector3().setFromMatrixPosition(mesh.matrixWorld);
        camera.getWorldDirection(camDir);
        dragPlane.setFromNormalAndCoplanarPoint(camDir.negate(), center);
        raycaster.setFromCamera(toNdc(e.clientX, e.clientY, ndcTmp), camera);
        if (raycaster.ray.intersectPlane(dragPlane, dragHit)) dragOffset.copy(dragHit).sub(center);
        else dragOffset.set(0, 0, 0);
        mesh.userData.dragPos.copy(mesh.position);
      }
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // 포인터 캡처를 지원하지 않는 환경은 무시
      }
    }
    function endDrag(e, cancelled) {
      if (!drag.active || e.pointerId !== drag.id) return;
      const mesh = drag.mesh;
      const clicked = !drag.moved && !cancelled && mesh;
      Object.assign(drag, { active: false, moved: false, mode: null, mesh: null, id: null });
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // 이미 해제된 경우
      }
      canvas.style.cursor = state.hovered ? "grab" : "";
      if (clicked && globalFade.value >= 0.5) callbacks.current.onSelect?.(mesh.userData.item);
      invalidate();
    }
    const onPointerUp = (e) => endDrag(e, false);
    const onPointerCancel = (e) => endDrag(e, true);
    function onScroll() {
      state.scrollTarget = clamp(window.scrollY / Math.max(1, state.heroHeight), 0, 1);
      // 휠 스크롤은 pointermove가 없으므로 커서 아래 카드를 다시 계산
      if (state.pointerInside && !drag.active) toNdc(state.clientX, state.clientY, state.ndc);
      if (state.visible) invalidate();
    }
    function onMotionPref(e) {
      reduceMotion = e.matches;
      if (reduceMotion) {
        stop();
        state.spin = 0;
        invalidate();
      } else {
        start();
      }
    }
    // 창을 해상도가 다른 모니터로 옮기면 CSS 크기는 그대로여도 devicePixelRatio가 바뀜
    let dprMq = null;
    function watchDpr() {
      dprMq?.removeEventListener("change", onDpr);
      dprMq = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      dprMq.addEventListener("change", onDpr);
    }
    function onDpr() {
      resize();
      watchDpr();
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    function onContextLost(e) {
      e.preventDefault();
      stop();
      callbacks.current.onError?.(new Error("webglcontextlost"));
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("webglcontextlost", onContextLost);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    motionMq.addEventListener("change", onMotionPref);
    watchDpr();

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    const io = new IntersectionObserver(
      (entries) => {
        state.visible = entries[entries.length - 1].isIntersecting; // 가장 최근 상태
        if (state.visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(mount);

    resize();
    onScroll();
    update(0.016);
    render();
    start();

    return () => {
      state.disposed = true;
      if (state.hovered) callbacks.current.onHover?.(null);
      stop();
      cancelAnimationFrame(pending);
      invalidateRef.current = null;
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      motionMq.removeEventListener("change", onMotionPref);
      dprMq?.removeEventListener("change", onDpr);
      cards.forEach((c) => c.material.dispose());
      textures.forEach((tex) => tex.dispose());
      planeGeo.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [items]);

  return <div ref={mountRef} className="hero-canvas-mount" />;
}
