import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {C, sans} from './fonts';
import {Arabic, At, Draw, easeInOut, Label, prog, Reveal, rnd, Scene, starPath, Svg, useT, vis} from './kit';

/* ───────────── 7. Земля и столб пыли ───────────── */
const Earth: React.FC = () => {
	const t = useT();
	const sink = prog(t, 63.75, 0.7) * 1 - prog(t, 68.6, 2.0, easeInOut) * 0.75;
	const depth = 230 * sink;
	const ground = `M0,1060 L330,1060 C430,1060 450,${1060 + depth} 540,${1060 + depth} C630,${1060 + depth} 650,1060 750,1060 L1080,1060`;
	const crack = prog(t, 63.8, 0.6);
	const grains = new Array(46).fill(0).map((_, i) => i);
	return (
		<Svg style={{filter: 'drop-shadow(0 0 12px rgba(226,181,107,0.28))'}}>
			<path d={`${ground} L1080,1920 L0,1920 Z`} fill="#0a0808" opacity={0.85} />
			<Draw d={ground} p={1} width={3} />
			{/* трещины */}
			{[
				'M330,1060 L280,1100 L300,1140',
				'M750,1060 L800,1096 L784,1150',
				'M420,1066 L390,1130',
				'M660,1066 L700,1120',
			].map((d, i) => (
				<Draw key={i} d={d} p={crack} width={2} color={C.ember} opacity={0.9 * (1 - prog(t, 70, 1))} />
			))}
			{/* песок осыпается */}
			{grains.map((i) => {
				const st = 63.8 + rnd(i, 21) * 3.5;
				const life = (t - st) / 1.2;
				if (life < 0 || life > 1) return null;
				const x = 380 + rnd(i, 22) * 320;
				const y = 1040 + life * (depth + 20);
				return <circle key={i} cx={x + (540 - x) * life * 0.4} cy={y} r={2 + rnd(i, 23) * 3} fill={C.sand} opacity={1 - life} />;
			})}
		</Svg>
	);
};

const DustColumn: React.FC = () => {
	const t = useT();
	const start = 71.3;
	if (t < start) return null;
	const grow = prog(t, start, 3.5, easeInOut);
	const puffs = new Array(70).fill(0).map((_, i) => i);
	return (
		<Svg>
			<defs>
				<radialGradient id="puff">
					<stop offset="0%" stopColor="#e9c99a" stopOpacity={0.55} />
					<stop offset="100%" stopColor="#e9c99a" stopOpacity={0} />
				</radialGradient>
			</defs>
			{puffs.map((i) => {
				const period = 3.2 + rnd(i, 31) * 2;
				const ph = (((t - start) / period + rnd(i, 32)) % 1 + 1) % 1;
				const born = start + rnd(i, 32) * 0 + (i / puffs.length) * 1.6;
				if (t < born) return null;
				const h = ph * 980 * (0.35 + 0.65 * grow);
				const y = 1070 - h;
				const spread = 30 + ph * 170;
				const x = 540 + (rnd(i, 33) - 0.5) * spread + Math.sin(t * 0.8 + i) * 18 * ph;
				const r = 40 + ph * 150;
				return <circle key={i} cx={x} cy={y} r={r} fill="url(#puff)" opacity={(1 - ph) * Math.min(1, ph * 6) * 0.9} />;
			})}
			{new Array(60).fill(0).map((_, i) => {
				const ph = (((t - start) * (0.25 + rnd(i, 41) * 0.3) + rnd(i, 42)) % 1 + 1) % 1;
				const x = 540 + (rnd(i, 43) - 0.5) * (40 + ph * 260);
				const y = 1070 - ph * 1000 * (0.35 + 0.65 * grow);
				return <circle key={`g${i}`} cx={x} cy={y} r={1.5 + rnd(i, 44) * 2.5} fill="#ffe2b4" opacity={(1 - ph) * 0.8} />;
			})}
		</Svg>
	);
};

