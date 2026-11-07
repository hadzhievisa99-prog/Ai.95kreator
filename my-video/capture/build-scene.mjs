// Builds capture/scene.html from ../medina.html: same 3D world, no UI,
// no render loop, and a window.__M handle so capture.mjs can drive the camera.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '..', '..', 'medina.html'), 'utf8');

const must = (s, find) => {
	if (!s.includes(find)) throw new Error('Pattern not found in medina.html: ' + find);
	return s;
};

let out = src;

// local three.js instead of the CDN
const cdn = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>';
must(out, cdn);
out = out.replace(cdn, '<script src="../node_modules/three/build/three.min.js"></script>');

// hide every UI element; only the canvas stays
out = out.replace(
	'</style>',
	'body>*:not(#c):not(script){display:none!important}\n</style>',
);

// no floating name labels in the film
must(out, 'fontWait.then(buildLabels);');
out = out.replace('fontWait.then(buildLabels);', '');

// expose the scene and stop the interactive loop
const loopStart = 'showCardState();\nrequestAnimationFrame(tick);';
must(out, loopStart);
out = out.replace(
	loopStart,
	'window.__M={THREE,scene,camera,renderer,sky,sun,SUN,palms};window.__ready=true;',
);

fs.writeFileSync(path.join(here, 'scene.html'), out);
console.log('capture/scene.html written');
