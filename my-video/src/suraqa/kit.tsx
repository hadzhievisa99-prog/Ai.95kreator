import React, {createContext, CSSProperties, useContext} from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {arabic, C, display, sans} from './fonts';

// Все времена в сценах — в секундах от начала ролика (как в озвучке),
// чтобы их было легко сверять с субтитрами.
const Offset = createContext(0);

export const useT = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return frame / fps + useContext(Offset);
};

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
const easeIn = Easing.bezier(0.55, 0, 1, 0.45);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0 → 1 за dur секунд начиная с at */
export const prog = (t: number, at: number, dur = 0.7, easing = easeOut) => interpolate(t, [at, at + dur], [0, 1], {...clamp, easing});

/** Появление в at и исчезновение в out */
export const vis = (t: number, at: number, out?: number, fadeIn = 0.4, fadeOut = 0.4) =>
	Math.min(prog(t, at, fadeIn), out === undefined ? 1 : 1 - prog(t, out, fadeOut, easeIn));

/** ﷺ не отрывается от предыдущего слова */
export const glue = (s: string) => s.replace(/ ﷺ/g, ' ﷺ');

export const Scene: React.FC<{name: string; from: number; to: number; children: React.ReactNode}> = ({name, from, to, children}) => {
	const {fps} = useVideoConfig();
	const start = Math.round(from * fps);
	return (
		<Sequence name={name} from={start} durationInFrames={Math.round((to - from + 0.6) * fps)} layout="none">
			<Offset.Provider value={start / fps}>
				<SceneFade from={from} to={to}>
					{children}
				</SceneFade>
			</Offset.Provider>
		</Sequence>
	);
};

const SceneFade: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
	const t = useT();
	return <AbsoluteFill style={{opacity: vis(t, from, to, 0.35, 0.5)}}>{children}</AbsoluteFill>;
};

/** Блок по центру по горизонтали, y — центр блока */
export const At: React.FC<{y: number; children: React.ReactNode; pad?: number}> = ({y, children, pad = 84}) => (
	<div style={{position: 'absolute', left: pad, right: pad, top: y, translate: '0 -50%', textAlign: 'center'}}>{children}</div>
);

type RevealProps = {
	text: string;
	at: number;
	out?: number;
	size?: number;
	weight?: number;
	italic?: boolean;
	color?: string;
	font?: string;
	stagger?: number;
	lineHeight?: number;
	tracking?: string;
	style?: CSSProperties;
};

/** Слова выезжают снизу из-под маски, по очереди */
export const Reveal: React.FC<RevealProps> = ({
	text,
	at,
	out,
	size = 96,
	weight = 800,
	italic = false,
	color = C.ivory,
	font = display,
	stagger = 0.06,
	lineHeight = 1.08,
	tracking = '-0.01em',
	style,
}) => {
	const t = useT();
	const o = out === undefined ? 1 : 1 - prog(t, out, 0.4, easeIn);
	if (t < at - 0.05 || o <= 0) return null;
	const words = glue(text).split(' ');
	return (
		<div
			style={{
				fontFamily: font,
				fontSize: size,
				fontWeight: weight,
				fontStyle: italic ? 'italic' : 'normal',
				color,
				lineHeight,
				letterSpacing: tracking,
				opacity: o,
				textWrap: 'balance',
				...style,
			}}
		>
			{words.map((w, i) => {
				const p = prog(t, at + i * stagger, 0.75);
				return (
					<React.Fragment key={i}>
						<span style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '0.1em 0.06em 0.16em', margin: '-0.1em -0.06em -0.16em'}}>
							<span style={{display: 'inline-block', translate: `0 ${(1 - p) * 108}%`, rotate: `${(1 - p) * 4}deg`}}>{w}</span>
						</span>
						{i < words.length - 1 ? ' ' : null}
					</React.Fragment>
				);
			})}
		</div>
	);
};

/** Арабская строка — целиком (буквы не разрываются), проявляется из размытия */
export const Arabic: React.FC<{text: string; at: number; out?: number; y: number; size?: number; color?: string}> = ({
	text,
	at,
	out,
	y,
	size = 64,
	color = C.gold,
}) => {
	const t = useT();
	const p = prog(t, at, 1.1);
	const o = vis(t, at, out, 0.8, 0.4);
	if (o <= 0) return null;
	return (
		<At y={y} pad={70}>
			<div
				dir="rtl"
				lang="ar"
				style={{
					fontFamily: arabic,
					fontWeight: 700,
					fontSize: size,
					lineHeight: 1.75,
					color,
					opacity: o,
					filter: `blur(${(1 - p) * 9}px)`,
					translate: `0 ${(1 - p) * 18}px`,
					textShadow: '0 0 28px rgba(226,181,107,0.28)',
				}}
			>
				{text}
			</div>
		</At>
	);
};

/** Маленькая подпись капителью с линиями по бокам */
export const Label: React.FC<{text: string; at: number; out?: number; y: number; color?: string}> = ({text, at, out, y, color = C.gold}) => {
	const t = useT();
	const p = prog(t, at, 0.9);
	const o = vis(t, at, out, 0.5, 0.35);
	if (o <= 0) return null;
	const line: CSSProperties = {height: 2, width: 64 * p, background: color, opacity: 0.7};
	return (
		<At y={y} pad={40}>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: o}}>
				<div style={line} />
				<div
					style={{
						fontFamily: sans,
						fontWeight: 700,
						fontSize: 27,
						letterSpacing: `${0.2 + p * 0.16}em`,
						textTransform: 'uppercase',
						color,
						whiteSpace: 'nowrap',
					}}
				>
					{glue(text)}
				</div>
				<div style={line} />
			</div>
		</At>
	);
};

/** Линия, которая «рисуется» */
export const Draw: React.FC<{d: string; p: number; color?: string; width?: number; opacity?: number; fill?: string}> = ({
	d,
	p,
	color = C.gold,
	width = 3,
	opacity = 1,
	fill = 'none',
}) => (
	<path
		d={d}
		pathLength={1}
		strokeDasharray="1 1"
		strokeDashoffset={1 - p}
		stroke={color}
		strokeWidth={width}
		fill={fill}
		strokeLinecap="round"
		strokeLinejoin="round"
		opacity={opacity}
	/>
);

export const Svg: React.FC<{children: React.ReactNode; style?: CSSProperties}> = ({children, style}) => (
	<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}>
		{children}
	</svg>
);

/** Восьмиконечная звезда (два квадрата) */
export const starPath = (cx: number, cy: number, r: number) => {
	const pts: string[] = [];
	for (let i = 0; i < 16; i++) {
		const a = (Math.PI / 8) * i - Math.PI / 2;
		const rr = i % 2 === 0 ? r : r * 0.76;
		pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`);
	}
	return `M${pts.join('L')}Z`;
};

/** Псевдослучайное число по ключу */
export const rnd = (i: number, k = 1) => {
	const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
	return x - Math.floor(x);
};
