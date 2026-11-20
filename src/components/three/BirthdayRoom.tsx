"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles, Text } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cakeChoices, type CakeCandles, type CakeFlavor, type CakeShape, type CakeTiers, type PetalCount } from "@/config/cakes";

const outerFlameProfile = [new THREE.Vector2(0, 0), new THREE.Vector2(.075, .025), new THREE.Vector2(.09, .105), new THREE.Vector2(.055, .2), new THREE.Vector2(0, .3)];
const innerFlameProfile = [new THREE.Vector2(0, .01), new THREE.Vector2(.04, .035), new THREE.Vector2(.048, .1), new THREE.Vector2(.025, .17), new THREE.Vector2(0, .22)];

function ordinal(day: number) {
  const remainder = day % 100;
  if (remainder >= 11 && remainder <= 13) return `${day}th`;
  const suffix = day % 10 === 1 ? "st" : day % 10 === 2 ? "nd" : day % 10 === 3 ? "rd" : "th";
  return `${day}${suffix}`;
}

function formatLocalDateTime(date: Date) {
  const hour = date.getHours();
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return {
    date: `${ordinal(date.getDate())} ${date.toLocaleString(undefined, { month: "short" })} ${date.getFullYear()}`,
    time: `${String(displayHour).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")} ${period}`,
  };
}

function BannerClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const localTime = now ? formatLocalDateTime(now) : { date: "LOCAL DATE", time: "--:--:-- --" };
  return <group>
    <Text position={[0, 2.16, -2.37]} fontSize={.145} color="#ffe9ad" anchorX="center" letterSpacing={.1} outlineWidth={.006} outlineBlur={.012} outlineColor="#f2a64e" material-toneMapped={false} material-fog={false}><meshBasicMaterial color="#ffe9ad" toneMapped={false} fog={false} />{localTime.date}</Text>
    <Text position={[0, 1.9, -2.37]} fontSize={.235} color="#fff9e5" anchorX="center" letterSpacing={.045} outlineWidth={.008} outlineBlur={.014} outlineColor="#f0b258" material-toneMapped={false} material-fog={false}><meshBasicMaterial color="#fff9e5" toneMapped={false} fog={false} />{localTime.time}</Text>
  </group>;
}

function CandleFlame({ index, tipY = .36 }: { index: number; tipY?: number }) {
  const flame = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (!flame.current) return; const sway = Math.sin(clock.elapsedTime * 7 + index * 1.8) * .11; flame.current.rotation.z = sway; flame.current.rotation.x = Math.cos(clock.elapsedTime * 5 + index) * .035; flame.current.scale.y = 1 + Math.sin(clock.elapsedTime * 9 + index) * .08; });
  return <group ref={flame} position={[0, tipY, 0]}><mesh><latheGeometry args={[outerFlameProfile, 20]} /><meshStandardMaterial color="#ff8a24" emissive="#ff5a12" emissiveIntensity={2.6} roughness={.18} /></mesh><mesh position={[0, .005, .008]}><latheGeometry args={[innerFlameProfile, 20]} /><meshBasicMaterial color="#fff2a5" /></mesh></group>;
}