export const S7Earth: React.FC = () => (
	<Scene name="7 · Земля поглотила ноги коня" from={63.5} to={77.7}>
		<Earth />
		<DustColumn />
		<At y={470}>
			<Reveal text="Ноги коня ушли в землю" at={63.8} out={65.8} size={92} weight={900} />
		</At>
		<At y={700}>
			<Reveal text="По колени!" at={66.0} out={70.9} size={190} weight={900} color={C.ember} stagger={0.08} />
		</At>
		<At y={470}>
			<Reveal text="Сурака рухнул." at={66.9} out={70.9} size={74} weight={600} italic color={C.muted} />
		</At>
		<Arabic text="ساخَتْ يَدَا فرسي في الأرض حتى بلغتا الركبتين" at={66.3} out={70.9} y={1260} size={56} />
		<Label text="К небу" at={72.0} out={77.5} y={240} />
		<At y={1230}>
			<Reveal text="Столб пыли — словно дым" at={74.6} size={76} weight={900} />
		</At>
		<Arabic text="عُثَان ساطع في السماء مثل الدخان" at={75.0} y={1420} size={60} />
	</Scene>
);

/* ───────────── 8. «Пощады!» и озарение ───────────── */
const Shock: React.FC<{at: number; cy: number; color: string}> = ({at, cy, color}) => {
	const t = useT();
	if (t < at) return null;
	return (
		<Svg>
			{[0, 0.18, 0.36].map((d, i) => {
				const p = prog(t, at + d, 1.6);
				return <circle key={i} cx={540} cy={cy} r={60 + p * 640} fill="none" stroke={color} strokeWidth={4 - p * 3} opacity={(1 - p) * 0.8} />;
			})}
		</Svg>
	);
};

const Rays: React.FC<{at: number; cy: number; out?: number}> = ({at, cy, out}) => {
	const t = useT();
	const o = vis(t, at, out, 1.6, 0.8);
	if (o <= 0) return null;
	const n = 24;
	return (
		<Svg style={{opacity: o, mixBlendMode: 'screen'}}>
			<defs>
				<radialGradient id={`rayfade${at}`} cx={540} cy={cy} r={900} gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#fff" stopOpacity={1} />
					<stop offset="100%" stopColor="#fff" stopOpacity={0} />
				</radialGradient>
				<mask id={`raymask${at}`}>
					<rect width={1080} height={1920} fill={`url(#rayfade${at})`} />
				</mask>
			</defs>
			<g mask={`url(#raymask${at})`} transform={`rotate(${t * 3} 540 ${cy})`}>
				{new Array(n).fill(0).map((_, i) => {
					const a = (i / n) * Math.PI * 2;
					const w = 0.045;
					const R = 1400;
					return (
						<path
							key={i}
							d={`M540,${cy} L${540 + Math.cos(a - w) * R},${cy + Math.sin(a - w) * R} L${540 + Math.cos(a + w) * R},${cy + Math.sin(a + w) * R} Z`}
							fill={C.gold}
							opacity={0.16}
						/>
					);
				})}
			</g>
			<circle cx={540} cy={cy} r={300} fill={`url(#rayfade${at})`} opacity={0.12} />
		</Svg>
	);
};

export const S8Mercy: React.FC = () => (
	<Scene name="8 · «Пощады!»" from={77.7} to={89.6}>
		<At y={640}>
			<Reveal text="Тогда Сурака закричал:" at={77.9} out={79.9} size={70} weight={600} italic color={C.muted} />
		</At>
		<Shock at={80.1} cy={860} color={C.ember} />
		<At y={860}>
			<Reveal text="Пощады!" at={80.1} out={82.8} size={200} weight={900} stagger={0.02} />
		</At>
		<Arabic text="فناديتُهم بالأمان" at={80.5} out={82.8} y={1080} size={72} />
		<At y={1250}>
			<Reveal text="И они остановились." at={81.3} out={82.8} size={62} weight={600} italic color={C.gold} />
		</At>
		<Rays at={84.6} cy={860} />
		<Label text="В этот миг он понял" at={83.0} y={240} />
		<At y={520}>
			<Reveal text="В этот миг он понял:" at={83.0} out={84.5} size={74} weight={600} italic color={C.muted} />
		</At>
		<At y={830}>
			<Reveal text="Дело Посланника Аллаха ﷺ непременно восторжествует" at={84.8} size={94} weight={900} color={C.ivory} stagger={0.07} lineHeight={1.12} />
		</At>
		<Arabic text="أن سَيَظْهَرَ أمْرُ رسولِ الله ﷺ" at={86.0} y={1200} size={74} />
	</Scene>
);

/* ───────────── 9. «Скрой нас» ───────────── */
const Strike: React.FC<{at: number}> = ({at}) => {
	const t = useT();
	const p = prog(t, at, 0.5);
	return (
		<div style={{position: 'absolute', left: '50%', top: '54%', width: 420, height: 8, translate: '-50% -50%', background: C.ember, borderRadius: 4, scale: `${p} 1`, transformOrigin: 'left center', rotate: '-4deg'}} />
	);
};

