// Camera paths for each shot of the film. Coordinates are those of medina.html:
// 1 unit ≈ 1 m, north = −z, the qibla (south) = +z, the mosque is centred at 0,0.
// Each shot: frames at 30 fps, keyframes of camera position `p` and look target `t`.
export const FPS = 30;

export const SHOTS = [
	{
		id: 'opening', // descending from the south over the oasis toward the mosque, Uhud ahead
		frames: 210, extent: 280,
		p: [[150, 250, 430], [95, 160, 280], [52, 92, 160]],
		t: [[0, 0, -120], [0, 0, -50], [0, 0, 0]],
	},
	{
		id: 'mosque', // slow orbit of the mosque courtyard
		frames: 210, extent: 70,
		orbit: {c: [0, 1.5, 0], r0: 36, r1: 30, a0: 205, a1: 252, h0: 17, h1: 11},
	},
	{
		id: 'colonnade', // walk across the courtyard toward the palm-trunk hall at the qibla wall
		frames: 180, extent: 40,
		p: [[-8.2, 1.7, -2.5], [-6.6, 1.64, 4.6]],
		t: [[-3.5, 2.0, 14], [-2.5, 1.8, 14]],
	},
	{
		id: 'rawda', // inside the hall: ar-Rawda toward ‘A’isha’s door
		frames: 210, extent: 40,
		p: [[-2.6, 1.55, 11.3], [1.2, 1.5, 12.1]],
		t: [[14, 1.0, 15.2], [14, 0.95, 15.4]],
	},
	{
		id: 'minbar', // the tamarisk minbar
		frames: 165, extent: 30,
		p: [[1.8, 1.5, 11.2], [0.2, 1.35, 12.1]],
		t: [[-4.2, 0.95, 16.3], [-4.2, 0.85, 16.4]],
	},
	{
		id: 'market', // crane down over the market west of the mosque
		frames: 180, extent: 70,
		p: [[-78, 24, 46], [-90, 12, 36]],
		t: [[-113, 1, 14], [-115, 1.5, 15]],
	},
	{
		id: 'birha', // low glide through the palms of Bi'r Ha toward the well
		frames: 180, extent: 50,
		p: [[19.1, 1.9, -65.6], [27.2, 1.7, -64.7]],
		t: [[34, 1.5, -64], [34, 0.9, -64]],
	},
	{
		id: 'uhud', // looking north to Uhud, rising slowly
		frames: 210, extent: 140,
		p: [[4, 2.5, -285], [4, 16, -320]],
		t: [[0, 95, -1150], [0, 110, -1150]],
	},
	{
		id: 'finale', // pull back and rise above the whole oasis
		frames: 270, extent: 300,
		p: [[-26, 22, 52], [-110, 110, 190], [-210, 235, 360]],
		t: [[0, 0, 2], [0, 0, -20], [0, 0, -70]],
	},
];

const lerp = (a, b, k) => a + (b - a) * k;
// gentle ease: mostly linear so the camera never stops dead at a cut
const ease = (x) => 0.55 * x + 0.45 * (0.5 - 0.5 * Math.cos(Math.PI * x));

// Catmull–Rom through the keyframes
function spline(points, x) {
	if (points.length === 2) return points[0].map((v, i) => lerp(v, points[1][i], x));
	const n = points.length - 1;
	const seg = Math.min(n - 1, Math.floor(x * n));
	const u = x * n - seg;
	const P = (i) => points[Math.max(0, Math.min(n, i))];
	const p0 = P(seg - 1), p1 = P(seg), p2 = P(seg + 1), p3 = P(seg + 2);
	return p1.map((_, i) => {
		const a = p0[i], b = p1[i], c = p2[i], d = p3[i];
		return 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
	});
}

export function cameraAt(shot, f) {
	const x = ease(f / (shot.frames - 1));
	let p, t;
	if (shot.orbit) {
		const o = shot.orbit;
		const a = (lerp(o.a0, o.a1, x) * Math.PI) / 180;
		const r = lerp(o.r0, o.r1, x);
		p = [o.c[0] + Math.sin(a) * r, lerp(o.h0, o.h1, x), o.c[2] + Math.cos(a) * r];
		t = o.c;
	} else {
		p = spline(shot.p, x);
		t = spline(shot.t, x);
	}
	// faint handheld breathing, scaled to the distance of the shot
	const s = (p[1] > 30 ? 0.35 : 0.012) * 1;
	const tt = f / FPS;
	p = [p[0] + Math.sin(tt * 0.9) * s, p[1] + Math.sin(tt * 1.3 + 1) * s * 0.7, p[2] + Math.cos(tt * 0.7) * s];
	return {p, t, extent: shot.extent, q: 0.94};
}