function CandleSmoke({ index, puff, tipY = .39 }: { index: number; puff: number; tipY?: number }) {
  const smoke = useRef<THREE.Mesh>(null), material = useRef<THREE.MeshBasicMaterial>(null), startedAt = useRef<number | null>(null);
  useFrame(({ clock }) => { if (!smoke.current || !material.current) return; if (startedAt.current === null) startedAt.current = clock.elapsedTime; const age = clock.elapsedTime - startedAt.current; const progress = Math.min(age / 3.2, 1); smoke.current.position.set(Math.sin(age * 1.8 + index + puff) * (.025 + progress * .055) + (puff - .5) * .035, tipY + progress * (.38 + puff * .12), Math.cos(age * 1.4 + index) * .025); smoke.current.scale.setScalar(.35 + progress * 1.25); material.current.opacity = (1 - progress) * .28; });
  return <mesh ref={smoke}><sphereGeometry args={[.06, 14, 14]} /><meshBasicMaterial ref={material} color="#d7d3dc" transparent depthWrite={false} opacity={.28} /></mesh>;
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

function RosePetals({ count }: { count: PetalCount }) {
  const petals = Array.from({ length: count }, (_, index) => { const angle = index * 2.42; const radius = .92 + (index % 6) * .15; return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, rotation: angle * 1.7, color: index % 5 < 3 ? "#c93456" : index % 5 === 3 ? "#e95775" : "#f6a0b4" }; });
  return <group position={[0, -.64, .04]}>{petals.map((petal, index) => <mesh key={`petal-${index}`} position={[petal.x, .012, petal.z]} rotation={[-Math.PI / 2, 0, petal.rotation]} scale={[1, .65, 1]}><circleGeometry args={[.078, 14]} /><meshStandardMaterial color={petal.color} emissive={petal.color} emissiveIntensity={.15} roughness={.45} side={THREE.DoubleSide} /></mesh>)}</group>;
}

function CelebrationTable() {
  const legs: [number, number, number][] = [[-1.52, -1.4, .72], [1.52, -1.4, .72], [-1.52, -1.4, -.42], [1.52, -1.4, -.42]];
  return <group><mesh position={[0, -.75, .1]} receiveShadow castShadow><cylinderGeometry args={[2.15, 2.15, .18, 64]} /><meshStandardMaterial color="#c78b47" metalness={.62} roughness={.24} /></mesh><mesh position={[0, -.65, .1]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2.02, .045, 10, 64]} /><meshStandardMaterial color="#f5ce84" metalness={.5} roughness={.24} /></mesh><mesh position={[0, -1.4, .1]} castShadow><cylinderGeometry args={[.34, .54, 1.12, 48]} /><meshStandardMaterial color="#7a3e38" metalness={.45} roughness={.3} /></mesh>{legs.map((position, index) => <mesh key={`table-leg-${index}`} position={position} castShadow><cylinderGeometry args={[.085, .13, 1.14, 20]} /><meshStandardMaterial color="#8b4c3e" metalness={.5} roughness={.28} /></mesh>)}<mesh position={[0, -2.01, .1]} castShadow><cylinderGeometry args={[.92, .76, .12, 48]} /><meshStandardMaterial color="#b87843" metalness={.58} roughness={.28} /></mesh></group>;
}

const cakeHeartShape = new THREE.Shape();
cakeHeartShape.moveTo(0, -.52); cakeHeartShape.bezierCurveTo(-.82, -.02, -.57, .7, 0, .23); cakeHeartShape.bezierCurveTo(.57, .7, .82, -.02, 0, -.52);

