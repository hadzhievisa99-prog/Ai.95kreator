// Builds the realistic version of the 3D walk from medina-real/original.html
// (the original medina.html, kept unchanged) into:
//   ../index.html, ../medina.html — the pages served on GitHub Pages (assets under medina-real/)
//   medina-real/index.html  — the same page with assets next to it
// Run: node medina-real/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(here, 'original.html'), 'utf8');
let out;

const swap = (find, repl) => {
	if (!out.includes(find)) throw new Error('Pattern not found in original.html: ' + find.slice(0, 80));
	out = out.replace(find, repl);
};

function build(prefix) {
	out = source;
	// three.js r128 add-ons (same version as the page) + the realism layer
	const ex = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/';
	const libs = [
		'objects/Sky.js',
		'math/SimplexNoise.js',
		'shaders/CopyShader.js',
		'shaders/SSAOShader.js',
		'shaders/LuminosityHighPassShader.js',
		'shaders/GammaCorrectionShader.js',
		'postprocessing/EffectComposer.js',
		'postprocessing/MaskPass.js',
		'postprocessing/RenderPass.js',
		'postprocessing/ShaderPass.js',
		'postprocessing/SSAOPass.js',
		'postprocessing/UnrealBloomPass.js',
	].map((l) => ex + l);
	const cdn = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>';
	swap(cdn, [cdn, ...libs.map((l) => `<script src="${l}"></script>`), `<script src="${prefix}realism.js"></script>`].join('\n'));

	swap('<title>Медина Пророка ﷺ</title>', '<title>Медина Пророка ﷺ — реалистичная версия</title>');
	swap(
		'<li>Ибн Абд аль-Барр, «ат-Тамхид»; аль-Миззи, «Тахзиб аль-Кямаль»; аль-Байхаки, «ас-Сунан аль-кубра»</li>',
		'<li>Ибн Абд аль-Барр, «ат-Тамхид»; аль-Миззи, «Тахзиб аль-Кямаль»; аль-Байхаки, «ас-Сунан аль-кубра»</li>\n    </ul>\n    <h2>Реалистичная версия</h2>\n    <ul>\n      <li>Фото-текстуры песка, гальки, глины, камня, коры пальм и дерева — Poly Haven (CC0); небо и свет рассчитаны по модели атмосферы. Постройки, размеры и тексты — как в исходной модели.</li>',
	);

	// name labels are drawn on canvases: mark them sRGB for the new colour pipeline
	swap(
		'const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;',
		'const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;t.encoding=THREE.sRGBEncoding;',
	);

	// render through the post-processing chain when it is active
	swap('renderer.render(scene,camera);}', 'if(window.__render)window.__render();else renderer.render(scene,camera);}');
	swap(
		'function resize(){renderer.setSize(innerWidth,innerHeight,false);',
		'function resize(){renderer.setSize(innerWidth,innerHeight,false);if(window.__resizePost)window.__resizePost(innerWidth,innerHeight);',
	);

	// apply the realism layer once the world is built; the entry button waits for the textures
	swap(
		'showCardState();\nrequestAnimationFrame(tick);',
		`showCardState();
	window.__M={THREE,scene,camera,renderer,sky,sun,SUN,palms,TX:{sandTex,gravelTex,pathTex,brickTex,stoneTex,plasterTex,frondMudTex,thatchTex,woodTex,trunkTex,frondTex,curtainTex,fabricTex}};
	{const go=$('#go'),label=go.textContent;go.disabled=true;go.textContent='Загрузка текстур…';
	 window.__realism({texBase:'${prefix}textures/',width:innerWidth,height:innerHeight,pixelRatio:renderer.getPixelRatio(),sunDir:SUN.clone(),post:!isTouch,
	   exposure:0.58,sunIntensity:2.6,hemi:0.32,turbidity:6,rayleigh:1.9,fogColor:0xd9c2a0,fogNear:180,fogFar:2600})
	  .catch(e=>console.error('realism layer:',e))
	  .finally(()=>{go.disabled=false;go.textContent=label;});}
	requestAnimationFrame(tick);`,
	);

	return out;
}

const site = build('medina-real/');
fs.writeFileSync(path.join(here, '..', 'index.html'), site); // the site's main page opens the walk
fs.writeFileSync(path.join(here, '..', 'medina.html'), site);
fs.writeFileSync(path.join(here, 'index.html'), build(''));
console.log('index.html, medina.html and medina-real/index.html written');
