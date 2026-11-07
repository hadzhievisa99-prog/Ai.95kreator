import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {arabic, body, C, display} from './fonts';

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const reveal = (frame: number, at: number, dist = 40) => ({
	opacity: interpolate(frame, [at, at + 24], [0, 1], {...clamp, easing: OUT}),
	translate: interpolate(frame, [at, at + 36], [`0px ${dist}px`, '0px 0px'], {...clamp, easing: OUT}),
	filter: `blur(${interpolate(frame, [at, at + 26], [14, 0], {...clamp, easing: OUT})}px)`,
});

const Ornament: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const w = interpolate(frame, [at, at + 40], [0, 150], {...clamp, easing: OUT});
	return (
		<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, margin: '34px 0'}}>
			<div style={{height: 1.5, width: w, background: `linear-gradient(90deg, rgba(226,176,106,0), ${C.gold})`}} />
			<div
				style={{
					width: 14,
					height: 14,
					rotate: '45deg',
					border: `2px solid ${C.gold}`,
					opacity: interpolate(frame, [at + 10, at + 30], [0, 1], clamp),
				}}
			/>
			<div style={{height: 1.5, width: w, background: `linear-gradient(270deg, rgba(226,176,106,0), ${C.gold})`}} />
		</div>
	);
};

export const OpeningTitle: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'flex-start',
				paddingTop: 330,
				textAlign: 'center',
				color: C.paper,
				textShadow: '0 4px 40px rgba(0,0,0,0.55)',
				opacity: interpolate(frame, [durationInFrames - 30, durationInFrames - 8], [1, 0], clamp),
			}}
		>
			<div style={{...reveal(frame, 10, 20), fontFamily: body, fontWeight: 700, fontSize: 28, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.gold}}>
				Реконструкция · 2–6 гг. хиджры
			</div>
			<div style={{...reveal(frame, 22), fontFamily: display, fontWeight: 700, fontSize: 210, lineHeight: 0.95, marginTop: 34, letterSpacing: '-0.02em'}}>
				Медина
			</div>
			<div style={{...reveal(frame, 34), fontFamily: `${display}, ${arabic}`, fontWeight: 500, fontSize: 84, lineHeight: 1.1, marginTop: 6}}>
				Пророка ﷺ
			</div>
			<Ornament at={50} />
			<div dir="rtl" lang="ar" style={{...reveal(frame, 62, 24), fontFamily: arabic, fontWeight: 700, fontSize: 92, color: '#f8e3b8', lineHeight: 1.3}}>
				المدينة المنورة
			</div>
		</AbsoluteFill>
	);
};

export const FinaleTitle: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'flex-start',
				paddingTop: 380,
				paddingLeft: 90,
				paddingRight: 90,
				textAlign: 'center',
				color: C.paper,
				textShadow: '0 4px 40px rgba(0,0,0,0.55)',
			}}
		>
			<div dir="rtl" lang="ar" style={{...reveal(frame, 24, 24), fontFamily: arabic, fontWeight: 700, fontSize: 112, color: '#f8e3b8', lineHeight: 1.3}}>
				مدينة النبي ﷺ
			</div>
			<Ornament at={40} />
			<div style={{...reveal(frame, 50), fontFamily: `${display}, ${arabic}`, fontWeight: 700, fontSize: 76, lineHeight: 1.08, textWrap: 'balance'}}>
				Мединат ан-Наби — город Пророка ﷺ
			</div>
			<div style={{...reveal(frame, 66, 20), fontFamily: `${body}, ${arabic}`, fontSize: 36, lineHeight: 1.4, color: C.paper, marginTop: 30, maxWidth: 820, textWrap: 'balance'}}>
				Оазис между двумя лавовыми полями: пальмовые сады, колодцы и кварталы племён.
			</div>

			<div style={{position: 'absolute', left: 90, right: 90, bottom: 330, ...reveal(frame, 96, 16)}}>
				<div style={{fontFamily: body, fontWeight: 700, fontSize: 24, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.gold, marginBottom: 14}}>
					Источники
				</div>
				<div style={{fontFamily: body, fontSize: 28, lineHeight: 1.45, color: C.muted, textWrap: 'balance'}}>
					Ибн Са‘д · Ибн ан-Наджжар · ас-Самхуди · ан-Навави · Ибн аль-Джаузи · Ибн Абд аль-Барр · аль-Миззи · аль-Байхаки
				</div>
				<div style={{fontFamily: `${body}, ${arabic}`, fontSize: 24, lineHeight: 1.45, color: 'rgba(217,200,166,0.8)', marginTop: 22, textWrap: 'balance'}}>
					Реконструкция по описаниям. Людей в модели нет: Пророка ﷺ и сподвижников не изображают.
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Small running header at the top of every place
export const Header: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				top: 150,
				left: 84,
				right: 84,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				fontFamily: `${body}, ${arabic}`,
				fontWeight: 700,
				fontSize: 24,
				letterSpacing: '0.26em',
				textTransform: 'uppercase',
				color: 'rgba(246,238,221,0.82)',
				opacity: interpolate(frame, [0, 30], [0, 1], clamp),
			}}
		>
			<span>Медина Пророка ﷺ</span>
			<span dir="rtl" lang="ar" style={{fontFamily: arabic, letterSpacing: 0, textTransform: 'none', fontSize: 34, color: C.gold}}>
				المدينة المنورة
			</span>
		</div>
	);
};
