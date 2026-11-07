// Shared helpers: open the scene in headless Chromium and render frames from it.
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {chromium} = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));

export const W = 1080;
export const H = 1920;

// REALISM=0 renders the scene exactly as medina.html draws it; otherwise capture/realism.js
// is applied. SS is the supersampling factor (frames are downscaled to W×H by ffmpeg).
export const REALISM = process.env.REALISM !== '0';
export const SS = Number(process.env.SS || (REALISM ? 1.5 : 1));

export async function openScene() {
	const browser = await chromium.launch({
		args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--allow-file-access-from-files'],
	});
	const RW = Math.round(W * SS), RH = Math.round(H * SS);
	const page = await browser.newPage({viewport: {width: RW, height: RH}, deviceScaleFactor: 1});
	page.on('pageerror', (e) => console.error('page error:', e.message));
	await page.goto(pathToFileURL(path.join(here, 'scene.html')).href);
	await page.waitForFunction(() => window.__ready === true, null, {timeout: 120000});
	await page.evaluate(
		({W, H}) => {
			const {THREE, scene, camera, renderer, sun} = window.__M;
			renderer.setPixelRatio(1);
			renderer.setSize(W, H, false);
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 0.92;
			scene.fog.color.set(0xe6cfa6);
			scene.fog.near = 260;
			scene.fog.far = 3200;
			renderer.shadowMap.enabled = true;
			camera.fov = 52;
			camera.aspect = W / H;
			camera.updateProjectionMatrix();
			camera.rotation.order = 'XYZ';

			// late-afternoon light: lower, warmer sun with longer shadows
			sun.color.set(0xffd6a0);
			sun.intensity = 1.25;
			sun.shadow.mapSize.set(4096, 4096);
			sun.shadow.map && sun.shadow.map.dispose();
			sun.shadow.map = null;
			scene.children.forEach((o) => {
				if (o.isHemisphereLight) {
					o.color.set(0xcfe0f0);
					o.groundColor.set(0xa8784a);
					o.intensity = 0.55;
				}
			});
			window.__SUNDIR = new THREE.Vector3(-0.62, 0.46, 0.64).normalize();

			window.__frame = (px, py, pz, tx, ty, tz, extent, quality) => {
				camera.position.set(px, py, pz);
				camera.up.set(0, 1, 0);
				camera.lookAt(tx, ty, tz);
				window.__M.sky.position.copy(camera.position);
				// keep the shadow box centred on what the camera looks at
				const fx = tx, fz = tz;
				const D = window.__SUNDIR;
				sun.position.set(fx + D.x * 400, D.y * 400, fz + D.z * 400);
				sun.target.position.set(fx, 0, fz);
				sun.target.updateMatrixWorld();
				const sc = sun.shadow.camera;
				if (sc.right !== extent) {
					sc.left = -extent; sc.right = extent; sc.top = extent; sc.bottom = -extent;
					sc.near = 1; sc.far = 900; sc.updateProjectionMatrix();
				}
				if (window.__render) window.__render();
				else renderer.render(scene, camera);
				return renderer.domElement.toDataURL('image/jpeg', quality || 0.93);
			};
		},
		{W: RW, H: RH},
	);
	if (REALISM) {
		const info = await page.evaluate(
			(o) => window.__realism({...o, sunDir: window.__SUNDIR}),
			{width: RW, height: RH, texBase: '../../medina-real/textures/', exposure: 0.62, sunIntensity: 2.6, hemi: 0.32, turbidity: 6, rayleigh: 1.9,
				fogColor: 0xd9c2a0, fogNear: 220, fogFar: 3400},
		);
		console.log('realism layer:', info.materials, 'materials converted');
	}
	return {browser, page};
}

export async function renderFrame(page, cam) {
	const url = await page.evaluate(
		(c) => window.__frame(c.p[0], c.p[1], c.p[2], c.t[0], c.t[1], c.t[2], c.extent, c.q),
		cam,
	);
	return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
}
