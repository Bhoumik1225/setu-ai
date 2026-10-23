'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 1. Group for unified rotation & tilt
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 2. Outer Luminous Icosahedron Wireframe
    const coreGeo = new THREE.IcosahedronGeometry(26, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 3. Inner Glowing Octahedron
    const innerGeo = new THREE.OctahedronGeometry(15, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 4. Double Concentric Gimbal Orbit Rings
    const ring1Geo = new THREE.TorusGeometry(38, 0.45, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    mainGroup.add(ring1Mesh);

    const ring2Geo = new THREE.TorusGeometry(46, 0.35, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    ring2Mesh.rotation.x = -Math.PI / 6;
    mainGroup.add(ring2Mesh);

    // 5. Constellation Particles & Dynamic Neural Network Connections
    const particlesCount = 90;
    const particlePositions = new Float32Array(particlesCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 170;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 130;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 110;

      velocities.push({
        x: (Math.random() - 0.5) * 0.09,
        y: (Math.random() - 0.5) * 0.09,
        z: (Math.random() - 0.5) * 0.09,
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.6,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.9,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // Dynamic Line Connections for Nearest Particles
    const maxLines = 160;
    const linePositions = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    mainGroup.add(lineMesh);

    // Interactive Mouse Coordinates
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.035;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.035;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Handle Window Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth camera interpolation following mouse
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(scene.position);

      // Rotations
      coreMesh.rotation.y = elapsedTime * 0.14;
      coreMesh.rotation.x = elapsedTime * 0.09;

      innerMesh.rotation.y = -elapsedTime * 0.22;
      innerMesh.rotation.z = elapsedTime * 0.16;

      ring1Mesh.rotation.z = elapsedTime * 0.08;
      ring1Mesh.rotation.y = elapsedTime * 0.05;

      ring2Mesh.rotation.z = -elapsedTime * 0.07;
      ring2Mesh.rotation.x = elapsedTime * 0.06;

      // Drift and bounce particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i].x;
        positions[i3 + 1] += velocities[i].y;
        positions[i3 + 2] += velocities[i].z;

        if (Math.abs(positions[i3]) > 85) velocities[i].x *= -1;
        if (Math.abs(positions[i3 + 1]) > 65) velocities[i].y *= -1;
        if (Math.abs(positions[i3 + 2]) > 55) velocities[i].z *= -1;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Compute nearest neighbor connection lines dynamically
      let lineVertexIndex = 0;
      const lineArray = lineGeo.attributes.position.array as Float32Array;
      const connectionDistance = 32;

      for (let i = 0; i < particlesCount && lineVertexIndex < maxLines * 6; i++) {
        const i3 = i * 3;
        const x1 = positions[i3];
        const y1 = positions[i3 + 1];
        const z1 = positions[i3 + 2];

        for (let j = i + 1; j < particlesCount && lineVertexIndex < maxLines * 6; j++) {
          const j3 = j * 3;
          const x2 = positions[j3];
          const y2 = positions[j3 + 1];
          const z2 = positions[j3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionDistance) {
            lineArray[lineVertexIndex++] = x1;
            lineArray[lineVertexIndex++] = y1;
            lineArray[lineVertexIndex++] = z1;
            lineArray[lineVertexIndex++] = x2;
            lineArray[lineVertexIndex++] = y2;
            lineArray[lineVertexIndex++] = z2;
          }
        }
      }

      // Zero out unused line segments
      for (let k = lineVertexIndex; k < maxLines * 6; k++) {
        lineArray[k] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Comprehensive Cleanup to prevent WebGL memory leaks
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
