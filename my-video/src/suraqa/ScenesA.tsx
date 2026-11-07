import React from 'react';
import {interpolate} from 'remotion';
import {arabic, C, display, sans} from './fonts';
import {Arabic, At, Draw, easeInOut, glue, Label, prog, Reveal, rnd, Scene, starPath, Svg, useT, vis} from './kit';

// Арабские цитаты — дословно из хадиса (аль-Бухари, глава о переселении Пророка ﷺ в Медину;
// сверено по «Джами‘ аль-усуль» Ибн аль-Асира, т. 11, с. 583–588).

/* ───────────── 1. Награда ───────────── */
const Seal: React.FC = () => {
	const t = useT();
	const cx = 540;
	const cy = 690;
	const circ = (r: number) => `M${cx},${cy - r} a${r},${r} 0 1,1 0,${2 * r} a${r},${r} 0 1,1 0,${-2 * r}`;
	const ticks = new Array(72).fill(0).map((_, i) => i);
	const starP = prog(t, 0.5, 1.8);
	const starOut = 1 - prog(t, 5.0, 0.6);
	const ringText = vis(t, 5.6, undefined, 1.2);
	return (
		<Svg style={{filter: 'drop-shadow(0 0 18px rgba(226,181,107,0.35))'}}>
			<defs>
				<path id="seal-text" d={circ(232)} />
			</defs>
			<Draw d={circ(300)} p={prog(t, 0.3, 1.8, easeInOut)} width={3} />
			<Draw d={circ(268)} p={prog(t, 0.6, 1.8, easeInOut)} width={1.5} opacity={0.6} />
			<g transform={`rotate(${t * 5} ${cx} ${cy})`}>
				{ticks.map((i) => {
					const a = (i / 72) * Math.PI * 2;
					const o = prog(t, 1 + i * 0.012, 0.4);
					const r1 = i % 6 === 0 ? 276 : 280;
					return (
						<line
							key={i}
							x1={cx + Math.cos(a) * r1}
							y1={cy + Math.sin(a) * r1}
							x2={cx + Math.cos(a) * 292}
							y2={cy + Math.sin(a) * 292}
							stroke={C.gold}
							strokeWidth={i % 6 === 0 ? 2.5 : 1.2}
							opacity={o * 0.8}
						/>
					);
				})}
			</g>
			<g transform={`rotate(${-t * 7} ${cx} ${cy})`} opacity={ringText}>
				<text fontFamily={sans} fontWeight={700} fontSize={25} letterSpacing={9} fill={C.gold}>
					<textPath href="#seal-text">ЦЕНА КРОВИ · ЗА КАЖДОГО · ЦЕНА КРОВИ · ЗА КАЖДОГО · ЦЕНА КРОВИ · ЗА КАЖДОГО ·</textPath>
				</text>
			</g>
			<g opacity={starOut} transform={`rotate(${t * 9} ${cx} ${cy})`}>
				<Draw d={starPath(cx, cy, 150)} p={starP} width={2.5} />
				<Draw d={starPath(cx, cy, 112)} p={prog(t, 0.9, 1.8)} width={1.2} opacity={0.6} />
			</g>
			<text
				x={cx}
				y={cy + 52}
				textAnchor="middle"
				direction="rtl"
				fontFamily={arabic}
				fontWeight={700}
				fontSize={190}
				fill={C.gold}
				opacity={prog(t, 5.3, 1.2)}
				style={{filter: `blur(${(1 - prog(t, 5.3, 1.2)) * 10}px)`}}
			>
				دِيةَ
			</text>
		</Svg>
	);
};

const Pills: React.FC = () => {
	const t = useT();
	const items = [
		{w: 'убьёт', ember: true},
		{w: 'или', ember: false},
		{w: 'приведёт пленными', ember: true},
	];
	return (
		<At y={1290}>
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, flexWrap: 'wrap'}}>
				{items.map((it, i) => {
					const p = prog(t, 8.7 + i * 0.35, 0.6);
					return (
						<div
							key={i}
							style={{
								fontFamily: sans,
								fontWeight: 800,
								fontSize: 36,
								letterSpacing: '0.04em',
								color: it.ember ? C.ivory : C.muted,
								padding: it.ember ? '14px 30px' : '14px 4px',
								borderRadius: 999,
								border: it.ember ? `2px solid ${C.ember}` : 'none',
								background: it.ember ? 'rgba(208,87,58,0.16)' : 'none',
								opacity: p,
								scale: `${0.85 + 0.15 * p}`,
							}}
						>
							{it.w}
						</div>
					);
				})}
			</div>
		</At>
	);
};

