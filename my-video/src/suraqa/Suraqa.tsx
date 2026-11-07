import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Backdrop, Fades, Grain, Motes, Vignette} from './Atmosphere';
import {Captions, Header} from './Captions';
import './fonts';
import {useT} from './kit';
import {S1Bounty, S2Silhouettes, S3No, S4Spear, S5Arrows, S6Recitation} from './ScenesA';
import {S7Earth, S8Mercy, S9Hide, S10Harra, S11Tower, S12Finale} from './ScenesB';

// «Сурака ибн Малик и путь в Медину» — вертикальный ролик 1080×1920 под озвучку ElevenLabs.
export const SURAQA_SECONDS = 127;

// Удары (тряска кадра + низкий звук) и «вжухи» на переходах — секунды от начала.
const IMPACTS = [26.0, 42.9, 63.75, 66.85, 80.1];
const WHOOSHES = [11.6, 22.1, 31.95, 40.3, 52.15, 63.5, 77.7, 89.6, 97.6, 105.05, 112.75];
const SWELLS = [84.6, 116.9, 122.4];

const Shake: React.FC<{children: React.ReactNode}> = ({children}) => {
	const t = useT();
	let x = 0;
	let y = 0;
	for (const at of IMPACTS) {
		const d = t - at;
		if (d < 0 || d > 0.8) continue;
		const a = 22 * Math.exp(-d * 7);
		x += Math.sin(d * 71) * a;
		y += Math.cos(d * 53) * a * 0.7;
	}
	return <AbsoluteFill style={{translate: `${x}px ${y}px`}}>{children}</AbsoluteFill>;
};

export const Suraqa: React.FC = () => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: '#05060a'}}>
			<Backdrop />
			<Motes />
			<Shake>
				<S1Bounty />
				<S2Silhouettes />
				<S3No />
				<S4Spear />
				<S5Arrows />
				<S6Recitation />
				<S7Earth />
				<S8Mercy />
				<S9Hide />
				<S10Harra />
				<S11Tower />
				<S12Finale end={SURAQA_SECONDS} />
			</Shake>
			<Vignette />
			<Header total={SURAQA_SECONDS} />
			<Captions />
			<Grain />
			<Fades />

			<Audio src={staticFile('suraqa/voice.mp3')} volume={1} />
			<Audio src={staticFile('audio/wind.m4a')} volume={0.16} loop />
			{IMPACTS.map((at) => (
				<Sequence key={`i${at}`} name="Удар" from={Math.round((at - 0.02) * fps)} durationInFrames={Math.round(2.2 * fps)} layout="none">
					<Audio src={staticFile('suraqa/impact.m4a')} volume={0.5} />
				</Sequence>
			))}
			{WHOOSHES.map((at) => (
				<Sequence key={`w${at}`} name="Переход" from={Math.round((at - 0.9) * fps)} durationInFrames={Math.round(1.4 * fps)} layout="none">
					<Audio src={staticFile('suraqa/whoosh.m4a')} volume={0.2} />
				</Sequence>
			))}
			{SWELLS.map((at) => (
				<Sequence key={`s${at}`} name="Нарастание" from={Math.round(at * fps)} durationInFrames={Math.round(4 * fps)} layout="none">
					<Audio src={staticFile('suraqa/swell.m4a')} volume={0.22} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