function CakeLayer({ shape, size, height, frosting, filling }: { shape: CakeShape; size: number; height: number; frosting: string; filling: string }) {
  if (shape === "heart") return <group rotation={[-Math.PI / 2, 0, 0]} scale={[size, size, 1]}><mesh castShadow><extrudeGeometry args={[cakeHeartShape, { depth: height, bevelEnabled: true, bevelSegments: 3, bevelSize: .035, bevelThickness: .035 }]} /><meshStandardMaterial color={frosting} roughness={.48} /></mesh><mesh position={[0, 0, height + .008]}><shapeGeometry args={[cakeHeartShape]} /><meshStandardMaterial color={filling} roughness={.38} /></mesh></group>;
  if (shape === "round") return <><mesh castShadow><cylinderGeometry args={[size, size * 1.08, height, 48]} /><meshStandardMaterial color={frosting} roughness={.48} /></mesh><mesh position={[0, height / 2 + .008, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[size * .92, .035, 10, 48]} /><meshStandardMaterial color={filling} roughness={.38} /></mesh></>;
  const width = shape === "rectangular" ? size * 2.35 : size * 1.72, depth = size * 1.55;
  return <><mesh castShadow><boxGeometry args={[width, height, depth]} /><meshStandardMaterial color={frosting} roughness={.48} /></mesh><mesh position={[0, height / 2 + .008, 0]}><boxGeometry args={[width * .9, .025, depth * .9]} /><meshStandardMaterial color={filling} roughness={.38} /></mesh></>;
}

function cakeLevels(tiers: CakeTiers) {
  const heights = [.62, .5, .42].slice(0, tiers);
  const radii = [1.05, .77, .5];
  let previousHeight = 0;
  return heights.map((height, index) => { const level = { r: radii[index], height, y: previousHeight + height / 2 }; previousHeight += height; return level; });
}

function ServedCakeSlice({ tiers, frosting, filling }: { tiers: CakeTiers; frosting: string; filling: string }) {
  const sliceHeight = .42 + tiers * .08;
  return <group position={[1.28, sliceHeight / 2 + .18, .68]} rotation={[0, -.48, 0]}><mesh castShadow><boxGeometry args={[.66, sliceHeight, .66]} /><meshStandardMaterial color={frosting} roughness={.42} /></mesh><mesh position={[0, -.03, .336]}><boxGeometry args={[.67, .075, .018]} /><meshStandardMaterial color={filling} roughness={.3} /></mesh><mesh position={[0, sliceHeight / 2 + .012, 0]}><boxGeometry args={[.58, .03, .58]} /><meshStandardMaterial color={filling} roughness={.3} /></mesh></group>;
}

function Cake({ lit, cut, flavor, shape, tiers, candles }: { lit: boolean; cut: boolean; flavor: CakeFlavor; shape: CakeShape; tiers: CakeTiers; candles: CakeCandles }) {
  const style = cakeChoices.find((cake) => cake.id === flavor)!;
  const levels = cakeLevels(tiers);
  const topY = levels[levels.length - 1].y + levels[levels.length - 1].height / 2;
  const candlePositions = shape === "heart" || candles === 1 ? [[0, topY]] : candles === 2 ? [[-.18, topY], [.18, topY]] : [[-.36, topY], [0, topY], [.36, topY]];
  const candleScale = (1 + tiers * .15) * (shape === "heart" ? 1.15 : 1);
  // Sink the bevel very slightly into the platter so every shape reads as resting on it.
  return <group position={[0, -.84, 0]}>
    {levels.map((level, index) => <group key={`cake-tier-${index}`} position={[0, level.y, 0]}><CakeLayer shape={shape} size={level.r} height={level.height} frosting={style.frosting} filling={style.filling} /></group>)}
    {candlePositions.map(([x, y], index) => <group key={`candle-${index}`} position={[x, y + .02 * candleScale, 0]} scale={[candleScale, candleScale, candleScale]}><mesh position={[0, .17, 0]}><cylinderGeometry args={[.062, .062, .34, 16]} /><meshStandardMaterial color="#ff9fbb" emissive="#7e1f45" emissiveIntensity={.2} roughness={.32} /></mesh><mesh position={[0, .17, .063]}><boxGeometry args={[.016, .3, .012]} /><meshBasicMaterial color="#fff4bf" /></mesh><mesh position={[0, .345, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.064, .011, 8, 16]} /><meshBasicMaterial color="#fff0a6" /></mesh>{lit ? <><pointLight position={[0, .4, 0]} color="#ff9d35" intensity={2.7} distance={2.4} /><CandleFlame index={index} tipY={.36} /></> : <><CandleSmoke index={index} puff={0} tipY={.4} /><CandleSmoke index={index} puff={1} tipY={.4} /></>}</group>)}
    {cut && <ServedCakeSlice tiers={tiers} frosting={style.frosting} filling={style.filling} />}
    {cut && <Text position={[0, topY + .68, .32]} fontSize={.12} color="#ffe7a4" anchorX="center" letterSpacing={.06}>A SLICE FOR THE BIRTHDAY GIRL</Text>}
  </group>;
}

function ResponsiveCakeScene({ lit, cut, flavor, shape, tiers, candles, petals }: { lit: boolean; cut: boolean; flavor: CakeFlavor; shape: CakeShape; tiers: CakeTiers; candles: CakeCandles; petals: PetalCount }) {
  const { size } = useThree();
  const scale = size.width <= 480 ? .68 : size.width <= 850 ? .84 : 1;
  return <group scale={[scale, size.width <= 480 ? .8 : .9, scale]}>
    <CelebrationTable />
    <Cake lit={lit} cut={cut} flavor={flavor} shape={shape} tiers={tiers} candles={candles} />
    <RosePetals count={petals} />
  </group>;
}

function CakePreviewScene({ flavor, shape, tiers, candles, petals }: { flavor: CakeFlavor; shape: CakeShape; tiers: CakeTiers; candles: CakeCandles; petals: PetalCount }) {
  return <><ambientLight intensity={1.15} /><hemisphereLight args={["#ffe5c0", "#291737", 1.6]} /><spotLight position={[3.6, 5, 4]} angle={.46} penumbra={.8} intensity={60} color="#ffe0ac" castShadow /><pointLight position={[-3, 1.5, 2]} intensity={16} color="#ed8bb3" distance={5} /><group scale={[.9, .9, .9]}><CelebrationTable /><Cake lit cut={false} flavor={flavor} shape={shape} tiers={tiers} candles={candles} /><RosePetals count={petals} /></group></>;
}

export function CakePreview3D({ flavor, shape, tiers, candles, petals }: { flavor: CakeFlavor; shape: CakeShape; tiers: CakeTiers; candles: CakeCandles; petals: PetalCount }) {
  return <Canvas shadows camera={{ position: [5.2, 2.1, 6], fov: 43 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}><CakePreviewScene flavor={flavor} shape={shape} tiers={tiers} candles={candles} petals={petals} /><OrbitControls target={[0, -.25, 0]} enablePan={false} enableZoom={false} enableDamping dampingFactor={.08} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 1.7} /></Canvas>;
}

function Diya({ position, on, scale = 1 }: { position: [number, number, number]; on: boolean; scale?: number }) {
  return <group position={position} scale={[scale, scale, scale]}><mesh><cylinderGeometry args={[.15, .1, .07, 24]} /><meshStandardMaterial color="#c96a2a" metalness={.45} roughness={.3} /></mesh><mesh position={[0, .055, 0]}><sphereGeometry args={[.12, 20, 12]} /><meshStandardMaterial color="#f1a24c" emissive={on ? "#f08a28" : "#000000"} emissiveIntensity={on ? 2 : 0} /></mesh>{on && <><pointLight position={[0, .22, 0]} color="#ffb655" intensity={1.6} distance={2.7} /><mesh position={[0, .19, 0]} scale={[.55, 1.15, .55]}><sphereGeometry args={[.1, 14, 14]} /><meshBasicMaterial color="#fff1a5" /></mesh></>}</group>;
}

function DiwaliLights({ on, diyaScale = 1 }: { on: boolean; diyaScale?: number }) {
  const colors = ["#fff2ad", "#f6b8b7", "#d8c2ff", "#c8f0ec", "#ffe09a", "#f9c9d7"];
  const ceilingBulbs = [-6.2, -5, -3.8, -2.6, -1.3, 0, 1.3, 2.6, 3.8, 5, 6.2];
  const lanterns = [-5.45, -4.65, 4.65, 5.45];
  return <group><group position={[0, 3.62, -1.82]}>{ceilingBulbs.map((x, index) => <Float key={`ceiling-bulb-${index}`} speed={1.1 + index * .07} floatIntensity={.08}><group position={[x, index % 2 ? -.08 : .04, 0]}><mesh><sphereGeometry args={[.13, 16, 16]} /><meshStandardMaterial color={on ? colors[index % colors.length] : "#413956"} emissive={on ? colors[index % colors.length] : "#000000"} emissiveIntensity={on ? 2.8 : 0} /></mesh>{on && <pointLight color={colors[index % colors.length]} intensity={.75} distance={1.7} />}</group></Float>)}</group><group position={[0, 1.66, -2.18]}>{lanterns.map((x, index) => <Float key={`lantern-${index}`} speed={1.15 + index * .1} floatIntensity={.08}><group position={[x, index % 2 ? .12 : -.05, 0]}><mesh position={[0, .23, -.015]}><cylinderGeometry args={[.018, .018, .55, 8]} /><meshStandardMaterial color="#d7a24d" /></mesh><mesh><boxGeometry args={[.2, .3, .07]} /><meshStandardMaterial color={on ? "#c8494e" : "#332c45"} emissive={on ? "#7f202c" : "#000000"} emissiveIntensity={on ? 1.2 : 0} /></mesh><mesh position={[0, 0, .045]}><sphereGeometry args={[.052, 12, 12]} /><meshBasicMaterial color={on ? "#ffe4a4" : "#4a4159"} /></mesh>{on && <pointLight color="#ffba67" intensity={.85} distance={1.7} />}</group></Float>)}</group><Diya position={[-2.95 * diyaScale, -2.02, -.75]} on={on} scale={1.4} /><Diya position={[-2.35 * diyaScale, -2.02, -1.55]} on={on} scale={1.25} /><Diya position={[2.35 * diyaScale, -2.02, -1.55]} on={on} scale={1.25} /><Diya position={[2.95 * diyaScale, -2.02, -.75]} on={on} scale={1.4} /></group>;
}

function WallCelebration({ name, lit }: { name: string; lit: boolean }) {
  const flowers = [
    [-2.55, .42], [-2.68, .13], [-2.55, -.16], [2.55, .42], [2.68, .13], [2.55, -.16],
  ] as const;
  const fairyLights = [-2.3, -1.84, -1.38, -.92, -.46, 0, .46, .92, 1.38, 1.84, 2.3];
  return <group><mesh position={[0, 2.56, -2.43]}><planeGeometry args={[5.75, 1.78]} /><meshStandardMaterial color="#1d112e" emissive={lit ? "#24113b" : "#000000"} emissiveIntensity={lit ? .34 : 0} roughness={.58} fog={false} /></mesh><mesh position={[0, 3.48, -2.42]}><boxGeometry args={[5.9, .045, .04]} /><meshStandardMaterial color="#d8a34c" emissive={lit ? "#a96c1e" : "#000000"} emissiveIntensity={lit ? 1.3 : 0} fog={false} /></mesh><mesh position={[0, 1.64, -2.42]}><boxGeometry args={[5.9, .045, .04]} /><meshStandardMaterial color="#d8a34c" emissive={lit ? "#a96c1e" : "#000000"} emissiveIntensity={lit ? 1.3 : 0} fog={false} /></mesh><pointLight position={[-2.95, 2.62, -2.05]} color="#cf8bff" intensity={lit ? .45 : .1} distance={2.7} />{fairyLights.map((x, index) => <group key={`banner-fairy-${index}`} position={[x, 3.28 + Math.cos(index * .85) * .06, -2.35]}><mesh><sphereGeometry args={[.038, 10, 10]} /><meshBasicMaterial color={lit ? (index % 2 ? "#fff0a8" : "#ffc7d7") : "#4a405e"} toneMapped={false} fog={false} /></mesh>{lit && index % 2 === 0 && <pointLight color="#ffd58c" intensity={.22} distance={.72} />}</group>)}{flowers.map(([x, y], index) => <group key={`wall-flower-${index}`} position={[x * 1.08, y + 2.72, -2.39]}><mesh rotation={[0, 0, index * .6]}><torusGeometry args={[.09, .026, 10, 18]} /><meshStandardMaterial color={index % 2 ? "#f4a42b" : "#e76775"} emissive={lit ? (index % 2 ? "#9c4b0d" : "#841d32") : "#000000"} emissiveIntensity={lit ? 1.15 : 0} /></mesh><mesh><sphereGeometry args={[.035, 10, 10]} /><meshBasicMaterial color="#ffe3a2" /></mesh></group>)}<Text position={[0, 2.98, -2.37]} fontSize={.32} color="#fff1be" anchorX="center" letterSpacing={.1} outlineWidth={.01} outlineBlur={.018} outlineColor="#edaa50" material-toneMapped={false} material-fog={false}><meshBasicMaterial color="#fff1be" toneMapped={false} fog={false} />HAPPY BIRTHDAY</Text><Text position={[0, 2.59, -2.37]} fontSize={.43} color="#fffdf1" anchorX="center" maxWidth={5} lineHeight={.9} outlineWidth={.012} outlineBlur={.02} outlineColor="#efb35a" material-toneMapped={false} material-fog={false}><meshBasicMaterial color="#fffdf1" toneMapped={false} fog={false} />{name.toUpperCase()}</Text><BannerClock /></group>;
}

function WallSconce({ position, color, lit }: { position: [number, number, number]; color: string; lit: boolean }) {
  return <group position={position}><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.16, .12, .075, 20]} /><meshStandardMaterial color="#b98243" metalness={.72} roughness={.22} /></mesh><mesh position={[0, .02, .06]}><sphereGeometry args={[.11, 16, 12]} /><meshStandardMaterial color={lit ? color : "#40354e"} emissive={lit ? color : "#000000"} emissiveIntensity={lit ? 2.4 : 0} roughness={.2} /></mesh>{lit && <pointLight position={[0, .08, .42]} color={color} intensity={2.4} distance={3.2} decay={2} />}</group>;
}

