import React from 'react';
import {LINES} from './captions';
import {C, sans} from './fonts';
import {glue, prog, useT} from './kit';

// Субтитры внизу кадра: текущая фраза, слова подсвечиваются в такт озвучке.
export const Captions: React.FC = () => {
	const t = useT();
	const idx = LINES.findIndex((l, i) => t >= l.start - 0.05 && t < Math.max(l.end + 0.4, 0) && (i === LINES.length - 1 || t < LINES[i + 1].start - 0.05));
	if (idx < 0) return null;
	const line = LINES[idx];
	const p = prog(t, line.start - 0.05, 0.28);
	const outP = prog(t, line.end + 0.15, 0.25);
	return (
		<div style={{position: 'absolute', left: 90, right: 90, top: 1640, translate: '0 -50%', textAlign: 'center'}}>
			<div
				style={{
					fontFamily: sans,
					fontWeight: 700,
					fontSize: 46,
					lineHeight: 1.3,
					letterSpacing: '-0.005em',
					opacity: p * (1 - outP),
					translate: `0 ${(1 - p) * 16}px`,
					textWrap: 'balance',
					textShadow: '0 2px 18px rgba(0,0,0,0.65)',
				}}
			>
				{line.words.map((w, i) => {
					const on = prog(t, w.t - 0.04, 0.18);
					return (
						<React.Fragment key={i}>
							<span style={{color: on > 0.5 ? C.ivory : 'rgba(245,237,220,0.42)'}}>{glue(w.w)}</span>
							{i < line.words.length - 1 ? ' ' : null}
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
};

/** Верхняя плашка и тонкая полоса прогресса */
export const Header: React.FC<{total: number}> = ({total}) => {
	const t = useT();
	const o = prog(t, 0.6, 1) * (1 - prog(t, total - 5.5, 0.6));
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: o}}>
			<div style={{fontFamily: sans, fontWeight: 600, fontSize: 22, letterSpacing: '0.42em', color: C.muted, textTransform: 'uppercase'}}>
				Сира · Хиджра
			</div>
			<div style={{width: 220, height: 2, background: 'rgba(245,237,220,0.15)'}}>
				<div style={{width: `${Math.min(1, t / total) * 100}%`, height: 2, background: C.gold}} />
			</div>
		</div>
	);
};
