import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';

// Sun haze from the upper corner, floating dust in the light, and film grain.

export const SunHaze: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				mixBlendMode: 'screen',
				pointerEvents: 'none',
				opacity: interpolate(Math.sin(frame / 45), [-1, 1], [0.55, 0.75]),
				background:
					'radial-gradient(120% 70% at 12% -8%, rgba(255,206,140,0.55) 0%, rgba(255,170,90,0.18) 35%, rgba(0,0,0,0) 62%)',
			}}
		/>
	);
};

const MOTES = new Array(46).fill(0).map((_, i) => ({
	x: random(`x${i}`),
	y: random(`y${i}`),
	size: 2 + random(`s${i}`) * 7,
	speed: 0.15 + random(`v${i}`) * 0.45,
	drift: random(`d${i}`) * Math.PI * 2,
	depth: random(`z${i}`),
}));

export const Dust: React.FC<{amount?: number}> = ({amount = 1}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
			{MOTES.map((m, i) => {
				const t = frame * m.speed;
				const x = ((m.x * width + t * 0.9 + Math.sin(frame / 60 + m.drift) * 30) % (width + 40)) - 20;
				const y = ((m.y * height - t * 0.6 + height * 2) % (height + 40)) - 20;
				const twinkle = 0.45 + 0.55 * Math.sin(frame / (18 + m.depth * 20) + m.drift);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: m.size,
							height: m.size,
							borderRadius: '50%',
							background: 'rgba(255,226,170,1)',
							filter: `blur(${1 + m.depth * 3}px)`,
							opacity: amount * twinkle * (0.25 + 0.5 * (1 - m.depth)),
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

export const Grain: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.22}}>
			<svg width="100%" height="100%">
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 24} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};

// Darkening at the top and bottom so the type reads on any frame
export const Scrims: React.FC<{bottom?: number}> = ({bottom = 0.86}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<AbsoluteFill
			style={{
				background: 'linear-gradient(180deg, rgba(14,9,4,0.62) 0%, rgba(14,9,4,0) 16%)',
			}}
		/>
		<AbsoluteFill
			style={{
				background: `linear-gradient(0deg, rgba(14,9,4,${bottom}) 0%, rgba(14,9,4,${bottom * 0.7}) 26%, rgba(14,9,4,0) 52%)`,
			}}
		/>
	</AbsoluteFill>
);
