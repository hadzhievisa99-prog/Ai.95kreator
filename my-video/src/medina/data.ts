// Texts come only from ../../medina.html (cards and sources of the 3D reconstruction); nothing is added.
// Shot lengths match capture/shots.mjs, which renders public/shots/<id>.mp4.

export type Place = {
	id: string;
	frames: number;
	kicker: string;
	title: string;
	lead: string;
	arabic?: string;
	translation?: string;
	source?: string;
	// slow digital push-in on top of the camera move
	zoom?: [number, number];
};

export const TRANSITION = 20;

export const OPENING = {id: 'opening', frames: 210};
export const FINALE = {id: 'finale', frames: 270};

export const PLACES: Place[] = [
	{
		id: 'mosque',
		frames: 210,
		kicker: 'Сердце Медины',
		title: 'Мечеть Пророка ﷺ',
		lead: 'Построена в 1 г. х. на участке Бану ан-Наджжар. Около 70 × 60 локтей — примерно 35 × 30 м.',
		arabic: 'بَنَى رَسُولُ اللَّهِ ﷺ مَسْجِدَهُ سَبْعِينَ ذِرَاعًا فِي سِتِّينَ ذِرَاعًا',
		source: 'Хариджа ибн Зейд · ан-Навави, «аль-Маджму‘» 8/277',
	},
	{
		id: 'colonnade',
		frames: 180,
		kicker: 'Внутри мечети',
		title: 'Навес у стены киблы',
		lead: 'Колонны — стволы пальм, кровля — пальмовые ветви. Пророк ﷺ сам носил кирпичи вместе со сподвижниками.',
		arabic: 'فَصَفُّوا النَّخْلَ قِبْلَةً لَهُ، وَجَعَلُوا عِضَادَتَيْهِ حِجَارَةً',
		source: 'Ибн ан-Наджжар, «ад-Дурра ас-самина», с. 233',
	},
	{
		id: 'rawda',
		frames: 210,
		kicker: 'Внутри мечети',
		title: 'Ар-Рауда',
		lead: 'Пространство между домом Пророка ﷺ — комнатой Аиши — и минбаром.',
		arabic: 'مَا بَيْنَ بَيْتِي وَمِنْبَرِي رَوْضَةٌ مِنْ رِيَاضِ الْجَنَّةِ',
		source: 'аль-Байхаки, «ас-Сунан аль-кубра» 10/511',
	},
	{
		id: 'minbar',
		frames: 165,
		kicker: 'Внутри мечети',
		title: 'Минбар',
		lead: 'Из тамариска рощи аль-Габа: две ступени и сиденье, у стены киблы.',
		arabic: 'هُوَ مِنْ أَثْلِ الغابَةِ',
		source: 'Сахль ибн Са‘д; аз-Зейдани, «аль-Мафатих фи шарх аль-Масабих» 2/232 (хадис есть у аль-Бухари)',
		zoom: [1.0, 1.05],
	},
	{
		id: 'market',
		frames: 180,
		kicker: 'Город',
		title: 'Рынок Медины',
		lead: 'Место выбрал сам Пророк ﷺ — к западу от мечети, без налога для торговцев.',
		arabic: 'هَذَا سُوقُكُمْ، فَلَا يُنْتَقَصُ، وَلَا يُضْرَبُ عَلَيْهِ خَرَاجٌ',
		source: 'аль-Миззи, «Тахзиб аль-Кямаль» 20/369',
	},
	{
		id: 'birha',
		frames: 180,
		kicker: 'Сады',
		title: 'Сад Бир Ха',
		lead: 'Любимый сад Абу Тальхи напротив мечети. Пророк ﷺ заходил сюда и пил его хорошую воду.',
		arabic: 'وَكَانَتْ مُسْتَقْبِلَةَ الْمَسْجِدِ',
		source: 'хадис Анаса · Ибн Абд аль-Барр, «ат-Тамхид» 1/402',
	},
	{
		id: 'uhud',
		frames: 210,
		kicker: 'Горы',
		title: 'Гора Ухуд',
		lead: 'Большая красноватая гора к северу от Медины. Пророк ﷺ сказал: «Ухуд — гора, которая любит нас, и мы любим её».',
		zoom: [1.0, 1.07],
	},
];

export const TOTAL_FRAMES =
	OPENING.frames +
	PLACES.reduce((s, p) => s + p.frames, 0) +
	FINALE.frames -
	(PLACES.length + 1) * TRANSITION;
