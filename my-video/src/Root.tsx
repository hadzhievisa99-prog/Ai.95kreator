import {Composition} from 'remotion';
import {TOTAL_FRAMES} from './medina/data';
import {Medina} from './medina/Medina';
import {Suraqa, SURAQA_SECONDS} from './suraqa/Suraqa';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="Medina" component={Medina} durationInFrames={TOTAL_FRAMES} fps={30} width={1080} height={1920} />
			<Composition id="Suraqa" component={Suraqa} durationInFrames={SURAQA_SECONDS * 30} fps={30} width={1080} height={1920} />
		</>
	);
};
