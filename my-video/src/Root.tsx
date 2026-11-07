import {Composition} from 'remotion';
import {TOTAL_FRAMES} from './medina/data';
import {Medina} from './medina/Medina';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition id="Medina" component={Medina} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
	);
};
