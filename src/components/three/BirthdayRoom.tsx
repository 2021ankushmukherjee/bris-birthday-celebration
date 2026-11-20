"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles, Text } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cakeChoices, type CakeFlavor } from "@/config/cakes";

const outerFlameProfile = [new THREE.Vector2(0, 0), new THREE.Vector2(.075, .025), new THREE.Vector2(.09, .105), new THREE.Vector2(.055, .2), new THREE.Vector2(0, .3)];
const innerFlameProfile = [new THREE.Vector2(0, .01), new THREE.Vector2(.04, .035), new THREE.Vector2(.048, .1), new THREE.Vector2(.025, .17), new THREE.Vector2(0, .22)];

function CandleFlame({ index }: { index: number }) {
  const flame = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (!flame.current) return; const sway = Math.sin(clock.elapsedTime * 7 + index * 1.8) * .11; flame.current.rotation.z = sway; flame.current.rotation.x = Math.cos(clock.elapsedTime * 5 + index) * .035; flame.current.scale.y = 1 + Math.sin(clock.elapsedTime * 9 + index) * .08; });
  return <group ref={flame} position={[0, .19, 0]}><mesh><latheGeometry args={[outerFlameProfile, 20]} /><meshStandardMaterial color="#ff8a24" emissive="#ff5a12" emissiveIntensity={2.6} roughness={.18} /></mesh><mesh position={[0, .005, .008]}><latheGeometry args={[innerFlameProfile, 20]} /><meshBasicMaterial color="#fff2a5" /></mesh></group>;
}

function useBalloonPop() {
  const [popped, setPopped] = useState(false), [burstId, setBurstId] = useState(0), [burstActive, setBurstActive] = useState(false);
  const respawnTimer = useRef<number | null>(null), burstTimer = useRef<number | null>(null), reappearedAt = useRef(0);
  useEffect(() => () => { if (respawnTimer.current) clearTimeout(respawnTimer.current); if (burstTimer.current) clearTimeout(burstTimer.current); }, []);
  const pop = () => { if (popped) return; setPopped(true); setBurstActive(true); setBurstId((value) => value + 1); burstTimer.current = window.setTimeout(() => setBurstActive(false), 1500); respawnTimer.current = window.setTimeout(() => { reappearedAt.current = performance.now(); setPopped(false); }, 2800); };
  return { popped, burstId, burstActive, reappearedAt, pop };
}

