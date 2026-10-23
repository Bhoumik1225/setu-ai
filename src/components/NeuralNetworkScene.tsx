'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BackgroundQuality } from '@/context/AuthContext';

interface NeuralNetworkSceneProps {
  pageVariant?: 'dashboard' | 'logs' | 'login';
  ambientMotion?: boolean;
  quality?: BackgroundQuality;
}

export const NeuralNetworkScene: React.FC<NeuralNetworkSceneProps> = ({
  pageVariant = 'dashboard',
  ambientMotion = true,
  quality = 'balanced',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check WebGL support & reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !ambientMotion) {
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    // Check device / mobile
    const isMobile = window.innerWidth < 768;

    // Quality tuning: particle counts
    const particleCount = quality === 'high' ? (isMobile ? 30 : 65) : quality === 'balanced' ? (isMobile ? 22 : 45) : (isMobile ? 12 : 25);
    const maxDistance = isMobile ? 85 : 120;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 240;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: quality !== 'low', powerPreference: 'low-power' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1.5));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL not supported or context error:', e);
      return;
    }

    // 2. Nodes / Glass-like Particles in 3D Space
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];
    const colors = new Float32Array(particleCount * 3);

    // Color palette: Teal Cyan (#06B6D4), Electric Blue (#2563EB), Soft Violet (#A78BFA)
    const colorPalette = [
      new THREE.Color(0x06b6d4),
      new THREE.Color(0x2563eb),
      new THREE.Color(0xa78bfa),
    ];

    const rangeX = window.innerWidth > 1200 ? 320 : 200;
    const rangeY = 180;
    const rangeZ = 160;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * rangeX * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * rangeY * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * rangeZ * 2;

      velocities.push({
        x: (Math.random() - 0.5) * 0.18,
        y: (Math.random() - 0.5) * 0.18,
        z: (Math.random() - 0.5) * 0.15,
      });

      const chosenColor = colorPalette[i % colorPalette.length];
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite texture (circular glow)
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.35, 'rgba(6, 182, 212, 0.8)');
      gradient.addColorStop(0.7, 'rgba(167, 139, 250, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 5.5,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlesMesh);

    // 3. Fine Connection Lines between nearby nodes
    const maxLineSegments = particleCount * (particleCount - 1);
    const linePositions = new Float32Array(maxLineSegments * 3);
    const lineColors = new Float32Array(maxLineSegments * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // 4. Subtle central rotating orb or abstract wireframe sphere
    let centralOrb: THREE.Mesh | null = null;
    let nodeRing: THREE.LineLoop | null = null;

    if (pageVariant === 'dashboard' || pageVariant === 'login') {
      const orbRadius = pageVariant === 'login' ? 45 : 36;
      const orbGeometry = new THREE.IcosahedronGeometry(orbRadius, quality === 'high' ? 2 : 1);
      const orbMaterial = new THREE.MeshBasicMaterial({
        color: pageVariant === 'login' ? 0x6d28d9 : 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: pageVariant === 'login' ? 0.22 : 0.12,
        blending: THREE.AdditiveBlending,
      });
      centralOrb = new THREE.Mesh(orbGeometry, orbMaterial);
      centralOrb.position.set(0, pageVariant === 'dashboard' ? 30 : 0, -30);
      scene.add(centralOrb);

      // Node ring for login or hero emphasis
      if (pageVariant === 'login' || quality === 'high') {
        const ringGeo = new THREE.BufferGeometry();
        const ringPoints = [];
        const ringRadius = 65;
        for (let r = 0; r <= 64; r++) {
          const theta = (r / 64) * Math.PI * 2;
          ringPoints.push(new THREE.Vector3(Math.cos(theta) * ringRadius, Math.sin(theta) * ringRadius, 0));
        }
        ringGeo.setFromPoints(ringPoints);
        const ringMat = new THREE.LineBasicMaterial({
          color: 0x2563eb,
          transparent: true,
          opacity: 0.18,
          blending: THREE.AdditiveBlending,
        });
        nodeRing = new THREE.LineLoop(ringGeo, ringMat);
        nodeRing.rotation.x = Math.PI / 3;
        scene.add(nodeRing);
      }
    }

    // 5. Floating geometric accents at different depths
    const floatersGroup = new THREE.Group();
    if (quality !== 'low' && !isMobile) {
      const octaGeo = new THREE.OctahedronGeometry(6, 0);
      const tetraGeo = new THREE.TetrahedronGeometry(7, 0);
      const accentMat = new THREE.MeshBasicMaterial({
        color: 0xa78bfa,
        wireframe: true,
        transparent: true,
        opacity: 0.14,
      });

      for (let g = 0; g < 4; g++) {
        const mesh = new THREE.Mesh(g % 2 === 0 ? octaGeo : tetraGeo, accentMat);
        mesh.position.set((Math.random() - 0.5) * 360, (Math.random() - 0.5) * 180, (Math.random() - 0.5) * 100);
        floatersGroup.add(mesh);
      }
      scene.add(floatersGroup);
    }

    // 6. Mouse movement parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.04;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.04;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Handle Window Resize
    const onResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Visibility change: pause rendering when tab is inactive to save battery
    let isTabVisible = true;
    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // 7. Animation Loop with Node Movement & Data Line Updates
    let animationFrameId: number;
    const posAttr = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
    const linePosAttr = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
    const lineColAttr = lineGeometry.getAttribute('color') as THREE.BufferAttribute;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      // Smooth camera parallax
      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;
      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(scene.position);

      // Rotate central wireframe orbs gently
      if (centralOrb) {
        centralOrb.rotation.x += 0.0015;
        centralOrb.rotation.y += 0.0022;
      }
      if (nodeRing) {
        nodeRing.rotation.z += 0.0018;
      }

      // Rotate subtle floating geometry
      if (floatersGroup) {
        floatersGroup.rotation.y += 0.001;
      }

      // Update node positions with gentle velocities
      const posArray = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        posArray[idx] += velocities[i].x;
        posArray[idx + 1] += velocities[i].y;
        posArray[idx + 2] += velocities[i].z;

        // Soft bounce boundaries
        if (Math.abs(posArray[idx]) > rangeX) velocities[i].x *= -1;
        if (Math.abs(posArray[idx + 1]) > rangeY) velocities[i].y *= -1;
        if (Math.abs(posArray[idx + 2]) > rangeZ) velocities[i].z *= -1;
      }
      posAttr.needsUpdate = true;

      // Calculate connection lines dynamically
      let lineVertexIndex = 0;
      let lineCount = 0;
      const linePosArray = linePosAttr.array as Float32Array;
      const lineColArray = lineColAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const x1 = posArray[i * 3];
        const y1 = posArray[i * 3 + 1];
        const z1 = posArray[i * 3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const x2 = posArray[j * 3];
          const y2 = posArray[j * 3 + 1];
          const z2 = posArray[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxDistance * maxDistance) {
            const alpha = 1.0 - Math.sqrt(distSq) / maxDistance;

            linePosArray[lineVertexIndex] = x1;
            linePosArray[lineVertexIndex + 1] = y1;
            linePosArray[lineVertexIndex + 2] = z1;

            linePosArray[lineVertexIndex + 3] = x2;
            linePosArray[lineVertexIndex + 4] = y2;
            linePosArray[lineVertexIndex + 5] = z2;

            // Blend colors with distance alpha
            lineColArray[lineVertexIndex] = 0.02 * alpha;
            lineColArray[lineVertexIndex + 1] = 0.71 * alpha; // Cyan highlight
            lineColArray[lineVertexIndex + 2] = 0.83 * alpha;

            lineColArray[lineVertexIndex + 3] = 0.43 * alpha; // Royal indigo / violet
            lineColArray[lineVertexIndex + 4] = 0.28 * alpha;
            lineColArray[lineVertexIndex + 5] = 0.98 * alpha;

            lineVertexIndex += 6;
            lineCount++;
          }
        }
      }

      lineGeometry.setDrawRange(0, lineCount * 2);
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // 8. Proper Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      if (renderer) {
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      texture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      if (centralOrb) {
        centralOrb.geometry.dispose();
        (centralOrb.material as THREE.Material).dispose();
      }
      if (nodeRing) {
        nodeRing.geometry.dispose();
        (nodeRing.material as THREE.Material).dispose();
      }
    };
  }, [pageVariant, ambientMotion, quality]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      style={{ opacity: ambientMotion ? 1 : 0, transition: 'opacity 0.8s ease' }}
    />
  );
};