function SideWallCelebration({ lit }: { lit: boolean }) {
  const leftCluster: [number, number, number][] = [[-5.25, 2.18, -1.25], [-5.18, 1.68, -1.12], [-5.12, 1.25, -.98]];
  const rightCluster: [number, number, number][] = [[5.25, 2.15, -1.25], [5.18, 1.64, -1.1], [5.12, 1.2, -.96]];
  const colors = ["#f1a6bf", "#d7bef7", "#ffd18e"];
  return <group>
    <mesh position={[-5.65, 1.1, -.35]} rotation={[0, Math.PI / 2.45, 0]}><planeGeometry args={[5.7, 6.4]} /><meshStandardMaterial color="#241939" emissive="#170f2a" emissiveIntensity={lit ? .42 : .06} roughness={.88} /></mesh>
    <mesh position={[5.65, 1.1, -.35]} rotation={[0, -Math.PI / 2.45, 0]}><planeGeometry args={[5.7, 6.4]} /><meshStandardMaterial color="#241939" emissive="#170f2a" emissiveIntensity={lit ? .42 : .06} roughness={.88} /></mesh>
    <WallSconce position={[-5.22, 2.84, -.9]} color="#ffd08a" lit={lit} /><WallSconce position={[5.22, 2.84, -.9]} color="#ffc2d4" lit={lit} />
    {leftCluster.map((position, index) => <Float key={`left-wall-balloon-${index}`} speed={1.2 + index * .14} floatIntensity={.13}><Balloon position={position} color={colors[index]} scale={.9 - index * .08} /></Float>)}
    {rightCluster.map((position, index) => <Float key={`right-wall-balloon-${index}`} speed={1.35 + index * .13} floatIntensity={.13}><Balloon position={position} color={colors[(index + 1) % colors.length]} scale={.9 - index * .08} /></Float>)}
    <HeartBalloon position={[-5.05, .6, -.82]} color="#e96e98" scale={.72} /><HeartBalloon position={[5.05, .58, -.82]} color="#e96e98" scale={.72} />
  </group>;
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
  return <group key={`party-burst-${pulse}`} position={[0, -1.8, 1]} scale={[1.45, 1.45, 1.45]}>{Array.from({ length: 52 }, (_, index) => <Confetti key={`confetti-${pulse}-${index}`} index={index} />)}</group>;
}