export const S1Bounty: React.FC = () => (
	<Scene name="1 · Награда" from={0} to={11.6}>
		<Label text="Мекка · курайшиты" at={0.3} y={240} />
		<Seal />
		<At y={1135}>
			<Reveal text="Награда" at={1.0} size={176} weight={900} />
		</At>
		<At y={1290}>
			<Reveal text="за Посланника Аллаха ﷺ и Абу Бакра" at={2.5} out={8.3} size={56} weight={600} italic color={C.gold} stagger={0.05} />
		</At>
		<Pills />
	</Scene>
);

/* ───────────── 2. Собрание и силуэты ───────────── */
const Assembly: React.FC = () => {
	const t = useT();
	const o = vis(t, 12.0, 16.1, 0.6, 0.5);
	const n = 13;
	return (
		<Svg style={{opacity: o}}>
			<ellipse cx={540} cy={1000} rx={330} ry={96} fill="none" stroke={C.gold} strokeWidth={1.2} opacity={0.35 * prog(t, 12, 1.2)} />
			{new Array(n).fill(0).map((_, i) => {
				const a = (i / n) * Math.PI * 2 + 0.3;
				const p = prog(t, 12.2 + i * 0.07, 0.6);
				return <circle key={i} cx={540 + Math.cos(a) * 330} cy={1000 + Math.sin(a) * 96} r={11 * p} fill={C.goldSoft} opacity={0.85} />;
			})}
			{/* вошёл человек */}
			{(() => {
				const p = prog(t, 14.8, 1.2);
				const x = interpolate(p, [0, 1], [1120, 900]);
				return (
					<>
						<circle cx={x} cy={1000} r={13} fill={C.ivory} opacity={p} />
						<circle cx={x} cy={1000} r={13 + 30 * ((t * 1.2) % 1)} fill="none" stroke={C.ivory} strokeWidth={2} opacity={p * (1 - ((t * 1.2) % 1))} />
					</>
				);
			})()}
		</Svg>
	);
};

const COAST = (() => {
	let d = 'M430,300';
	for (let y = 300; y <= 1140; y += 20) {
		const x = 430 + Math.sin(y / 90) * 34 + Math.sin(y / 37 + 1) * 12 + (y - 300) * -0.06;
		d += ` L${x.toFixed(1)},${y}`;
	}
	return d;
})();

const coastX = (y: number) => 430 + Math.sin(y / 90) * 34 + Math.sin(y / 37 + 1) * 12 + (y - 300) * -0.06;

const CoastMap: React.FC = () => {
	const t = useT();
	const o = vis(t, 16.3, undefined, 0.6);
	const draw = prog(t, 16.3, 1.8, easeInOut);
	const route = new Array(22).fill(0).map((_, i) => 320 + i * 38);
	const dotsY = interpolate(t, [16.8, 22.2], [1040, 820]);
	return (
		<Svg style={{opacity: o}}>
			{/* море — штриховка слева */}
			{new Array(30).fill(0).map((_, i) => {
				const y = 320 + i * 28;
				const x2 = coastX(y) - 26;
				const shift = ((t * 22 + i * 17) % 60) - 30;
				return <line key={i} x1={130} y1={y} x2={Math.max(140, x2 + shift * 0.2)} y2={y} stroke="#7d96b0" strokeWidth={1.4} opacity={0.22 * draw} />;
			})}
			<Draw d={COAST} p={draw} width={3} />
			{/* дорога вдоль берега */}
			{route.map((y, i) => (
				<circle key={i} cx={coastX(y) + 84} cy={y} r={3} fill={C.gold} opacity={0.55 * prog(t, 17 + i * 0.04, 0.4)} />
			))}
			<text x={250} y={360} fontFamily={sans} fontWeight={700} fontSize={22} letterSpacing={7} fill="#9fb3c8" opacity={0.8 * draw} textAnchor="middle">
				МОРЕ
			</text>
			{/* силуэты */}
			{[0, 1, 2].map((i) => {
				const y = dotsY + i * 30;
				const p = prog(t, 17.0 + i * 0.2, 0.8);
				return (
					<g key={i}>
						<circle cx={coastX(y) + 84} cy={y} r={9} fill={C.ivory} opacity={p * (0.75 + 0.25 * Math.sin(t * 6 + i))} />
					</g>
				);
			})}
			{(() => {
				const pulse = (t * 0.8) % 1;
				const cy = dotsY + 30;
				const cxx = coastX(cy) + 84;
				return (
					<g opacity={prog(t, 17.6, 0.8)}>
						<circle cx={cxx} cy={cy} r={60 + pulse * 70} fill="none" stroke={C.gold} strokeWidth={2} opacity={1 - pulse} />
						<circle cx={cxx} cy={cy} r={60} fill="none" stroke={C.gold} strokeWidth={1.4} strokeDasharray="6 8" />
						<line x1={cxx + 62} y1={cy} x2={cxx + 150} y2={cy} stroke={C.gold} strokeWidth={1.4} />
					</g>
				);
			})()}
		</Svg>
	);
};

