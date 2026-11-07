import {Video} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// A rendered camera move from the 3D Medina. The colour grade is baked in by capture/grade.sh.
export const Shot: React.FC<{id: string; zoom?: [number, number]}> = ({id, zoom = [1.0, 1.035]}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#140f09', overflow: 'hidden'}}>
			<PushIn zoom={zoom}>
				<Video
					src={staticFile(`shots/${id}.webm`)}
					muted
					objectFit="cover"
					style={{width: '100%', height: '100%'}}
				/>
			</PushIn>
		</AbsoluteFill>
	);
};

const PushIn: React.FC<{zoom: [number, number]; children: React.ReactNode}> = ({zoom, children}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	return (
		<AbsoluteFill
			style={{
				scale: interpolate(frame, [0, durationInFrames], zoom, {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					output: 'perceptual-scale',
				}),
			}}
		>
			{children}
		</AbsoluteFill>
	);
};
