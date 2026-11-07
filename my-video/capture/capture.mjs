// Renders camera shots from the 3D Medina into public/shots/<id>.mp4.
// Usage: node capture/capture.mjs [shotId ...]   (no ids = all shots)
//        node capture/capture.mjs --stills        (first/middle/last frame of each shot as JPEG)
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {openScene, renderFrame, W, H, SS} from './lib.mjs';
import {SHOTS, FPS, cameraAt} from './shots.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, '..', 'public', 'shots');
fs.mkdirSync(outDir, {recursive: true});

const args = process.argv.slice(2);
const stills = args.includes('--stills');
const ids = args.filter((a) => !a.startsWith('--'));
const shots = ids.length ? SHOTS.filter((s) => ids.includes(s.id)) : SHOTS;

const {browser, page} = await openScene();

for (const shot of shots) {
	const t0 = Date.now();
	if (stills) {
		const dir = path.join(here, 'stills');
		fs.mkdirSync(dir, {recursive: true});
		for (const f of [0, Math.floor(shot.frames / 2), shot.frames - 1]) {
			fs.writeFileSync(path.join(dir, `${shot.id}-${f}.jpg`), await renderFrame(page, cameraAt(shot, f)));
		}
		console.log(shot.id, 'stills', Date.now() - t0, 'ms');
		continue;
	}
	const file = path.join(outDir, `${shot.id}.mp4`);
	const ff = spawn('ffmpeg', [
		'-loglevel', 'error', '-y',
		'-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
		...(SS !== 1 ? ['-vf', `scale=${W}:${H}:flags=lanczos`] : []),
		'-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p',
		'-movflags', '+faststart', file,
	], {stdio: ['pipe', 'inherit', 'inherit']});
	for (let f = 0; f < shot.frames; f++) {
		const jpg = await renderFrame(page, cameraAt(shot, f));
		if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
	}
	ff.stdin.end();
	await new Promise((r, j) => ff.on('close', (c) => (c === 0 ? r() : j(new Error('ffmpeg ' + c)))));
	console.log(shot.id, shot.frames, 'frames', ((Date.now() - t0) / 1000).toFixed(0), 's');
}

await browser.close();
