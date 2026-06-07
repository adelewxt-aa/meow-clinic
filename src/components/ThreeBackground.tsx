'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Minimal floating wireframe sphere — subtle, refined
    const geo = new THREE.IcosahedronGeometry(1.8, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x1a1a1a,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(2.2, 0.6, 0);
    scene.add(sphere);

    // Accent ring (orange) — barely visible whisper of color
    const ringGeo = new THREE.TorusGeometry(1.1, 0.005, 16, 200);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff6b35,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(-2.6, -0.4, 0);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Particle dust
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x1a1a1a,
      size: 0.018,
      transparent: true,
      opacity: 0.35,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      sphere.rotation.x = t * 0.07;
      sphere.rotation.y = t * 0.1;
      ring.rotation.z = t * 0.18;
      dust.rotation.y = t * 0.02;

      camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      geo.dispose();
      mat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