function SparkleFountain({ position, direction, active, pulse }: { position: [number, number, number]; direction: number; active: boolean; pulse: number }) {
  const stream = Array.from({ length: 28 }, (_, index) => {
    const spread = ((index % 9) - 4) * .105 + direction * .1;
    return { angle: spread, lift: 3.05 + (index % 6) * .16, speed: .8 + (index % 5) * .12, color: ["#fffbe0", "#ffd36b", "#ff9ab8", "#d7c8ff"][index % 4] };
  });
  return <group position={position} rotation={[0, direction > 0 ? -.25 : .25, direction * -.11]}>
    <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.13, .17, .5, 20]} /><meshStandardMaterial color="#b83e68" metalness={.5} roughness={.25} emissive={active ? "#7b163d" : "#220817"} emissiveIntensity={active ? 1.3 : .2} /></mesh>
    <mesh position={[0, .28, 0]}><cylinderGeometry args={[.018, .018, .16, 8]} /><meshStandardMaterial color="#d7a95d" emissive={active ? "#ffb64d" : "#000000"} emissiveIntensity={active ? 2 : 0} /></mesh>
    {active && <><pointLight position={[0, 1.35, .1]} color="#ffbd62" intensity={7} distance={4.2} decay={2} /><pointLight position={[0, 2.7, .15]} color="#ffdca0" intensity={3.2} distance={3.2} decay={2} /></>}
    {active && <group key={`sparkle-fountain-${pulse}`}>{stream.map((spark, index) => <FountainSpark key={index} {...spark} index={index} />)}</group>}
  </group>;
}