function Balloon({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Group>(null), visual = useRef<THREE.Group>(null), { popped, burstId, burstActive, reappearedAt, pop } = useBalloonPop();
  useFrame(({ clock }) => { if (!ref.current || !visual.current) return; ref.current.position.y = position[1] + Math.sin(clock.elapsedTime + position[0]) * .12; const appearedFor = reappearedAt.current ? (performance.now() - reappearedAt.current) / 1000 : 1; visual.current.scale.setScalar((popped ? .001 : Math.min(1, appearedFor / 1.15)) * scale); });
  return <group ref={ref} position={position} onClick={(event) => { event.stopPropagation(); pop(); }}><group ref={visual}><mesh><sphereGeometry args={[.34, 24, 24]} /><meshStandardMaterial color={color} roughness={.35} /></mesh><mesh position={[0, -.43, 0]}><cylinderGeometry args={[.008, .008, .42, 8]} /><meshStandardMaterial color="#d7b16b" /></mesh></group>{burstActive && <BalloonConfetti key={`round-burst-${burstId}`} />}</group>;
}

const heartShape = new THREE.Shape();
heartShape.moveTo(0, -.28); heartShape.bezierCurveTo(-.55, .1, -.38, .5, 0, .22); heartShape.bezierCurveTo(.38, .5, .55, .1, 0, -.28);
function HeartBalloon({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Group>(null), visual = useRef<THREE.Group>(null), { popped, burstId, burstActive, reappearedAt, pop } = useBalloonPop();
  useFrame(({ clock }) => { if (!ref.current || !visual.current) return; ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.2 + position[0]) * .1; ref.current.rotation.z = Math.sin(clock.elapsedTime + position[0]) * .05; const appearedFor = reappearedAt.current ? (performance.now() - reappearedAt.current) / 1000 : 1; visual.current.scale.setScalar((popped ? .001 : Math.min(1, appearedFor / 1.15)) * scale); });
  return <group ref={ref} position={position} onClick={(event) => { event.stopPropagation(); pop(); }}><group ref={visual}><mesh scale={[.62, .62, .62]}><shapeGeometry args={[heartShape]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.12} roughness={.28} metalness={.12} side={THREE.DoubleSide} /></mesh><mesh position={[0, -.56, 0]}><cylinderGeometry args={[.008, .008, .5, 8]} /><meshStandardMaterial color="#d7b16b" /></mesh></group>{burstActive && <BalloonConfetti key={`heart-burst-${burstId}`} />}</group>;
}

function RosePetals() {
  const petals = Array.from({ length: 42 }, (_, index) => { const angle = index * 2.42; const radius = .56 + (index % 6) * .12; return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, rotation: angle * 1.7, color: index % 5 < 3 ? "#c93456" : index % 5 === 3 ? "#e95775" : "#f6a0b4" }; });
  return <group position={[0, -.66, .04]}>{petals.map((petal, index) => <mesh key={`petal-${index}`} position={[petal.x, .012, petal.z]} rotation={[-Math.PI / 2, 0, petal.rotation]} scale={[1, .65, 1]}><circleGeometry args={[.065, 14]} /><meshStandardMaterial color={petal.color} roughness={.55} side={THREE.DoubleSide} /></mesh>)}</group>;
}