const CoastTag: React.FC = () => {
	const t = useT();
	const dotsY = interpolate(t, [16.8, 22.2], [1040, 820]) + 30;
	return (
		<div style={{position: 'absolute', left: coastX(dotsY) + 84 + 160, top: dotsY, translate: '0 -50%', width: 330}}>
			<Reveal text="силуэты" at={17.9} size={40} weight={600} italic color={C.ivory} tracking="0" />
			<div style={{height: 6}} />
			<Reveal text="Мухаммад ﷺ и его спутники?" at={19.9} size={30} weight={700} font={sans} color={C.gold} tracking="0" lineHeight={1.25} />
		</div>
	);
};

export const S2Silhouettes: React.FC = () => (
	<Scene name="2 · Силуэты на побережье" from={11.6} to={22.1}>
		<Label text="Племя бану Мудлидж" at={11.9} out={16.1} y={240} />
		<Label text="Береговая дорога" at={16.4} y={240} />
		<At y={540}>
			<Reveal text="Сурака ибн Малик" at={11.9} out={16.1} size={124} weight={900} />
		</At>
		<At y={720}>
			<Reveal text="сидел в собрании своего племени," at={12.6} out={14.6} size={58} weight={600} italic color={C.gold} stagger={0.04} />
		</At>
		<At y={720}>
			<Reveal text="когда вошёл человек" at={14.8} out={16.1} size={58} weight={600} italic color={C.gold} stagger={0.05} />
		</At>
		<Assembly />
		<CoastMap />
		<CoastTag />
		<Arabic text="إني قد رأيتُ آنفاً أسْوِدَةً بالسّاحل" at={16.6} y={1290} size={60} />
	</Scene>
);

/* ───────────── 3. «Нет» ───────────── */
const BigNo: React.FC = () => {
	const t = useT();
	const p = prog(t, 26.0, 0.5);
	const dim = prog(t, 29.2, 0.8);
	if (t < 25.95) return null;
	return (
		<At y={900}>
			<div
				style={{
					fontFamily: display,
					fontWeight: 900,
					fontSize: 400,
					lineHeight: 1,
					color: C.ember,
					letterSpacing: '-0.03em',
					scale: `${interpolate(p, [0, 1], [1.35, 1]) * interpolate(dim, [0, 1], [1, 0.62])}`,
					opacity: p * interpolate(dim, [0, 1], [1, 0.28]),
					filter: `blur(${(1 - p) * 14}px)`,
					textShadow: '0 0 60px rgba(208,87,58,0.35)',
				}}
			>
				Нет.
			</div>
		</At>
	);
};

export const S3No: React.FC = () => (
	<Scene name="3 · «Нет»" from={22.1} to={31.95}>
		<At y={640}>
			<Reveal text="Сурака сразу понял." at={22.3} out={24.8} size={74} weight={600} italic color={C.muted} />
		</At>
		<At y={880}>
			<Reveal text="Это они." at={24.0} out={24.95} size={200} weight={900} color={C.gold} stagger={0.08} />
		</At>
		<At y={640}>
			<Reveal text="Но сказал:" at={25.0} out={29.0} size={74} weight={600} italic color={C.muted} />
		</At>
		<BigNo />
		<Arabic text="إنهم ليسوا بهم" at={26.4} out={29.0} y={1150} size={66} />
		<At y={1290}>
			<Reveal text="«Ты видел таких-то. Они ушли у нас на глазах»" at={26.8} out={29.0} size={50} weight={600} italic stagger={0.05} />
		</At>
		<At y={640}>
			<Reveal text="Посидел ещё немного —" at={29.3} size={74} weight={600} italic color={C.muted} />
		</At>
		<At y={1170}>
			<Reveal text="и встал." at={30.6} size={150} weight={900} />
		</At>
	</Scene>
);