function FountainSpark({ index, angle, lift, speed, color }: { index: number; angle: number; lift: number; speed: number; color: string }) {
  const spark = useRef<THREE.Mesh>(null), material = useRef<THREE.MeshBasicMaterial>(null), startedAt = useRef<number | null>(null);
  useFrame(({ clock }) => {
    if (!spark.current || !material.current) return;
    if (startedAt.current === null) startedAt.current = clock.elapsedTime;
    const time = (clock.elapsedTime - startedAt.current + (index % 7) * .09) % 1.7;
    const progress = time / 1.7;
    const distance = speed * time;
    spark.current.position.set(Math.sin(angle) * distance, .28 + lift * time - 1.1 * time * time, Math.cos(angle) * distance * .32);
    spark.current.scale.set(.45 + (1 - progress) * .75, 1.1 + (1 - progress) * 2.2, .45 + (1 - progress) * .75);
    spark.current.rotation.z = angle;
    material.current.opacity = Math.sin(progress * Math.PI) * .95;
  });
  return <mesh ref={spark}><sphereGeometry args={[.032, 10, 10]} /><meshBasicMaterial ref={material} color={color} transparent depthWrite={false} toneMapped={false} /></mesh>;
}

function SideSparkleCrackers({ active, pulse }: { active: boolean; pulse: number }) {
  return <group>
    <group scale={[1.35, 1.35, 1.35]}><SparkleFountain position={[-3.35, -1.52, -.5]} direction={1} active={active} pulse={pulse} /></group>
    <group scale={[1.35, 1.35, 1.35]}><SparkleFountain position={[3.35, -1.52, -.5]} direction={-1} active={active} pulse={pulse} /></group>
  </group>;
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

function RoomLighting({ lit }: { lit: boolean }) {
  const level = lit ? 1 : .16;
  return <><hemisphereLight args={["#ffe0bd", "#17102b", 1.3 * level]} /><ambientLight intensity={.42 * level} /><spotLight position={[-4.8, 5.6, 4.2]} angle={.55} penumbra={.9} intensity={55 * level} color="#ffd1a1" distance={13} decay={2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} /><spotLight position={[4.2, 3.8, 2.4]} angle={.65} penumbra={1} intensity={24 * level} color="#f5a6c7" distance={10} decay={2} /><spotLight position={[0, 5.6, -1.4]} angle={.72} penumbra={1} intensity={32 * level} color="#ffe4b3" distance={11} decay={2} /><pointLight position={[0, 1.25, 3.3]} intensity={10 * level} color="#ffcb91" distance={6.2} decay={2} /><pointLight position={[-4.7, .4, .4]} intensity={11 * level} color="#9e8cff" distance={6} decay={2} /><pointLight position={[4.8, .7, -.2]} intensity={10 * level} color="#ff9fc2" distance={6} decay={2} /><pointLight position={[0, .1, 2.6]} intensity={8 * level} color="#ffc57f" distance={5.5} decay={2} /><mesh position={[-3.9, -2.065, .35]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.75, 48]} /><meshBasicMaterial color="#8a6cff" transparent opacity={.09 * level} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh><mesh position={[3.9, -2.065, .15]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.65, 48]} /><meshBasicMaterial color="#f47cad" transparent opacity={.08 * level} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh><mesh position={[0, -2.065, .5]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[2.8, 64]} /><meshBasicMaterial color="#ffbc6b" transparent opacity={.1 * level} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh></>;
}

