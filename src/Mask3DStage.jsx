import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Mask3DStage({
  textureUrl,
  depthUrl,
  scrollProgress = 0,
  activeArchetype = "oni",
  interactive = true,
  className = "",
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    scrollProgress: 0,
    pointerX: 0,
    pointerY: 0,
    dragRotX: 0,
    dragRotY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    curRotX: 0,
    curRotY: 0,
    curRotZ: 0,
  });

  const renderFnRef = useRef(null);

  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress;
    renderFnRef.current?.();
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.3);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Lightweight 3D Mask Relief Mesh (40x50 segments for fast CPU/GPU rendering)
    const geo = new THREE.PlaneGeometry(2.15, 2.68, 40, 50);
    const loader = new THREE.TextureLoader();

    const renderScene = () => {
      if (!renderer) return;
      const { scrollProgress: sp, pointerX, pointerY, dragRotX, dragRotY } =
        stateRef.current;

      const scrollYaw = Math.sin(sp * Math.PI * 2) * 0.38;
      const scrollPitch = Math.cos(sp * Math.PI) * 0.12;
      const targetRotY = scrollYaw + pointerX * 0.28 + dragRotY;
      const targetRotX = scrollPitch - pointerY * 0.18 + dragRotX;
      const targetRotZ = Math.sin(sp * 3.0) * 0.04;

      maskMesh.rotation.y = targetRotY;
      maskMesh.rotation.x = targetRotX;
      maskMesh.rotation.z = targetRotZ;

      backMesh.rotation.copy(maskMesh.rotation);
      ringA.rotation.z = sp * 1.8 + pointerX * 0.2;
      ringB.rotation.z = -sp * 1.4 - pointerY * 0.2;
      particles.rotation.y = sp * 0.9 + pointerX * 0.15;

      pointLight.position.x = pointerX * 1.8;
      pointLight.position.y = pointerY * 1.4 + 0.4;

      renderer.render(scene, camera);
    };

    renderFnRef.current = renderScene;

    const colorTex = loader.load(textureUrl, renderScene);
    colorTex.colorSpace = THREE.SRGBColorSpace;
    const depthTex = loader.load(depthUrl, renderScene);

    const mat = new THREE.MeshStandardMaterial({
      map: colorTex,
      displacementMap: depthTex,
      displacementScale: 0.56,
      displacementBias: -0.18,
      bumpMap: depthTex,
      bumpScale: 0.07,
      roughness: 0.42,
      metalness: 0.28,
      transparent: true,
      alphaTest: 0.08,
      side: THREE.DoubleSide,
    });

    const maskMesh = new THREE.Mesh(geo, mat);
    rootGroup.add(maskMesh);

    const backMat = new THREE.MeshStandardMaterial({
      map: colorTex,
      displacementMap: depthTex,
      displacementScale: 0.32,
      displacementBias: -0.25,
      color: new THREE.Color("#1a201e"),
      roughness: 0.75,
      metalness: 0.15,
      transparent: true,
      alphaTest: 0.1,
    });
    const backMesh = new THREE.Mesh(geo, backMat);
    backMesh.position.z = -0.07;
    rootGroup.add(backMesh);

    const ringGeoA = new THREE.TorusGeometry(1.42, 0.005, 12, 72);
    const ringMatA = new THREE.MeshBasicMaterial({
      color: 0xc8ccbe,
      transparent: true,
      opacity: 0.24,
    });
    const ringA = new THREE.Mesh(ringGeoA, ringMatA);
    ringA.rotation.set(1.12, -0.35, 0.2);
    rootGroup.add(ringA);

    const ringGeoB = new THREE.TorusGeometry(1.68, 0.004, 12, 72);
    const ringMatB = new THREE.MeshBasicMaterial({
      color: 0x9aa498,
      transparent: true,
      opacity: 0.15,
    });
    const ringB = new THREE.Mesh(ringGeoB, ringMatB);
    ringB.rotation.set(-0.95, 0.48, -0.3);
    rootGroup.add(ringB);

    const particleCount = 36;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.1 + (i % 7) * 0.14;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = ((i % 11) - 5) * 0.25;
      positions[i * 3 + 2] = Math.sin(angle) * 0.5;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd8dad0,
      size: 0.025,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(pGeo, pMat);
    rootGroup.add(particles);

    const ambient = new THREE.AmbientLight(0xd6d8ce, 1.35);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xf2efe4, 2.6);
    keyLight.position.set(2.4, 2.8, 3.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8fa198, 1.9);
    rimLight.position.set(-2.8, -1.5, 2.2);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xdce0d5, 1.6, 8);
    pointLight.position.set(0, 0.5, 2.6);
    scene.add(pointLight);

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1);
      stateRef.current.pointerX = Math.max(-1, Math.min(1, nx));
      stateRef.current.pointerY = Math.max(-1, Math.min(1, ny));

      if (stateRef.current.isDragging) {
        const dx = e.clientX - stateRef.current.lastX;
        const dy = e.clientY - stateRef.current.lastY;
        stateRef.current.dragRotY += dx * 0.008;
        stateRef.current.dragRotX = Math.max(
          -0.45,
          Math.min(0.45, stateRef.current.dragRotX + dy * 0.006)
        );
        stateRef.current.lastX = e.clientX;
        stateRef.current.lastY = e.clientY;
      }
      renderScene();
    };

    const onPointerDown = (e) => {
      if (!interactive) return;
      stateRef.current.isDragging = true;
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;
    };

    const onPointerUp = () => {
      stateRef.current.isDragging = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 380;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderScene();
    };
    window.addEventListener("resize", onResize, { passive: true });

    renderScene();

    return () => {
      renderFnRef.current = null;
      window.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      backMat.dispose();
      ringGeoA.dispose();
      ringMatA.dispose();
      ringGeoB.dispose();
      ringMatB.dispose();
      pGeo.dispose();
      pMat.dispose();
      colorTex.dispose();
      depthTex.dispose();
      renderer.dispose();
    };
  }, [textureUrl, depthUrl, interactive, activeArchetype]);

  return (
    <div
      ref={mountRef}
      className={`kage-webgl-canvas ${className}`}
      title="Drag or move cursor to orbit 3D sculpted mask"
      aria-hidden="true"
    />
  );
}
