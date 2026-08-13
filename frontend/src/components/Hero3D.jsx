import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Core shape: an energy core with orbiting tech elements that represent
 * software engineering (rotating hex/conduit, orbiting code brackets).
 */
function EnergyCore({ dark }) {
  const core = useRef();
  const ringA = useRef();
  const ringB = useRef();
  const wire = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (core.current) core.current.rotation.y += delta * 0.4;
    if (ringA.current) {
      ringA.current.rotation.x += delta * 0.6;
      ringA.current.rotation.y += delta * 0.2;
    }
    if (ringB.current) {
      ringB.current.rotation.z -= delta * 0.5;
    }
    if (wire.current) {
      wire.current.rotation.y += delta * 0.15;
    }
  });

  const accent = dark ? '#7aa7ff' : '#2563eb';

  return (
    <group>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial
            color={accent}
            wireframe
            emissive={accent}
            emissiveIntensity={0.55}
            transparent
            opacity={0.85}
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} roughness={0.2} />
        </mesh>
      </Float>

      {/* Orbit rings */}
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.1, 0.025, 16, 90]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ringB} rotation={[0, Math.PI / 3, Math.PI / 5]}>
        <torusGeometry args={[2.5, 0.02, 16, 90]} />
        <meshBasicMaterial color="#94b4fd" transparent opacity={0.4} />
      </mesh>

      {/* Rotating wireframe sphere shell */}
      <mesh ref={wire}>
        <sphereGeometry args={[3.2, 24, 24]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.14} />
      </mesh>

      {/* Floating data bits (code blocks) around the core */}
      {[
        { pos: [2.0, 0.5, 0.4], type: 'tetra', color: '#60a5fa' },
        { pos: [-2.0, -0.4, 0.3], type: 'cube', color: '#3b82f6' },
        { pos: [0.3, 1.9, 0.5], type: 'octa', color: '#1d4fc8' },
        { pos: [-0.4, -1.95, 0.5], type: 'tetra', color: '#94b4fd' },
        { pos: [1.6, -1.3, 0.6], type: 'cube', color: '#2563eb' },
        { pos: [-1.7, 1.4, 0.6], type: 'octa', color: '#608ffa' },
      ].map(({ pos, type, color }, i) => (
        <Float key={i} speed={2 + i * 0.3} floatIntensity={1.4} rotationIntensity={0.8}>
          <mesh position={pos}>
            {type === 'cube' && <boxGeometry args={[0.22, 0.22, 0.22]} />}
            {type === 'tetra' && <tetrahedronGeometry args={[0.24, 0]} />}
            {type === 'octa' && <octahedronGeometry args={[0.24, 0]} />}
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.7}
              roughness={0.25}
              metalness={0.4}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Stars({ dark }) {
  const ref = useRef();
  const count = dark ? 700 : 300;
  useEffect(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 26;
      positions[i + 1] = (Math.random() - 0.5) * 26;
      positions[i + 2] = (Math.random() - 0.5) * 26;
    }
    ref.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry />
      <pointsMaterial
        size={0.035}
        color={dark ? '#93b4ff' : '#4f7ae0'}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ dark }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.7 : 1.1} />
      <directionalLight position={[5, 6, 6]} intensity={1.4} />
      <pointLight position={[-4, -3, -5]} intensity={0.8} color="#2563eb" />
      <Stars dark={dark} />
      <EnergyCore dark={dark} />
    </>
  );
}

export default function Hero3D() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onTheme = () => setDark(document.documentElement.classList.contains('dark'));
    onTheme();
    const obs = new MutationObserver(onTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[500px]">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene dark={dark} />
        </Suspense>
      </Canvas>
    </div>
  );
}