const Offer: React.FC<{text: string; at: number; strike: number; out: number; y: number}> = ({text, at, strike, out, y}) => {
	const t = useT();
	const dim = interpolate(prog(t, strike, 0.6), [0, 1], [1, 0.45]);
	return (
		<At y={y}>
			<div style={{position: 'relative', display: 'inline-block', opacity: dim}}>
				<Reveal text={text} at={at} out={out} size={150} weight={900} />
				{t < out + 0.4 ? <Strike at={strike} /> : null}
			</div>
		</At>
	);
};

export const S9Hide: React.FC = () => (
	<Scene name="9 · «Скрой нас»" from={89.6} to={97.6}>
		<At y={420}>
			<Reveal text="Он рассказал им о награде" at={89.8} out={94.8} size={64} weight={600} italic color={C.muted} />
		</At>
		<Label text="и предложил" at={91.3} out={94.8} y={560} />
		<Offer text="Еду" at={91.6} strike={93.3} out={94.8} y={700} />
		<Offer text="Вещи" at={92.1} strike={93.5} out={94.8} y={880} />
		<At y={1120}>
			<Reveal text="Они не взяли ничего." at={93.4} out={94.8} size={76} weight={800} color={C.gold} />
		</At>
		<Arabic text="فلم يَرْزَآني شيئاً" at={93.6} out={94.8} y={1260} size={64} />
		<Label text="Пророк ﷺ сказал лишь" at={95.0} y={600} />
		<At y={800}>
			<Reveal text="«Скрой нас»" at={95.1} size={128} weight={900} color={C.ivory} stagger={0.1} />
		</At>
		<Arabic text="أخْفِ عَنّا" at={95.4} y={1010} size={120} />
	</Scene>
);

/* ───────────── 10. Медина, Харра ───────────── */
const STONES = new Array(34).fill(0).map((_, i) => {
	const x = -30 + (i / 34) * 1140 + rnd(i, 51) * 30;
	const w = 60 + rnd(i, 52) * 110;
	const h = 30 + rnd(i, 53) * 70;
	const y = 1070 + rnd(i, 54) * 120;
	const pts = new Array(6).fill(0).map((_, k) => {
		const a = (k / 6) * Math.PI * 2;
		return `${(x + Math.cos(a) * w * (0.4 + rnd(i * 7 + k, 55) * 0.25)).toFixed(1)},${(y + Math.min(0.25, Math.sin(a)) * h * (0.6 + rnd(i * 7 + k, 56) * 0.4)).toFixed(1)}`;
	});
	return {pts: pts.join(' '), y, i};
}).sort((a, b) => a.y - b.y);

const Harra: React.FC = () => {
	const t = useT();
	const sunP = prog(t, 97.8, 7.2, easeInOut);
	const sx = interpolate(sunP, [0, 1], [170, 850]);
	const sy = 1080 - Math.sin(sunP * Math.PI * 0.5) * 340;
	return (
		<>
			<AbsoluteFill style={{background: `radial-gradient(48% 28% at ${(sx / 1080) * 100}% ${(sy / 1920) * 100}%, rgba(255,236,200,0.55), rgba(255,200,130,0.12) 45%, rgba(0,0,0,0) 70%)`, mixBlendMode: 'screen'}} />
			<Svg>
				<circle cx={sx} cy={sy} r={78} fill="#fff4dc" opacity={prog(t, 97.8, 1.5)} />
				<circle cx={sx} cy={sy} r={110} fill="none" stroke="#fff4dc" strokeWidth={1.5} opacity={0.4 * prog(t, 98, 1.5)} />
				{/* марево над камнями */}
				{new Array(9).fill(0).map((_, i) => {
					const y = 1040 - i * 26 - ((t * 30) % 26);
					let d = `M60,${y}`;
					for (let x = 60; x <= 1020; x += 30) d += ` L${x},${(y + Math.sin(x / 50 + t * 3 + i) * 5).toFixed(1)}`;
					return <path key={i} d={d} stroke="#ffe7c0" strokeWidth={1.2} fill="none" opacity={0.18 * prog(t, 101.5, 1.5) * (1 - i / 9)} />;
				})}
				{STONES.map((s) => {
					const p = prog(t, 98.4 + (s.i % 17) * 0.06, 0.9);
					return <polygon key={s.i} points={s.pts} fill="#120e0c" stroke="#3a2d24" strokeWidth={1.5} opacity={p} transform={`translate(0 ${(1 - p) * 40})`} />;
				})}
			</Svg>
		</>
	);
};

