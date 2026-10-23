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
    // Reduced motion or disabled motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !ambientMotion) {
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // Quality tuning
    const particleCount = quality === 'high' ? (isMobile ? 40 : 85) : quality === 'balanced' ? (isMobile ? 26 : 58) : (isMobile ? 16 : 32);
    const maxDistance = isMobile ? 95 : 130;
    const pulseCount = quality === 'high' ? 18 : quality === 'balanced' ? 12 : 6;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    // Add subtle ambient fog to give deep cinematic 3D perspective
    scene.fog = new THREE.FogExp2(0x030712, 0.0022);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1200);
    camera.position.set(0, 0, 260);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: quality !== 'low',
        powerPreference: 'high-performance',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 2 : 1.5));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL not supported or context error:', e);
      return;
    }

    // 2. Interactive Mouse Coordinates & Cursor Raycasting plane
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, prevX: 0, prevY: 0, speed: 0 };
    const mouse3D = new THREE.Vector3(0, 0, 0);
    const clickImpulses: { position: THREE.Vector3; radius: number; life: number; color: THREE.Color }[] = [];

    // 3. Ambient 3D Lights for Rich Volume & Shading
    const ambientLight = new THREE.AmbientLight(0x0a192f, 1.2);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 2.5, 450);
    cyanPointLight.position.set(-160, 120, 100);
    scene.add(cyanPointLight);

    const violetPointLight = new THREE.PointLight(0xa78bfa, 2.2, 450);
    violetPointLight.position.set(160, -120, 80);
    scene.add(violetPointLight);

    const cursorLight = new THREE.PointLight(0x38bdf8, 3.2, 220);
    cursorLight.position.set(0, 0, 60);
    scene.add(cursorLight);

    // 4. 3D Digital Terrain Grid Mesh (Curved Safety Mesh in Deep Background)
    let terrainMesh: THREE.Mesh | null = null;
    let terrainGeo: THREE.PlaneGeometry | null = null;
    if (quality !== 'low') {
      const gridW = 500;
      const gridH = 360;
      const segW = quality === 'high' ? 42 : 28;
      const segH = quality === 'high' ? 32 : 20;
      terrainGeo = new THREE.PlaneGeometry(gridW, gridH, segW, segH);
      terrainGeo.rotateX(-Math.PI / 2.3);

      const terrainMat = new THREE.MeshBasicMaterial({
        color: 0x1e3a8a,
        wireframe: true,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
      });
      terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
      terrainMesh.position.set(0, -90, -120);
      scene.add(terrainMesh);
    }

    // 5. Central Holographic Core System (Orb + Rings + Gyroscope)
    const centralSystem = new THREE.Group();
    scene.add(centralSystem);

    let coreIcosahedron: THREE.Mesh | null = null;
    let coreGlowMesh: THREE.Mesh | null = null;
    let ringOuter: THREE.LineLoop | null = null;
    let ringMiddle: THREE.LineLoop | null = null;
    let ringInner: THREE.LineLoop | null = null;

    if (pageVariant === 'dashboard' || pageVariant === 'login') {
      const baseRadius = pageVariant === 'login' ? 48 : 38;

      // Holographic wireframe icosahedron
      const icoGeo = new THREE.IcosahedronGeometry(baseRadius, quality === 'high' ? 2 : 1);
      const icoMat = new THREE.MeshBasicMaterial({
        color: pageVariant === 'login' ? 0x818cf8 : 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: pageVariant === 'login' ? 0.28 : 0.18,
        blending: THREE.AdditiveBlending,
      });
      coreIcosahedron = new THREE.Mesh(icoGeo, icoMat);
      centralSystem.add(coreIcosahedron);

      // Inner glowing core nucleus
      const coreGeo = new THREE.SphereGeometry(baseRadius * 0.42, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: pageVariant === 'login' ? 0xc084fc : 0x38bdf8,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      });
      coreGlowMesh = new THREE.Mesh(coreGeo, coreMat);
      centralSystem.add(coreGlowMesh);

      // Gyroscopic orbital rings
      const createOrbitRing = (radius: number, color: number, opacity: number) => {
        const points = [];
        for (let i = 0; i <= 64; i++) {
          const theta = (i / 64) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
        });
        return new THREE.LineLoop(geo, mat);
      };

      ringOuter = createOrbitRing(baseRadius * 1.55, 0x06b6d4, 0.28);
      ringOuter.rotation.x = Math.PI / 3;
      centralSystem.add(ringOuter);

      ringMiddle = createOrbitRing(baseRadius * 1.3, 0xa78bfa, 0.24);
      ringMiddle.rotation.y = Math.PI / 4;
      centralSystem.add(ringMiddle);

      ringInner = createOrbitRing(baseRadius * 1.1, 0x38bdf8, 0.2);
      ringInner.rotation.x = -Math.PI / 5;
      centralSystem.add(ringInner);

      centralSystem.position.set(0, pageVariant === 'dashboard' ? 32 : 0, -40);
    }

    // 6. Neural Network Nodes & Dynamic Connecting Mesh
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];
    const colors = new Float32Array(particleCount * 3);

    const nodeColors = [
      new THREE.Color(0x06b6d4), // Cyan
      new THREE.Color(0x38bdf8), // Sky Blue
      new THREE.Color(0x818cf8), // Indigo
      new THREE.Color(0xa78bfa), // Soft Violet
      new THREE.Color(0xf472b6), // Coral Magenta
    ];

    const rangeX = window.innerWidth > 1200 ? 340 : 220;
    const rangeY = 190;
    const rangeZ = 180;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * rangeX * 2;
      const y = (Math.random() - 0.5) * rangeY * 2;
      const z = (Math.random() - 0.5) * rangeZ * 2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      velocities.push({
        x: (Math.random() - 0.5) * 0.22,
        y: (Math.random() - 0.5) * 0.22,
        z: (Math.random() - 0.5) * 0.18,
      });

      const col = nodeColors[i % nodeColors.length];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // High quality glowing node sprite
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(56, 189, 248, 0.95)');
      grad.addColorStop(0.5, 'rgba(167, 139, 250, 0.5)');
      grad.addColorStop(0.85, 'rgba(6, 182, 212, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const nodeTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 7.0,
      map: nodeTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlesMesh);

    // 7. Dynamic Inter-Node Connection Lines
    const maxLineSegments = particleCount * 14;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineColors = new Float32Array(maxLineSegments * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // 8. Glowing Data Packets Moving Along Active Network Lines
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseColors = new Float32Array(pulseCount * 3);
    const pulses: { startIdx: number; endIdx: number; progress: number; speed: number }[] = [];

    for (let p = 0; p < pulseCount; p++) {
      pulses.push({
        startIdx: Math.floor(Math.random() * particleCount),
        endIdx: Math.floor(Math.random() * particleCount),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.016,
      });

      pulsePositions[p * 3] = 0;
      pulsePositions[p * 3 + 1] = 0;
      pulsePositions[p * 3 + 2] = 0;

      const pCol = p % 2 === 0 ? new THREE.Color(0x38bdf8) : new THREE.Color(0xa78bfa);
      pulseColors[p * 3] = pCol.r;
      pulseColors[p * 3 + 1] = pCol.g;
      pulseColors[p * 3 + 2] = pCol.b;
    }

    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    pulseGeo.setAttribute('color', new THREE.BufferAttribute(pulseColors, 3));

    const pulseMat = new THREE.PointsMaterial({
      size: 9.0,
      map: nodeTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pulsesMesh = new THREE.Points(pulseGeo, pulseMat);
    scene.add(pulsesMesh);

    // 9. Interactive Shockwave Rings on Click
    const shockwaveGroup = new THREE.Group();
    scene.add(shockwaveGroup);

    // 10. Interactive Event Listeners (Mouse move, Click ripples)
    const onMouseMove = (e: MouseEvent) => {
      // Normalized coordinates [-1, 1]
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;

      mouse.targetX = nx * 50;
      mouse.targetY = ny * 35;

      // Project mouse into 3D world space
      mouse3D.set(nx * 180, ny * 110, 40);

      // Speed detection for interactive node disturbance
      const dx = e.clientX - mouse.prevX;
      const dy = e.clientY - mouse.prevY;
      mouse.speed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.1, 4.0);
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;

      cursorLight.position.set(mouse3D.x, mouse3D.y, 60);
    };

    const onClick = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      const clickWorldPos = new THREE.Vector3(nx * 180, ny * 110, 20);

      clickImpulses.push({
        position: clickWorldPos,
        radius: 10,
        life: 1.0,
        color: new THREE.Color(0x06b6d4),
      });

      // Spawn visual 3D expanding ripple ring
      const ringGeo = new THREE.RingGeometry(1, 3, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ripple = new THREE.Mesh(ringGeo, ringMat);
      ripple.position.copy(clickWorldPos);
      shockwaveGroup.add(ripple);

      // Animate and remove ripple
      const startT = performance.now();
      const expandDuration = 900;
      const expandRipple = () => {
        const elapsed = performance.now() - startT;
        const progress = elapsed / expandDuration;
        if (progress < 1) {
          const scale = 1 + progress * 55;
          ripple.scale.set(scale, scale, 1);
          ringMat.opacity = (1 - progress) * 0.85;
          requestAnimationFrame(expandRipple);
        } else {
          shockwaveGroup.remove(ripple);
          ringGeo.dispose();
          ringMat.dispose();
        }
      };
      expandRipple();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    // Handle Window Resize
    const onResize = () => {
      if (!renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Tab visibility handling
    let isTabVisible = true;
    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // 11. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const posAttr = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
    const linePosAttr = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
    const lineColAttr = lineGeometry.getAttribute('color') as THREE.BufferAttribute;
    const pulsePosAttr = pulseGeo.getAttribute('position') as THREE.BufferAttribute;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isTabVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax based on mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;
      camera.position.x = mouse.x;
      camera.position.y = mouse.y;
      camera.lookAt(0, 0, 0);

      // Gently animate ambient lights
      cyanPointLight.position.x = Math.sin(elapsedTime * 0.4) * 180;
      cyanPointLight.position.y = Math.cos(elapsedTime * 0.3) * 130;
      violetPointLight.position.x = -Math.sin(elapsedTime * 0.35) * 180;
      violetPointLight.position.y = -Math.cos(elapsedTime * 0.45) * 130;

      // Animate Central Gyroscopic Orb System
      if (coreIcosahedron) {
        coreIcosahedron.rotation.x += 0.0035;
        coreIcosahedron.rotation.y += 0.0045;
        const scaleWave = 1 + Math.sin(elapsedTime * 1.5) * 0.04;
        coreIcosahedron.scale.set(scaleWave, scaleWave, scaleWave);
      }
      if (coreGlowMesh) {
        const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.08;
        coreGlowMesh.scale.set(pulse, pulse, pulse);
      }
      if (ringOuter) {
        ringOuter.rotation.z += 0.003;
        ringOuter.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.6) * 0.15;
      }
      if (ringMiddle) {
        ringMiddle.rotation.z -= 0.004;
        ringMiddle.rotation.y = Math.PI / 4 + Math.cos(elapsedTime * 0.7) * 0.18;
      }
      if (ringInner) {
        ringInner.rotation.z += 0.005;
        ringInner.rotation.x = -Math.PI / 5 + Math.sin(elapsedTime * 0.8) * 0.12;
      }

      // Animate 3D Terrain Wave Grid
      if (terrainMesh && terrainGeo) {
        const pos = terrainGeo.attributes.position;
        for (let k = 0; k < pos.count; k++) {
          const u = pos.getX(k);
          const v = pos.getY(k);
          const z = Math.sin(u * 0.03 + elapsedTime * 1.2) * 5 + Math.cos(v * 0.03 + elapsedTime * 0.9) * 4;
          pos.setZ(k, z);
        }
        pos.needsUpdate = true;
      }

      // Update Node Positions + Interactive Mouse Repulsion / Impulse
      const posArray = posAttr.array as Float32Array;
      const decayImpulses = [];

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        posArray[idx] += velocities[i].x;
        posArray[idx + 1] += velocities[i].y;
        posArray[idx + 2] += velocities[i].z;

        // Boundaries
        if (Math.abs(posArray[idx]) > rangeX) velocities[i].x *= -1;
        if (Math.abs(posArray[idx + 1]) > rangeY) velocities[i].y *= -1;
        if (Math.abs(posArray[idx + 2]) > rangeZ) velocities[i].z *= -1;

        // Interactive Mouse Cursor Push/Disturbance
        const dx = posArray[idx] - mouse3D.x;
        const dy = posArray[idx + 1] - mouse3D.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        const cursorInfluenceRadius = 80;

        if (distToMouse < cursorInfluenceRadius && distToMouse > 0.1) {
          const force = (1 - distToMouse / cursorInfluenceRadius) * (1.2 + mouse.speed);
          posArray[idx] += (dx / distToMouse) * force * 1.8;
          posArray[idx + 1] += (dy / distToMouse) * force * 1.8;
        }

        // Click impulse wave effect
        for (const impulse of clickImpulses) {
          const ix = posArray[idx] - impulse.position.x;
          const iy = posArray[idx + 1] - impulse.position.y;
          const iDist = Math.sqrt(ix * ix + iy * iy);
          if (iDist < impulse.radius + 30 && iDist > impulse.radius - 20) {
            const push = (1 - Math.abs(iDist - impulse.radius) / 30) * 3.5 * impulse.life;
            posArray[idx] += (ix / (iDist || 1)) * push;
            posArray[idx + 1] += (iy / (iDist || 1)) * push;
          }
        }
      }
      posAttr.needsUpdate = true;

      // Progress click impulses
      for (let k = clickImpulses.length - 1; k >= 0; k--) {
        const imp = clickImpulses[k];
        imp.radius += 120 * delta;
        imp.life -= delta * 1.4;
        if (imp.life <= 0) {
          clickImpulses.splice(k, 1);
        }
      }

      // Calculate Inter-Node Connection Lines
      let lineVertexIdx = 0;
      let lineSegmentsDrawn = 0;
      const linePosArray = linePosAttr.array as Float32Array;
      const lineColArray = lineColAttr.array as Float32Array;

      // Array of active connections for data packet movement
      const activeConnections: { x1: number; y1: number; z1: number; x2: number; y2: number; z2: number }[] = [];

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
            const dist = Math.sqrt(distSq);
            const alpha = Math.pow(1.0 - dist / maxDistance, 1.4);

            linePosArray[lineVertexIdx] = x1;
            linePosArray[lineVertexIdx + 1] = y1;
            linePosArray[lineVertexIdx + 2] = z1;

            linePosArray[lineVertexIdx + 3] = x2;
            linePosArray[lineVertexIdx + 4] = y2;
            linePosArray[lineVertexIdx + 5] = z2;

            // Vibrant gradient lines: cyan to soft violet
            lineColArray[lineVertexIdx] = 0.05 * alpha;
            lineColArray[lineVertexIdx + 1] = 0.72 * alpha;
            lineColArray[lineVertexIdx + 2] = 0.88 * alpha;

            lineColArray[lineVertexIdx + 3] = 0.65 * alpha;
            lineColArray[lineVertexIdx + 4] = 0.45 * alpha;
            lineColArray[lineVertexIdx + 5] = 0.98 * alpha;

            lineVertexIdx += 6;
            lineSegmentsDrawn++;

            if (activeConnections.length < 50) {
              activeConnections.push({ x1, y1, z1, x2, y2, z2 });
            }
          }
        }
      }

      lineGeometry.setDrawRange(0, lineSegmentsDrawn * 2);
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;

      // Update and Draw Data Packets along Active Pathways
      const pulsePosArray = pulsePosAttr.array as Float32Array;
      for (let p = 0; p < pulses.length; p++) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1.0) {
          pulse.progress = 0;
          pulse.startIdx = Math.floor(Math.random() * particleCount);
          pulse.endIdx = Math.floor(Math.random() * particleCount);
        }

        const sx = posArray[pulse.startIdx * 3];
        const sy = posArray[pulse.startIdx * 3 + 1];
        const sz = posArray[pulse.startIdx * 3 + 2];

        const ex = posArray[pulse.endIdx * 3];
        const ey = posArray[pulse.endIdx * 3 + 1];
        const ez = posArray[pulse.endIdx * 3 + 2];

        pulsePosArray[p * 3] = sx + (ex - sx) * pulse.progress;
        pulsePosArray[p * 3 + 1] = sy + (ey - sy) * pulse.progress;
        pulsePosArray[p * 3 + 2] = sz + (ez - sz) * pulse.progress;
      }
      pulsePosAttr.needsUpdate = true;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
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
      nodeTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();

      if (terrainMesh && terrainGeo) {
        terrainGeo.dispose();
        (terrainMesh.material as THREE.Material).dispose();
      }
      if (coreIcosahedron) {
        coreIcosahedron.geometry.dispose();
        (coreIcosahedron.material as THREE.Material).dispose();
      }
      if (coreGlowMesh) {
        coreGlowMesh.geometry.dispose();
        (coreGlowMesh.material as THREE.Material).dispose();
      }
      if (ringOuter) {
        ringOuter.geometry.dispose();
        (ringOuter.material as THREE.Material).dispose();
      }
      if (ringMiddle) {
        ringMiddle.geometry.dispose();
        (ringMiddle.material as THREE.Material).dispose();
      }
      if (ringInner) {
        ringInner.geometry.dispose();
        (ringInner.material as THREE.Material).dispose();
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
