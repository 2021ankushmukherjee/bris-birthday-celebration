"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles, Text } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Balloon({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime + position[0]) * .12; });
  return <group ref={ref} position={position}><mesh><sphereGeometry args={[.34, 24, 24]} /><meshStandardMaterial color={color} roughness={.35} /></mesh><mesh position={[0, -.43, 0]}><cylinderGeometry args={[.008, .008, .42, 8]} /><meshStandardMaterial color="#d7b16b" /></mesh></group>;
}
function Cake({ lit, onCake }: { lit: boolean; onCake: () => void }) {
  return <group onClick={(e) => { e.stopPropagation(); onCake(); }} position={[0, -1.1, 0]}>
    {[{ r: 1.05, y: 0 }, { r: .77, y: .42 }, { r: .5, y: .78 }].map((x) => <mesh key={x.y} position={[0, x.y, 0]} castShadow><cylinderGeometry args={[x.r, x.r * 1.08, .42, 48]} /><meshStandardMaterial color="#f7c5d2" roughness={.55} /></mesh>)}
    {[[-.3, 1.25], [0, 1.25], [.3, 1.25]].map(([x, y]) => <group key={x} position={[x, y, 0]}><mesh><cylinderGeometry args={[.035, .035, .34, 12]} /><meshStandardMaterial color="#ffd782" emissive="#8b4e20" /></mesh>{lit && <pointLight color="#ffbf54" intensity={2} distance={2} />}{lit && <mesh position={[0, .24, 0]}><sphereGeometry args={[.09, 12, 12]} /><meshBasicMaterial color="#fff2a8" /></mesh>}</group>)}
    <Text position={[0, 1.48, 0]} fontSize={.2} color="#b17932" anchorX="center">MAKE A WISH</Text>
  </group>;
}
export default function BirthdayRoom({ lit, onCake }: { lit: boolean; onCake: () => void }) {
 return <Canvas shadows camera={{ position: [0, 1.3, 6.6], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
   <color attach="background" args={["#100d2a"]} /><fog attach="fog" args={["#100d2a", 7, 16]} />
   <ambientLight intensity={.75} /><pointLight position={[0, 4, 2]} intensity={lit ? 55 : 20} color="#ffca9b" distance={8} /><pointLight position={[-4, 1, -2]} intensity={13} color="#bfa9ff" distance={6} />
   <mesh position={[0, -1.55, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[14, 14]} /><meshStandardMaterial color="#342848" roughness={.85} /></mesh>
   <mesh position={[0, 1.6, -2.5]}><planeGeometry args={[12, 7]} /><meshStandardMaterial color="#241d3e" /></mesh>
   <mesh position={[0, -.75, .1]}><cylinderGeometry args={[1.45, 1.45, .14, 48]} /><meshStandardMaterial color="#d4a95f" metalness={.65} roughness={.25} /></mesh>
   <Cake lit={lit} onCake={onCake} /><Sparkles count={70} scale={[8, 4, 5]} size={2} speed={.25} color="#ffe5a6" />
   <Float speed={1.4} floatIntensity={.45}><Balloon position={[-2.6, 1.5, -1]} color="#f4aac2" /></Float><Float speed={1.7} floatIntensity={.4}><Balloon position={[2.6, 1.1, -1]} color="#c8b1f4" /></Float><Float speed={1.2} floatIntensity={.35}><Balloon position={[3.3, 2.2, -1]} color="#ffd18c" /></Float>
   <Text position={[0, 2.8, -2.35]} fontSize={.5} color="#f9deb0" anchorX="center">HAPPY BIRTHDAY</Text>
   <OrbitControls enablePan={false} minDistance={4.3} maxDistance={8} maxPolarAngle={Math.PI / 2.05} />
 </Canvas>;
}
