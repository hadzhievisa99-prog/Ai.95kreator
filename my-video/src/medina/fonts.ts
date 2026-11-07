import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts are bundled in public/fonts (Google Fonts, SIL Open Font License),
// so renders don't depend on the network.
const LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const CYRILLIC = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';

const fonts = [
	{family: 'Medina Display', url: 'fonts/Alegreya-latin.woff2', weight: '400 900', unicodeRange: LATIN},
	{family: 'Medina Display', url: 'fonts/Alegreya-cyrillic.woff2', weight: '400 900', unicodeRange: CYRILLIC},
	{family: 'Medina Sans', url: 'fonts/AlegreyaSans-400-latin.woff2', weight: '400', unicodeRange: LATIN},
	{family: 'Medina Sans', url: 'fonts/AlegreyaSans-400-cyrillic.woff2', weight: '400', unicodeRange: CYRILLIC},
	{family: 'Medina Sans', url: 'fonts/AlegreyaSans-700-latin.woff2', weight: '700', unicodeRange: LATIN},
	{family: 'Medina Sans', url: 'fonts/AlegreyaSans-700-cyrillic.woff2', weight: '700', unicodeRange: CYRILLIC},
	{family: 'Medina Arabic', url: 'fonts/Amiri-400-arabic.woff2', weight: '400'},
	{family: 'Medina Arabic', url: 'fonts/Amiri-700-arabic.woff2', weight: '700'},
];

fonts.forEach((f) => loadFont({...f, url: staticFile(f.url)}));

export const display = "'Medina Display'";
export const body = "'Medina Sans'";
export const arabic = "'Medina Arabic'";

export const C = {
	paper: '#f6eedd',
	muted: '#d9c8a6',
	gold: '#e2b06a',
	palm: '#b3d17e',
	ink: '#140f09',
};