/* ───────────── 4. Копьё ───────────── */
const HILL = 'M-20,1062 C300,1058 520,840 760,850 C900,856 980,1000 1100,1040';
const GROUND = 'M0,1060 L1080,1060';

const SpearScene: React.FC = () => {
	const t = useT();
	const hillP = prog(t, 32.2, 1.6, easeInOut);
	const hillDim = interpolate(prog(t, 34.8, 0.8), [0, 1], [1, 0.35]);
	const spearDraw = prog(t, 34.9, 1.1, easeInOut);
	const angle = interpolate(prog(t, 36.4, 1.6, easeInOut), [0, 1], [-34, 19]);
	const L = 400;
	const px = 520;
	const py = 900;
	return (
		<Svg style={{filter: 'drop-shadow(0 0 14px rgba(226,181,107,0.3))'}}>
			<Draw d={GROUND} p={prog(t, 32.0, 1.4)} width={1.6} opacity={0.5} />
			<g opacity={hillDim}>
				{/* конь ждёт за холмом */}
				<circle cx={880} cy={985} r={10} fill={C.ivory} opacity={prog(t, 33.6, 0.6) * (0.7 + 0.3 * Math.sin(t * 5))} />
				<circle cx={880} cy={985} r={10 + 26 * ((t * 1.1) % 1)} fill="none" stroke={C.ivory} strokeWidth={1.6} opacity={prog(t, 33.6, 0.6) * (1 - ((t * 1.1) % 1))} />
				<path d={`${HILL} L1100,1062 Z`} fill="#0b0909" opacity={hillP * 0.9} />
				<Draw d={HILL} p={hillP} width={3} />
			</g>
			<g opacity={spearDraw > 0 ? 1 : 0} transform={`rotate(${angle} ${px} ${py})`}>
				<Draw d={`M${px - L},${py} L${px + L - 40},${py}`} p={spearDraw} width={5} color={C.ivory} />
				<path
					d={`M${px + L - 44},${py - 18} L${px + L + 46},${py} L${px + L - 44},${py + 18} Z`}
					fill={C.gold}
					opacity={prog(t, 35.7, 0.5)}
				/>
				<line x1={px + L - 50} y1={py - 26} x2={px + L - 50} y2={py + 26} stroke={C.gold} strokeWidth={4} opacity={prog(t, 35.7, 0.5)} />
			</g>
		</Svg>
	);
};

const HorseTag: React.FC = () => {
	const t = useT();
	const o = vis(t, 33.8, 34.7, 0.5, 0.3);
	if (o <= 0) return null;
	return (
		<div style={{position: 'absolute', left: 700, top: 900, width: 360, textAlign: 'center', opacity: o, fontFamily: sans, fontWeight: 800, fontSize: 24, letterSpacing: '0.3em', color: C.ivory}}>
			КОНЬ
		</div>
	);
};

export const S4Spear: React.FC = () => (
	<Scene name="4 · Копьё" from={31.95} to={40.3}>
		<Label text="Тайком" at={32.2} out={34.6} y={240} />
		<Label text="Через задний ход" at={34.9} y={240} />
		<At y={480}>
			<Reveal text="Конь — за холмом" at={32.3} out={34.6} size={110} weight={900} />
		</At>
		<At y={480}>
			<Reveal text="Взял копьё" at={34.8} size={120} weight={900} />
		</At>
		<At y={630}>
			<Reveal text="опустив наконечник к земле," at={36.4} out={38.1} size={56} weight={600} italic color={C.gold} stagger={0.05} />
		</At>
		<At y={630}>
			<Reveal text="чтобы никто не заметил" at={38.3} size={56} weight={600} italic color={C.gold} stagger={0.05} />
		</At>
		<SpearScene />
		<HorseTag />
		<Arabic text="وخَفَضْتُ عاليَه" at={36.6} y={1250} size={74} />
	</Scene>
);

/* ───────────── 5. Погоня и стрелы ───────────── */
const shoe = (x: number, y: number) => `M${x - 15},${y - 6} C${x - 15},${y + 20} ${x + 15},${y + 20} ${x + 15},${y - 6}`;