export const S10Harra: React.FC = () => (
	<Scene name="10 · Медина. Харра" from={97.6} to={105.05}>
		<Harra />
		<Label text="Медина · Харра" at={97.9} y={240} />
		<At y={430}>
			<Reveal text="Каждое утро" at={98.0} out={101.0} size={132} weight={900} />
		</At>
		<At y={580}>
			<Reveal text="люди выходили к чёрным камням Харры" at={98.8} out={101.0} size={56} weight={600} italic color={C.gold} stagger={0.045} />
		</At>
		<At y={430}>
			<Reveal text="и ждали," at={101.2} size={132} weight={900} />
		</At>
		<At y={580}>
			<Reveal text="пока полуденный зной не загонял их домой" at={101.9} size={56} weight={600} italic color={C.gold} stagger={0.045} />
		</At>
		<Arabic text="حتى يردَّهم حَرُّ الظَّهيرة" at={102.4} y={1320} size={64} />
	</Scene>
);

/* ───────────── 11. Башня и марево ───────────── */
const Tower: React.FC = () => {
	const t = useT();
	const p = prog(t, 105.2, 1.6, easeInOut);
	const x0 = 760;
	const x1 = 930;
	const top = 560;
	const base = 1110;
	let crenel = `M${x0 - 14},${top}`;
	for (let i = 0; i < 5; i++) {
		const a = x0 - 14 + i * 40;
		crenel += ` L${a},${top - 34} L${a + 24},${top - 34} L${a + 24},${top} L${a + 40},${top}`;
	}
	const outline = `M${x0},${base} L${x0},${top} L${x0 - 14},${top} ${crenel.slice(crenel.indexOf('L'))} L${x1 + 14},${top} L${x1},${top} L${x1},${base}`;
	const beam = prog(t, 107.5, 1.2);
	return (
		<Svg>
			<defs>
				<linearGradient id="beam" x1="1" y1="0" x2="0" y2="0">
					<stop offset="0%" stopColor="#fff0cf" stopOpacity={0.4} />
					<stop offset="100%" stopColor="#fff0cf" stopOpacity={0} />
				</linearGradient>
			</defs>
			{/* взгляд с башни */}
			<path d={`M${x0 + 40},${top - 50} L120,${1000} L120,${1110} Z`} fill="url(#beam)" opacity={beam * 0.6} />
			<rect x={x0} y={top} width={x1 - x0} height={base - top} fill="#0f0b09" opacity={p} />
			<Draw d={outline} p={p} width={3} />
			{[0, 1, 2].map((i) => (
				<rect key={i} x={x0 + 70} y={top + 90 + i * 140} width={14} height={54} rx={7} fill={C.gold} opacity={0.6 * prog(t, 106 + i * 0.2, 0.6)} />
			))}
			<circle cx={x0 + 85} cy={top - 52} r={9} fill={C.ivory} opacity={prog(t, 107.2, 0.6)} />
		</Svg>
	);
};

const Mirage: React.FC = () => {
	const t = useT();
	const o = vis(t, 107.6, undefined, 1.2);
	return (
		<Svg style={{opacity: o}}>
			<defs>
				<filter id="soft" x="-1" y="-1" width="3" height="3">
					<feGaussianBlur stdDeviation="6" />
				</filter>
			</defs>
			{new Array(7).fill(0).map((_, i) => {
				const y = 1050 + i * 10;
				let d = `M80,${y}`;
				for (let x = 80; x <= 680; x += 20) d += ` L${x},${(y + Math.sin(x / 34 + t * 4 + i * 1.3) * 3.5).toFixed(1)}`;
				return <path key={i} d={d} stroke="#ffeacc" strokeWidth={1.4} fill="none" opacity={0.35 - i * 0.04} />;
			})}
			{/* путники в белом — дрожащие светлые пятна */}
			{[0, 1, 2, 3].map((i) => {
				const x = 300 + i * 34 + Math.sin(t * 2.4 + i) * 4;
				const s = 1 + Math.sin(t * 7 + i * 2) * 0.12;
				return (
					<ellipse
						key={i}
						cx={x}
						cy={1022 + Math.sin(t * 3 + i) * 3}
						rx={9 * s}
						ry={26 / s}
						fill="#fffaf0"
						filter="url(#soft)"
						opacity={0.85 * prog(t, 107.8 + i * 0.25, 1) * (0.7 + 0.3 * Math.sin(t * 9 + i))}
					/>
				);
			})}
		</Svg>
	);
};

