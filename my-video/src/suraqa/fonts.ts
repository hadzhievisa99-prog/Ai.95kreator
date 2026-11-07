import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Шрифты лежат в public/fonts (Fontsource / Google Fonts, SIL Open Font License),
// поэтому рендер не зависит от сети.
const LATIN =
	'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const CYRILLIC = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';

type F = {family: string; file: string; weight: string; style?: string; unicodeRange?: string};

const fonts: F[] = [
	...(['700', '800', '900'] as const).flatMap((w) => [
		{family: 'Suraqa Display', file: `playfair-display-latin-${w}-normal.woff2`, weight: w, unicodeRange: LATIN},
		{family: 'Suraqa Display', file: `playfair-display-cyrillic-${w}-normal.woff2`, weight: w, unicodeRange: CYRILLIC},
	]),
	...(['500', '600'] as const).flatMap((w) => [
		{family: 'Suraqa Display', file: `playfair-display-latin-${w}-italic.woff2`, weight: w, style: 'italic', unicodeRange: LATIN},
		{family: 'Suraqa Display', file: `playfair-display-cyrillic-${w}-italic.woff2`, weight: w, style: 'italic', unicodeRange: CYRILLIC},
	]),
	...(['500', '600', '700', '800'] as const).flatMap((w) => [
		{family: 'Suraqa Sans', file: `manrope-latin-${w}-normal.woff2`, weight: w, unicodeRange: LATIN},
		{family: 'Suraqa Sans', file: `manrope-cyrillic-${w}-normal.woff2`, weight: w, unicodeRange: CYRILLIC},
	]),
	{family: 'Suraqa Arabic', file: 'Amiri-400-arabic.woff2', weight: '400'},
	{family: 'Suraqa Arabic', file: 'Amiri-700-arabic.woff2', weight: '700'},
];

fonts.forEach((f) =>
	loadFont({
		family: f.family,
		url: staticFile(`fonts/${f.file}`),
		weight: f.weight,
		style: f.style ?? 'normal',
		unicodeRange: f.unicodeRange,
	}),
);

// ﷺ берётся из арабского шрифта, поэтому он в конце каждого набора.
export const display = "'Suraqa Display', 'Suraqa Arabic', serif";
export const sans = "'Suraqa Sans', 'Suraqa Arabic', sans-serif";
export const arabic = "'Suraqa Arabic', serif";

export const C = {
	ivory: '#f5eddc',
	gold: '#e2b56b',
	goldSoft: '#c99a55',
	sand: '#b98e5c',
	ember: '#d0573a',
	muted: '#a89a83',
	ink: '#07080c',
};
