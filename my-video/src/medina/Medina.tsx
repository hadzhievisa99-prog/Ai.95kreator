import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Dust, Grain, Scrims, SunHaze} from './Atmosphere';
import {Caption} from './Caption';
import {FINALE, OPENING, PLACES, TRANSITION} from './data';
import {Shot} from './Shot';
import {FinaleTitle, Header, OpeningTitle} from './Titles';

const DUST: Record<string, number> = {colonnade: 1.3, rawda: 1.4, minbar: 1.4, birha: 1.1};

export const Medina: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#140f09'}}>
			<TransitionSeries>
				<TransitionSeries.Sequence name="Вступление" durationInFrames={OPENING.frames}>
					<Shot id="opening" zoom={[1.0, 1.04]} />
					<SunHaze />
					<Scrims bottom={0.5} />
					<TitleDim top />
					<OpeningTitle />
				</TransitionSeries.Sequence>

				{PLACES.map((place, i) => (
					<React.Fragment key={place.id}>
						<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION})} />
						<TransitionSeries.Sequence name={place.title} durationInFrames={place.frames}>
							<Shot id={place.id} zoom={place.zoom} />
							<SunHaze />
							<Dust amount={DUST[place.id] ?? 0.6} />
							<Scrims />
							<Header />
							<Caption place={place} index={i + 1} count={PLACES.length} />
						</TransitionSeries.Sequence>
					</React.Fragment>
				))}

				<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION})} />
				<TransitionSeries.Sequence name="Финал" durationInFrames={FINALE.frames}>
					<Shot id="finale" zoom={[1.03, 1.0]} />
					<SunHaze />
					<Scrims bottom={0.78} />
					<TitleDim />
					<FinaleTitle />
				</TransitionSeries.Sequence>
			</TransitionSeries>
			<Grain />
			<FadeFromBlack />
			<Audio src={staticFile('audio/wind.m4a')} volume={0.9} />
		</AbsoluteFill>
	);
};

// Soft dark pool behind centred titles
const TitleDim: React.FC<{top?: boolean}> = ({top}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(95% 42% at 50% ${top ? 28 : 40}%, rgba(14,9,4,0.62), rgba(14,9,4,0) 72%)`,
				opacity: interpolate(frame, [10, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
			}}
		/>
	);
};

// Opens from black and closes to black
const FadeFromBlack: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#000',
				pointerEvents: 'none',
				opacity: interpolate(frame, [0, 24, durationInFrames - 30, durationInFrames - 1], [1, 0, 0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
			}}
		/>
	);
};
