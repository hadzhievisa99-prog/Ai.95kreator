import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Place} from './data';
import {arabic, body, C, display} from './fonts';

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// A word that rises out of a soft blur
const Rise: React.FC<{at: number; children: React.ReactNode; dist?: number}> = ({at, children, dist = 34}) => {
	const frame = useCurrentFrame();
	return (
		<span
			style={{
				display: 'inline-block',
				opacity: interpolate(frame, [at, at + 18], [0, 1], {...clamp, easing: OUT}),
				translate: interpolate(frame, [at, at + 26], [`0px ${dist}px`, '0px 0px'], {...clamp, easing: OUT}),
				filter: `blur(${interpolate(frame, [at, at + 20], [10, 0], {...clamp, easing: OUT})}px)`,
			}}
		>
			{children}
		</span>
	);
};

const Fade: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				...style,
				opacity: interpolate(frame, [at, at + 22], [0, 1], {...clamp, easing: OUT}),
				translate: interpolate(frame, [at, at + 30], ['0px 18px', '0px 0px'], {...clamp, easing: OUT}),
			}}
		>
			{children}
		</div>
	);
};

const words = (s: string) => s.split(' ');

export const Caption: React.FC<{place: Place; index: number; count: number}> = ({place, index, count}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const start = 14;
	const titleWords = words(place.title);
	const leadAt = start + 12 + titleWords.length * 5;
	const quoteAt = leadAt + 16;
	const transAt = quoteAt + (place.arabic ? words(place.arabic).length * 3 + 14 : 0);

	return (
		<div
			style={{
				position: 'absolute',
				left: 84,
				right: 120,
				bottom: 330,
				color: C.paper,
				opacity: interpolate(frame, [durationInFrames - 26, durationInFrames - 6], [1, 0], clamp),
				textShadow: '0 2px 24px rgba(0,0,0,0.45)',
			}}
		>
			{/* kicker with a growing gold rule */}
			<div style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 26}}>
				<div
					style={{
						height: 2,
						background: C.gold,
						width: interpolate(frame, [start - 6, start + 22], [0, 72], {...clamp, easing: OUT}),
					}}
				/>
				<Fade at={start} style={{fontFamily: body, fontWeight: 700, fontSize: 27, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold}}>
					{String(index).padStart(2, '0')} / {String(count).padStart(2, '0')} · {place.kicker}
				</Fade>
			</div>

			<div
				style={{
					fontFamily: `${display}, ${arabic}`,
					fontWeight: 700,
					fontSize: place.title.length > 16 ? 92 : 118,
					lineHeight: 1.02,
					letterSpacing: '-0.01em',
					textWrap: 'balance',
				}}
			>
				{titleWords.map((w, i) => (
					<React.Fragment key={i}>
						<Rise at={start + 6 + i * 5}>{w}</Rise>{' '}
					</React.Fragment>
				))}
			</div>

			<Fade
				at={leadAt}
				style={{
					fontFamily: `${body}, ${arabic}`,
					fontWeight: 400,
					fontSize: 40,
					lineHeight: 1.38,
					color: C.paper,
					marginTop: 26,
					maxWidth: 840,
					textWrap: 'pretty',
				}}
			>
				{place.lead}
			</Fade>

			{place.arabic || place.translation ? (
				<div style={{marginTop: 38, paddingRight: 28, borderRight: `3px solid ${C.gold}`}}>
					{place.arabic ? (
						<div
							dir="rtl"
							lang="ar"
							style={{fontFamily: arabic, fontWeight: 700, fontSize: 54, lineHeight: 1.6, color: '#f8e3b8', textAlign: 'right'}}
						>
							{words(place.arabic).map((w, i) => (
								<React.Fragment key={i}>
									<Rise at={quoteAt + i * 3} dist={14}>{w}</Rise>{' '}
								</React.Fragment>
							))}
						</div>
					) : null}
					{place.translation ? (
						<Fade
							at={transAt}
							style={{fontFamily: `${display}, ${arabic}`, fontWeight: 500, fontStyle: 'italic', fontSize: 38, lineHeight: 1.3, textAlign: 'right', color: C.paper, marginTop: 6}}
						>
							{place.translation}
						</Fade>
					) : null}
					{place.source ? (
						<Fade
							at={transAt + 8}
							style={{fontFamily: `${body}, ${arabic}`, fontSize: 25, lineHeight: 1.35, color: C.muted, textAlign: 'right', marginTop: 10}}
						>
							{place.source}
						</Fade>
					) : null}
				</div>
			) : null}
		</div>
	);
};