const Chase: React.FC = () => {
	const t = useT();
	const o = vis(t, 40.3, 45.2, 0.3, 0.5);
	const prints = new Array(10).fill(0).map((_, i) => ({x: 110 + i * 96, y: i % 2 ? 1020 : 1080, at: 40.5 + i * 0.24}));
	const skid = prog(t, 42.9, 0.5);
	return (
		<Svg style={{opacity: o}}>
			<Draw d={GROUND} p={1} width={1.6} opacity={0.5} />
			{/* штрихи скорости */}
			{new Array(14).fill(0).map((_, i) => {
				const y = 560 + rnd(i, 11) * 420;
				const len = 120 + rnd(i, 12) * 260;
				const x = 1180 - (((t - 40) * (900 + rnd(i, 13) * 700) + rnd(i, 14) * 1400) % 1500);
				const speed = 1 - prog(t, 42.9, 0.4);
				return <line key={i} x1={x} y1={y} x2={x + len} y2={y} stroke={C.gold} strokeWidth={1.6} opacity={0.32 * speed} strokeLinecap="round" />;
			})}
			{prints.map((pr, i) => {
				const p = prog(t, pr.at, 0.25);
				if (t > 42.9 && pr.at > 42.9) return null;
				return <path key={i} d={shoe(pr.x, pr.y)} stroke={C.sand} strokeWidth={5} fill="none" strokeLinecap="round" opacity={p * 0.9} />;
			})}
			{/* след заноса */}
			<Draw d="M780,1050 C840,1062 900,1040 990,1068" p={skid} width={4} color={C.ember} />
		</Svg>
	);
};

const Arrows: React.FC = () => {
	const t = useT();
	const o = vis(t, 45.4, 51.3, 0.4, 0.6);
	const bx = 540;
	const by = 1060;
	const angles = [-112, -90, -68];
	const chosen = prog(t, 48.8, 0.8);
	return (
		<Svg style={{opacity: o, filter: 'drop-shadow(0 0 12px rgba(226,181,107,0.3))'}}>
			{angles.map((a0, i) => {
				const spread = prog(t, 45.6 + i * 0.12, 1.0);
				const a = interpolate(spread, [0, 1], [-90, a0]) + Math.sin(t * 1.6 + i) * 1.2;
				const isChosen = i === 1;
				const lift = isChosen ? chosen * -70 : 0;
				const dim = isChosen ? 1 : 1 - chosen * 0.7;
				const col = isChosen ? interpolate(chosen, [0, 1], [0, 1]) : 0;
				const stroke = col > 0.5 ? C.ember : C.gold;
				return (
					<g key={i} transform={`translate(0 ${lift}) rotate(${a + 90} ${bx} ${by})`} opacity={dim}>
						<Draw d={`M${bx},${by} L${bx},${by - 600}`} p={spread} width={4} color={C.ivory} />
						<path d={`M${bx - 16},${by - 572} L${bx},${by - 620} L${bx + 16},${by - 572}`} stroke={stroke} strokeWidth={5} fill="none" strokeLinejoin="round" opacity={spread} />
						{[0, 1, 2].map((k) => (
							<path
								key={k}
								d={`M${bx},${by - 30 - k * 22} L${bx - 18},${by - 6 - k * 22} M${bx},${by - 30 - k * 22} L${bx + 18},${by - 6 - k * 22}`}
								stroke={stroke}
								strokeWidth={3}
								opacity={spread * 0.9}
							/>
						))}
					</g>
				);
			})}
			<circle cx={540} cy={by - 690 - 70 * chosen} r={34 + 10 * Math.sin(t * 5)} fill="none" stroke={C.ember} strokeWidth={2} opacity={chosen * 0.9} />
		</Svg>
	);
};

export const S5Arrows: React.FC = () => (
	<Scene name="5 · Погоня и стрелы" from={40.3} to={52.15}>
		<At y={470}>
			<Reveal text="Он гнал коня" at={40.5} out={42.8} size={124} weight={900} />
		</At>
		<At y={470}>
			<Reveal text="Конь споткнулся" at={42.9} out={45.1} size={98} weight={900} color={C.ember} />
		</At>
		<At y={610}>
			<Reveal text="Сурака упал" at={43.8} out={45.1} size={62} weight={600} italic color={C.muted} />
		</At>
		<Chase />
		<Label text="Аль-азлям · гадальные стрелы" at={45.5} y={240} />
		<Arrows />
		<At y={1220}>
			<Reveal text="Навредить им или нет?" at={47.1} out={48.6} size={86} weight={800} />
		</At>
		<Arabic text="أضُرُّهم أم لا؟" at={47.3} out={48.6} y={1400} size={70} />
		<At y={1220}>
			<Reveal text="Выпало то, чего он не хотел" at={48.8} out={50.8} size={78} weight={800} />
		</At>
		<Arabic text="فخرج الذي أكره" at={49.0} out={50.8} y={1400} size={70} color={C.ember} />
		<At y={1250}>
			<Reveal text="Он не послушал." at={51.0} size={110} weight={900} color={C.ember} />
		</At>
	</Scene>
);

