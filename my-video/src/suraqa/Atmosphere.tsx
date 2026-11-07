import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {rnd, Svg, useT} from './kit';

// Общий фон всего ролика: небо, звёзды, барханы, пыль, зерно.
// Ночь — в пустыне на пути Сураки, день — в Медине.

const dayAt = (t: number) => interpolate(t, [96.5, 101, 106, 116, 121], [0, 0.65, 1, 0.9, 0.75], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const NIGHT = ['#04060b', '#0d1322', '#2a2020'];
const DAY = ['#1d2a3d', '#7a5a3e', '#d9a96f'];

const STARS = new Array(150).fill(0).map((_, i) => ({x: rnd(i, 1) * 1080, y: rnd(i, 2) * 1150, r: 0.6 + rnd(i, 3) * 1.9, tw: rnd(i, 4) * 6.28}));

const dunePath = (base: number, amp: number, f: number, ph: number) => {
	let d = 'M0,1920 L0,' + base.toFixed(1);
	for (let x = 0; x <= 2600; x += 24) {
		const y = base - amp * (0.62 * Math.sin(x / f + ph) + 0.28 * Math.sin(x / (f * 0.43) + ph * 2.1) + 0.1 * Math.sin(x / (f * 0.17) + ph * 3.3));
		d += ` L${x},${y.toFixed(1)}`;
	}
	return d + ' L2600,1920 Z';
};

const DUNES = [
	{d: dunePath(1150, 40, 260, 0.4), speed: 1.5, night: '#1a1517', day: '#a8774a'},
	{d: dunePath(1250, 60, 330, 2.1), speed: 3, night: '#141012', day: '#8c5f38'},
	{d: dunePath(1390, 70, 300, 4.0), speed: 5, night: '#0e0b0c', day: '#6e4a2c'},
	{d: dunePath(1560, 80, 380, 5.3), speed: 8, night: '#08070a', day: '#3f2a1b'},
];

export const Backdrop: React.FC = () => {
	const t = useT();
	const day = dayAt(t);
	const sky = NIGHT.map((n, i) => interpolateColors(day, [0, 1], [n, DAY[i]]));
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: `linear-gradient(180deg, ${sky[0]} 0%, ${sky[1]} 46%, ${sky[2]} 62%, ${sky[2]} 100%)`}} />
			<Svg>
				{STARS.map((s, i) => (
					<circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff6e6" opacity={(1 - day) * (0.35 + 0.45 * Math.sin(t * 1.3 + s.tw)) * (1 - s.y / 1300)} />
				))}
			</Svg>
			{/* тёплое свечение у горизонта */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(90% 22% at 50% 60%, rgba(226,160,90,${0.16 + day * 0.3}), rgba(0,0,0,0) 70%)`,
				}}
			/>
			<Svg>
				{DUNES.map((l, i) => (
					<path key={i} d={l.d} fill={interpolateColors(day, [0, 1], [l.night, l.day])} transform={`translate(${-((t * l.speed) % 1400)} 0)`} />
				))}
			</Svg>
			{/* затемнение снизу под субтитры */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(3,3,5,0.78) 100%)'}} />
		</AbsoluteFill>
	);
};

const MOTES = new Array(40).fill(0).map((_, i) => ({x: rnd(i, 5), y: rnd(i, 6), s: 1.5 + rnd(i, 7) * 4.5, v: 6 + rnd(i, 8) * 18, ph: rnd(i, 9) * 6.28}));

export const Motes: React.FC = () => {
	const t = useT();
	return (
		<Svg style={{mixBlendMode: 'screen'}}>
			{MOTES.map((m, i) => {
				const x = (((m.x * 1080 + t * m.v + Math.sin(t * 0.4 + m.ph) * 30) % 1120) + 1120) % 1120 - 20;
				const y = (((m.y * 1920 - t * m.v * 0.5) % 1960) + 1960) % 1960 - 20;
				return <circle key={i} cx={x} cy={y} r={m.s} fill="#ffdca8" opacity={0.08 + 0.18 * (0.5 + 0.5 * Math.sin(t * 0.9 + m.ph))} />;
			})}
		</Svg>
	);
};

export const Grain: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.22}}>
			<svg width="100%" height="100%">
				<filter id="suraqa-grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 12} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#suraqa-grain)" />
			</svg>
		</AbsoluteFill>
	);
};

export const Vignette: React.FC = () => (
	<AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.62) 100%)'}} />
);

/** Плавное появление из чёрного и уход в чёрный */
export const Fades: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	return (
		<AbsoluteFill
			style={{
				background: '#000',
				opacity: interpolate(frame, [0, 0.6 * fps, durationInFrames - 1.2 * fps, durationInFrames - 1], [1, 0, 0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
			}}
		/>
	);
};