export default function BirthdayRoom({ name, roomLit, candlesLit, cakeCut, cakeFlavor = "mango", cakeShape = "round", cakeTiers = 3, cakeCandles = 3, petalCount = 72, popperBurst, popperPulse, sparkleBurst, sparklePulse }: { name: string; roomLit: boolean; candlesLit: boolean; cakeCut: boolean; cakeFlavor?: CakeFlavor; cakeShape?: CakeShape; cakeTiers?: CakeTiers; cakeCandles?: CakeCandles; petalCount?: PetalCount; popperBurst: boolean; popperPulse: number; sparkleBurst: boolean; sparklePulse: number }) {
  return <Canvas shadows="soft" camera={{ position: [6.8, 2, 6.8], fov: 46 }} dpr={[1, 1.5]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}>
    <color attach="background" args={[roomLit ? "#110d2b" : "#070617"]} /><fog attach="fog" args={[roomLit ? "#110d2b" : "#070617", 7, 18]} />
    <RoomLighting lit={roomLit} />
    <mesh position={[0, -2.08, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[18, 18]} /><meshStandardMaterial color="#28213e" metalness={.08} roughness={.72} /></mesh>
    <mesh position={[0, 1.6, -2.5]} receiveShadow><planeGeometry args={[15, 8]} /><meshStandardMaterial color="#251940" emissive="#1a1033" emissiveIntensity={roomLit ? .45 : .08} roughness={.82} /></mesh>
    <CakeCutCamera active={cakeCut} /><ResponsiveCakeScene key={`cake-${cakeFlavor}-${cakeShape}-${cakeTiers}-${cakeCandles}-${petalCount}`} lit={candlesLit} cut={cakeCut} flavor={cakeFlavor} shape={cakeShape} tiers={cakeTiers} candles={cakeShape === "heart" ? 1 : cakeCandles} petals={petalCount} /><ResponsiveRoomDecor lit={roomLit} /><SideWallCelebration lit={roomLit} /><WallCelebration name={name} lit={roomLit} /><SideSparkleCrackers active={sparkleBurst} pulse={sparklePulse} /><PartyBurst active={popperBurst} pulse={popperPulse} /><Sparkles count={roomLit ? 150 : 35} scale={[8, 4, 5]} size={1.7} speed={.22} color="#ffe5a6" />
    <OrbitControls target={[0, -.2, 0]} enablePan={false} minDistance={6.2} maxDistance={11} maxPolarAngle={Math.PI / 2.05} />
  </Canvas>;
}