/* ───────────── 6. Чтение Корана ───────────── */
const Waves: React.FC<{cy: number}> = ({cy}) => {
	const t = useT();
	const o = vis(t, 53.4, undefined, 0.8);
	const k = interpolate(prog(t, 58.2, 1.2), [0, 1], [1, 0.45]);
	return (
		<Svg style={{opacity: o * k}}>
			{new Array(8).fill(0).map((_, i) => {
				const ph = (((t - 53.4) * 0.32 + i / 8) % 1 + 1) % 1;
				const r = 40 + ph * 520;
				return <circle key={i} cx={540} cy={cy} r={r} fill="none" stroke={C.gold} strokeWidth={2.2 - ph * 1.6} opacity={(1 - ph) * 0.75} />;
			})}
			<g transform={`rotate(${t * 8} 540 ${cy})`}>
				<Draw d={starPath(540, cy, 46)} p={prog(t, 53.5, 1.2)} width={2} />
			</g>
			<circle cx={540} cy={cy} r={8} fill={C.ivory} />
		</Svg>
	);
};

const TurnIcon: React.FC<{swing: boolean; at: number}> = ({swing, at}) => {
	const t = useT();
	const p = prog(t, at, 0.8);
	const rot = swing ? Math.sin((t - at) * 3.2) * 150 * p : 0;
	return (
		<svg width={120} height={120} viewBox="0 0 120 120" style={{opacity: p}}>
			<circle cx={60} cy={60} r={54} fill="none" stroke={C.gold} strokeWidth={1.5} opacity={0.5} />
			<g transform={`rotate(${rot} 60 60)`}>
				<path d="M60,92 L60,30 M42,48 L60,28 L78,48" stroke={swing ? C.ivory : C.gold} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
			</g>
		</svg>
	);
};

const Cards: React.FC = () => {
	const t = useT();
	const cards = [
		{who: 'Пророк ﷺ', what: 'не оборачивался', swing: false, at: 58.3},
		{who: 'Абу Бакр', what: 'оглядывался снова и снова', swing: true, at: 60.3},
	];
	return (
		<div style={{position: 'absolute', left: 70, right: 70, top: 1010, display: 'flex', gap: 30}}>
			{cards.map((c, i) => {
				const p = prog(t, c.at, 0.8);
				return (
					<div
						key={i}
						style={{
							flex: 1,
							height: 380,
							borderRadius: 28,
							border: '1.5px solid rgba(226,181,107,0.45)',
							background: 'linear-gradient(180deg, rgba(20,16,12,0.72), rgba(10,8,6,0.5))',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 22,
							padding: '0 26px',
							opacity: p,
							translate: `0 ${(1 - p) * 40}px`,
						}}
					>
						<TurnIcon swing={c.swing} at={c.at + 0.2} />
						<div style={{fontFamily: sans, fontWeight: 800, fontSize: 26, letterSpacing: '0.24em', color: C.gold, textTransform: 'uppercase'}}>{glue(c.who)}</div>
						<div style={{fontFamily: display, fontWeight: 600, fontStyle: 'italic', fontSize: 44, lineHeight: 1.15, color: C.ivory, textAlign: 'center', textWrap: 'balance'}}>
							{c.what}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const S6Recitation: React.FC = () => (
	<Scene name="6 · Чтение Корана" from={52.15} to={63.5}>
		<At y={860}>
			<Reveal text="Снова в седло." at={52.3} out={53.3} size={140} weight={900} />
		</At>
		<Waves cy={640} />
		<At y={1130}>
			<Reveal text="Он слышал, как Посланник Аллаха ﷺ читает Коран" at={53.5} out={58.0} size={74} weight={800} stagger={0.05} />
		</At>
		<Arabic text="سمعتُ قراءةَ رسولِ الله ﷺ" at={54.6} out={58.0} y={1350} size={66} />
		<Cards />
	</Scene>
);