function Cake({ lit, cut, flavor }: { lit: boolean; cut: boolean; flavor: CakeFlavor }) {
  const style = cakeChoices.find((cake) => cake.id === flavor)!;
  return <group position={[0, -1.1, 0]}>
    {[{ r: 1.05, y: 0 }, { r: .77, y: .42 }, { r: .5, y: .78 }].map((x, index) => <group key={`cake-tier-${index}`} position={[0, x.y, 0]}><mesh castShadow><cylinderGeometry args={[x.r, x.r * 1.08, .42, 48]} /><meshStandardMaterial color={style.frosting} roughness={.48} /></mesh><mesh position={[0, .205, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[x.r * .92, .035, 10, 48]} /><meshStandardMaterial color={style.filling} roughness={.38} /></mesh></group>)}
    {[[-.3, 1.25], [0, 1.25], [.3, 1.25]].map(([x, y], index) => <group key={`candle-${index}`} position={[x, y, 0]}><mesh><cylinderGeometry args={[.047, .047, .23, 16]} /><meshStandardMaterial color="#ff9fbb" emissive="#7e1f45" emissiveIntensity={.2} roughness={.32} /></mesh><mesh position={[0, .118, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.049, .009, 8, 16]} /><meshBasicMaterial color="#fff0a6" /></mesh>{lit && <><pointLight position={[0, .22, 0]} color="#ff9d35" intensity={2.2} distance={2} /><CandleFlame index={index} /></>}</group>)}
    {cut && <><mesh position={[.52, .42, .55]} rotation={[0, -.55, 0]}><boxGeometry args={[.44, .42, .5]} /><meshStandardMaterial color={style.frosting} roughness={.48} /></mesh><mesh position={[.52, .64, .55]} rotation={[0, -.55, 0]}><boxGeometry args={[.45, .025, .51]} /><meshStandardMaterial color={style.filling} /></mesh></>}
    <Text position={[0, 1.72, .03]} fontSize={.13} color="#ffe7a4" anchorX="center">{cut ? "A SLICE FOR THE BIRTHDAY GIRL" : style.name.toUpperCase()}</Text>
  </group>;
}

function ResponsiveCakeScene({ lit, cut, flavor }: { lit: boolean; cut: boolean; flavor: CakeFlavor }) {
  const { size } = useThree();
  const scale = size.width <= 480 ? .68 : size.width <= 850 ? .84 : 1;
  return <group scale={[scale, size.width <= 480 ? .8 : .9, scale]}>
    <mesh position={[0, -.75, .1]}><cylinderGeometry args={[1.45, 1.45, .14, 48]} /><meshStandardMaterial color="#d4a95f" metalness={.65} roughness={.25} /></mesh>
    <Cake lit={lit} cut={cut} flavor={flavor} />
    <RosePetals />
  </group>;
}

function Diya({ position, on }: { position: [number, number, number]; on: boolean }) {
  return <group position={position}><mesh><cylinderGeometry args={[.15, .1, .07, 24]} /><meshStandardMaterial color="#c96a2a" metalness={.45} roughness={.3} /></mesh><mesh position={[0, .055, 0]}><sphereGeometry args={[.12, 20, 12]} /><meshStandardMaterial color="#f1a24c" emissive={on ? "#f08a28" : "#000000"} emissiveIntensity={on ? 2 : 0} /></mesh>{on && <><pointLight position={[0, .22, 0]} color="#ffb655" intensity={1.3} distance={2.3} /><mesh position={[0, .19, 0]} scale={[.55, 1.15, .55]}><sphereGeometry args={[.1, 14, 14]} /><meshBasicMaterial color="#fff1a5" /></mesh></>}</group>;
}

function DiwaliLights({ on, diyaScale = 1 }: { on: boolean; diyaScale?: number }) {
  const colors = ["#fff2ad", "#f6b8b7", "#d8c2ff", "#c8f0ec", "#ffe09a", "#f9c9d7"];
  const ceilingBulbs = [-4.15, -3.1, -2.05, -.95, .1, 1.15, 2.15, 3.15, 4.05];
  const lanterns = [-3.35, -2.85, 2.85, 3.35];
  return <group><group position={[0, 3.18, -1.82]}>{ceilingBulbs.map((x, index) => <Float key={`ceiling-bulb-${index}`} speed={1.1 + index * .07} floatIntensity={.08}><group position={[x, index % 2 ? -.08 : .04, 0]}><mesh><sphereGeometry args={[.115, 16, 16]} /><meshStandardMaterial color={on ? colors[index % colors.length] : "#413956"} emissive={on ? colors[index % colors.length] : "#000000"} emissiveIntensity={on ? 2.8 : 0} /></mesh>{on && <pointLight color={colors[index % colors.length]} intensity={.65} distance={1.5} />}</group></Float>)}</group><group position={[0, 1.66, -2.18]}>{lanterns.map((x, index) => <Float key={`lantern-${index}`} speed={1.15 + index * .1} floatIntensity={.08}><group position={[x, index % 2 ? .12 : -.05, 0]}><mesh position={[0, .23, -.015]}><cylinderGeometry args={[.018, .018, .55, 8]} /><meshStandardMaterial color="#d7a24d" /></mesh><mesh><boxGeometry args={[.2, .3, .07]} /><meshStandardMaterial color={on ? "#c8494e" : "#332c45"} emissive={on ? "#7f202c" : "#000000"} emissiveIntensity={on ? 1.2 : 0} /></mesh><mesh position={[0, 0, .045]}><sphereGeometry args={[.052, 12, 12]} /><meshBasicMaterial color={on ? "#ffe4a4" : "#4a4159"} /></mesh>{on && <pointLight color="#ffba67" intensity={.85} distance={1.7} />}</group></Float>)}</group><Diya position={[-2.25 * diyaScale, -1.4, -1.5]} on={on} /><Diya position={[-1.65 * diyaScale, -1.4, -1.6]} on={on} /><Diya position={[1.65 * diyaScale, -1.4, -1.6]} on={on} /><Diya position={[2.25 * diyaScale, -1.4, -1.5]} on={on} /></group>;
}

function WallCelebration({ name, lit }: { name: string; lit: boolean }) {
  const flowers = [
    [-2.55, .42], [-2.68, .13], [-2.55, -.16], [2.55, .42], [2.68, .13], [2.55, -.16],
  ] as const;
  return <group><mesh position={[0, 2.02, -2.43]}><planeGeometry args={[5.55, 1.35]} /><meshStandardMaterial color="#321d4a" emissive={lit ? "#1d0d30" : "#000000"} emissiveIntensity={lit ? .8 : 0} /></mesh><mesh position={[0, 2.74, -2.42]}><boxGeometry args={[5.7, .045, .04]} /><meshStandardMaterial color="#d8a34c" emissive={lit ? "#795018" : "#000000"} emissiveIntensity={lit ? 1 : 0} /></mesh><mesh position={[0, 1.3, -2.42]}><boxGeometry args={[5.7, .045, .04]} /><meshStandardMaterial color="#d8a34c" emissive={lit ? "#795018" : "#000000"} emissiveIntensity={lit ? 1 : 0} /></mesh>{flowers.map(([x, y], index) => <group key={`wall-flower-${index}`} position={[x, y + 2.02, -2.39]}><mesh rotation={[0, 0, index * .6]}><torusGeometry args={[.09, .026, 10, 18]} /><meshStandardMaterial color={index % 2 ? "#f4a42b" : "#e76775"} emissive={lit ? (index % 2 ? "#9c4b0d" : "#841d32") : "#000000"} emissiveIntensity={lit ? 1 : 0} /></mesh><mesh><sphereGeometry args={[.035, 10, 10]} /><meshBasicMaterial color="#ffe3a2" /></mesh></group>)}<Text position={[0, 2.25, -2.37]} fontSize={.36} color="#ffdda0" anchorX="center" letterSpacing={.08}>HAPPY BIRTHDAY</Text><Text position={[0, 1.74, -2.37]} fontSize={.5} color="#fff2dc" anchorX="center" maxWidth={5} lineHeight={.9}>{name.toUpperCase()}</Text><Text position={[0, 1.47, -2.37]} fontSize={.105} color="#f6c574" anchorX="center" letterSpacing={.15}>A NIGHT MADE JUST FOR YOU</Text></group>;
}

function Confetti({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null), startedAt = useRef<number | null>(null);
  const angle = index * 2.4, speed = 1.1 + (index % 7) * .1, lift = 4.05 + (index % 5) * .22;
  useFrame(({ clock }) => { if (!ref.current) return; if (startedAt.current === null) startedAt.current = clock.elapsedTime; const time = clock.elapsedTime - startedAt.current; ref.current.position.set(Math.cos(angle) * speed * time, lift * time - 1.6 * time * time, Math.sin(angle) * .42 * time); ref.current.rotation.set(angle + time * 7, angle / 2 + time * 4, time * 8); });
  return <mesh ref={ref}><boxGeometry args={[.035, .22, .02]} /><meshBasicMaterial color={["#ff7199", "#ffd56f", "#b99cff", "#8ee6d2", "#ef4965"][index % 5]} /></mesh>;
}

function BalloonConfetti() {
  return <group>{Array.from({ length: 24 }, (_, index) => <Confetti key={`balloon-paper-${index}`} index={index + 18} />)}</group>;
}

function PartyBurst({ active, pulse }: { active: boolean; pulse: number }) {
  if (!active) return null;
  return <group key={`party-burst-${pulse}`} position={[0, -.5, 1]}>{Array.from({ length: 52 }, (_, index) => <Confetti key={`confetti-${pulse}-${index}`} index={index} />)}</group>;
}

function CakeCutCamera({ active }: { active: boolean }) {
  const { camera } = useThree();
  const startedAt = useRef<number | null>(null), start = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3(0, .9, 7.9));
  useEffect(() => { if (!active) startedAt.current = null; }, [active]);
  useFrame(({ clock }) => {
    if (!active || startedAt.current === -1) return;
    if (startedAt.current === null) { startedAt.current = clock.elapsedTime; start.current.copy(camera.position); }
    const progress = Math.min((clock.elapsedTime - startedAt.current) / .9, 1), eased = 1 - Math.pow(1 - progress, 3);
    camera.position.lerpVectors(start.current, target.current, eased);
    camera.lookAt(0, .08, 0);
    if (progress === 1) startedAt.current = -1;
  });
  return null;
}