const Veil: React.FC<{at: number}> = ({at}) => {
	const t = useT();
	return <AbsoluteFill style={{background: 'rgba(6,5,4,0.84)', opacity: prog(t, at, 0.5)}} />;
};

export const S11Tower: React.FC = () => (
	<Scene name="11 · Башня" from={105.05} to={116.85}>
		<Tower />
		<Mirage />
		<At y={400}>
			<Reveal text="Однажды, когда все уже разошлись," at={105.2} out={107.2} size={64} weight={600} italic color={C.muted} stagger={0.05} />
		</At>
		<At y={400}>
			<Reveal text="Человек на башне увидел путников в белом" at={107.4} out={112.6} size={72} weight={800} stagger={0.05} />
		</At>
		<Label text="Дрожащих в мареве" at={110.3} out={112.6} y={880} />
		<Arabic text="مِبيَّضين، يزولُ بهم السراب" at={110.5} out={112.6} y={1270} size={64} />
		<Veil at={112.7} />
		<At y={560}>
			<Reveal text="«О арабы!" at={112.8} size={150} weight={900} />
		</At>
		<At y={730}>
			<Reveal text="Вот она —" at={113.9} size={120} weight={900} color={C.gold} />
		</At>
		<At y={900}>
			<Reveal text="ваша удача, которую вы ждёте!»" at={114.7} size={70} weight={600} italic stagger={0.06} />
		</At>
		<Arabic text="يا معشر العرب، هذا جَدُّكم الذي تنتظرون" at={113.2} y={1170} size={62} />
	</Scene>
);

/* ───────────── 12. Встреча и титр ───────────── */
const Bloom: React.FC = () => {
	const t = useT();
	const p = prog(t, 116.9, 3.5, easeInOut);
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(${60 + p * 50}% ${30 + p * 25}% at 50% 62%, rgba(255,226,170,${0.5 * p}), rgba(226,160,90,${0.18 * p}) 45%, rgba(0,0,0,0) 72%)`,
				mixBlendMode: 'screen',
			}}
		/>
	);
};

const Ornament: React.FC<{at: number; y: number}> = ({at, y}) => {
	const t = useT();
	const p = prog(t, at, 1.4, easeInOut);
	return (
		<Svg>
			<Draw d={`M540,${y} L${540 - 260 * p},${y}`} p={1} width={1.6} opacity={0.7} />
			<Draw d={`M540,${y} L${540 + 260 * p},${y}`} p={1} width={1.6} opacity={0.7} />
			<g transform={`rotate(${t * 10} 540 ${y})`}>
				<Draw d={starPath(540, y, 20)} p={p} width={2} />
			</g>
		</Svg>
	);
};

const Source: React.FC<{at: number}> = ({at}) => {
	const t = useT();
	const p = prog(t, at, 1);
	return (
		<At y={1290} pad={150}>
			<div style={{fontFamily: sans, fontWeight: 500, fontSize: 27, lineHeight: 1.5, color: C.muted, opacity: p, textWrap: 'balance'}}>
				<span style={{fontWeight: 800, letterSpacing: '0.24em', fontSize: 22, color: C.gold}}>ИСТОЧНИК</span>
				<br />
				«Сахих» аль-Бухари, глава о переселении Пророка&nbsp;ﷺ и&nbsp;его сподвижников в&nbsp;Медину
			</div>
		</At>
	);
};

export const S12Finale: React.FC<{end: number}> = ({end}) => (
	<Scene name="12 · Встреча и титр" from={116.85} to={end}>
		<Bloom />
		<Rays at={117.2} cy={1150} out={122.2} />
		<At y={600}>
			<Reveal text="И мусульмане бросились навстречу" at={117.0} out={122.2} size={92} weight={900} stagger={0.06} />
		</At>
		<At y={830}>
			<Reveal text="своему Пророку ﷺ" at={119.3} out={122.2} size={104} weight={600} italic color={C.gold} />
		</At>
		<Label text="Хиджра" at={122.6} y={640} />
		<At y={800}>
			<Reveal text="Путь в Медину" at={122.8} size={116} weight={900} />
		</At>
		<At y={950}>
			<Reveal text="История Сураки ибн Малика" at={123.4} size={56} weight={600} italic color={C.gold} />
		</At>
		<Ornament at={123.8} y={1085} />
		<Source at={124.2} />
	</Scene>
);