function ResponsiveRoomDecor({ lit }: { lit: boolean }) {
  const { size } = useThree();
  const phone = size.width <= 480, tablet = size.width <= 850, scale = phone ? .72 : tablet ? .86 : 1;
  const roundPositions: [number, number, number][] = phone ? [[-2.65, .7, -.8], [2.7, .5, -.8], [2.75, 1.95, -.95]] : [[-3.5, .55, -.8], [3.45, .35, -.8], [3.65, 2.2, -.95]];
  const heartPositions: [number, number, number][] = phone ? [[-2.6, 1.9, -.8], [2.55, 1.45, -.8]] : [[-3.45, 2.1, -.8], [3.35, 1.55, -.8]];
  return <><DiwaliLights on={lit} diyaScale={scale} /><Float speed={1.4} floatIntensity={.45}><Balloon position={roundPositions[0]} color="#f4aac2" scale={scale} /></Float><Float speed={1.7} floatIntensity={.4}><Balloon position={roundPositions[1]} color="#c8b1f4" scale={scale} /></Float><Float speed={1.2} floatIntensity={.35}><Balloon position={roundPositions[2]} color="#ffd18c" scale={scale} /></Float><HeartBalloon position={heartPositions[0]} color="#ee6f94" scale={scale} /><HeartBalloon position={heartPositions[1]} color="#f56e87" scale={scale} /></>;
}

export default function BirthdayRoom({ name, roomLit, candlesLit, cakeCut, cakeFlavor = "mango", popperBurst, popperPulse }: { name: string; roomLit: boolean; candlesLit: boolean; cakeCut: boolean; cakeFlavor?: CakeFlavor; popperBurst: boolean; popperPulse: number }) {
  return <Canvas shadows camera={{ position: [4.8, 1.65, 4.8], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
    <color attach="background" args={[roomLit ? "#100d2a" : "#070617"]} /><fog attach="fog" args={[roomLit ? "#100d2a" : "#070617", 7, 16]} />
    <ambientLight intensity={roomLit ? .75 : .12} /><pointLight position={[0, 4, 2]} intensity={roomLit ? 55 : 3} color="#ffca9b" distance={8} /><pointLight position={[-4, 1, -2]} intensity={roomLit ? 13 : 1} color="#bfa9ff" distance={6} /><pointLight position={[3, 2, -1]} intensity={roomLit ? 10 : 0} color="#f2a3c0" distance={5} />
    <mesh position={[0, -1.55, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[14, 14]} /><meshStandardMaterial color="#342848" roughness={.85} /></mesh>
    <mesh position={[0, 1.6, -2.5]}><planeGeometry args={[12, 7]} /><meshStandardMaterial color="#241d3e" /></mesh>
    <CakeCutCamera active={cakeCut} /><ResponsiveCakeScene lit={candlesLit} cut={cakeCut} flavor={cakeFlavor} /><ResponsiveRoomDecor lit={roomLit} /><WallCelebration name={name} lit={roomLit} /><PartyBurst active={popperBurst} pulse={popperPulse} /><Sparkles count={roomLit ? 130 : 35} scale={[8, 4, 5]} size={2} speed={.25} color="#ffe5a6" />
    <OrbitControls target={[0, 0, 0]} enablePan={false} minDistance={4.3} maxDistance={8} maxPolarAngle={Math.PI / 2.05} />
  </Canvas>;
}
