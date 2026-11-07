// "Realism layer" for the film capture. Runs inside capture/scene.html only;
// medina.html itself is never modified.
//
// - swaps the hand-drawn canvas textures for photographic CC0 PBR textures
//   (Poly Haven: colour + normal + roughness), see capture/textures/CREDITS.md
// - converts every material to physically based MeshStandardMaterial in a linear/sRGB pipeline
// - replaces the gradient sky with an atmospheric-scattering sky that also lights the scene (IBL)
// - adds ambient occlusion (SSAO) and a faint bloom as post-processing
/* global THREE */
window.__realism = async function realism(opts) {
	const {scene, renderer, camera, sun, sky, TX} = window.__M;
	const W = opts.width, H = opts.height;
	const SUNDIR = opts.sunDir;

	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.physicallyCorrectLights = false;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = opts.exposure;
	const maxAniso = renderer.capabilities.getMaxAnisotropy();

	const loader = new THREE.TextureLoader();
	const load = (name, srgb) =>
		new Promise((res, rej) =>
			loader.load(`textures/${name}.jpg`, (t) => {
				t.wrapS = t.wrapT = THREE.RepeatWrapping;
				t.anisotropy = maxAniso;
				if (srgb) t.encoding = THREE.sRGBEncoding;
				res(t);
			}, undefined, () => rej(new Error('texture ' + name))),
		);
	const pbr = async (name) => {
		const [map, normalMap, roughnessMap] = await Promise.all([load(name + '_albedo', true), load(name + '_normal'), load(name + '_roughness')]);
		return {map, normalMap, roughnessMap};
	};
	const imgOf = (tex) => tex.image;

	// Photo texture multiplied by the layout of the original drawing (brick courses, frond lines),
	// so the construction stays exactly as designed but the surface becomes real.
	function composite(photo, pattern, alpha) {
		const c = document.createElement('canvas');
		c.width = c.height = 1024;
		const g = c.getContext('2d');
		g.drawImage(imgOf(photo), 0, 0, 1024, 1024);
		g.globalCompositeOperation = 'multiply';
		g.globalAlpha = alpha;
		g.drawImage(pattern.image, 0, 0, 1024, 1024);
		const t = new THREE.CanvasTexture(c);
		t.wrapS = t.wrapT = THREE.RepeatWrapping;
		t.anisotropy = maxAniso;
		t.encoding = THREE.sRGBEncoding;
		return t;
	}
	const rep = (set, x, y) => {
		for (const k of ['map', 'normalMap', 'roughnessMap']) if (set[k]) set[k].repeat.set(x, y === undefined ? x : y);
		return set;
	};

	const [sand, pebbles, path, clay, stone, mud, thatch, wood, bark, basalt, rock] = await Promise.all(
		['sand_01', 'brown_mud_dry', 'sand_01', 'clay_plaster', 'stone_wall', 'brown_mud', 'thatch_roof_angled', 'rough_wood', 'palm_bark', 'dark_rock', 'rock_boulder_dry'].map(pbr),
	);

	const brick = {...clay, map: composite(clay.map, TX.brickTex, 0.85)};
	const frondMud = {...mud, map: composite(mud.map, TX.frondMudTex, 0.45)};
	const plaster = rep({map: clay.map.clone(), normalMap: clay.normalMap.clone(), roughnessMap: clay.roughnessMap.clone()}, 3);
	for (const k of ['map', 'normalMap', 'roughnessMap']) plaster[k].needsUpdate = true;
	rep(sand, 560);
	rep(path, 2.7);
	rep(pebbles, 1.4);
	// courtyard floor of sand and pebbles: sand colour with the pebble relief
	const floorMap = sand.map.clone(); floorMap.repeat.set(1.4, 1.4); floorMap.needsUpdate = true;
	const courtyard = {map: floorMap, normalMap: pebbles.normalMap, roughnessMap: pebbles.roughnessMap};

	const lin = (c) => c && c.convertSRGBToLinear();
	const tint = (r, g, b) => new THREE.Color(r, g, b);

	// map identity of the original canvas texture -> real material set
	const byMap = new Map([
		[TX.sandTex, {set: sand, normalScale: 0.8, color: tint(1.04, 0.93, 0.8)}],
		[TX.gravelTex, {set: courtyard, normalScale: 1.1, color: tint(1.02, 0.85, 0.66)}],
		[TX.pathTex, {set: path, normalScale: 0.5, color: tint(1.1, 1.05, 0.98)}],
		[TX.brickTex, {set: brick, normalScale: 1.1, color: tint(1.3, 1.17, 1.02)}],
		[TX.stoneTex, {set: stone, normalScale: 1.4, color: tint(0.72, 0.64, 0.56)}],
		[TX.plasterTex, {set: plaster, normalScale: 1.0, color: tint(1.05, 0.95, 0.85)}],
		[TX.frondMudTex, {set: frondMud, normalScale: 1.0, color: tint(1.35, 1.15, 0.95)}],
		[TX.thatchTex, {set: thatch, normalScale: 1.3, color: tint(2.2, 1.85, 1.35)}],
		[TX.woodTex, {set: wood, normalScale: 1.0, color: tint(0.62, 0.42, 0.27)}],
		[TX.trunkTex, {set: bark, normalScale: 1.6, color: tint(1.5, 1.2, 0.95)}],
	]);

	const cache = new Map();
	function convert(old, mesh) {
		if (cache.has(old)) return cache.get(old);
		let m;
		if (old.isMeshBasicMaterial || old.isShaderMaterial || old.isSpriteMaterial) {
			if (old.color && !old.vertexColors) lin(old.color);
			if (old.isMeshBasicMaterial && old.transparent && old.opacity < 0.2) old.opacity *= 0.45; // ar-Rawda marker
			if (old.map) old.map.encoding = THREE.sRGBEncoding, (old.map.needsUpdate = true);
			m = old;
		} else {
			const hit = old.map && byMap.get(old.map);
			m = new THREE.MeshStandardMaterial({
				color: hit && hit.color ? hit.color : lin(old.color.clone()),
				vertexColors: old.vertexColors,
				side: old.side,
				transparent: old.transparent,
				opacity: old.opacity,
				alphaTest: old.alphaTest,
				depthWrite: old.depthWrite,
				polygonOffset: old.polygonOffset,
				polygonOffsetFactor: old.polygonOffsetFactor,
				polygonOffsetUnits: old.polygonOffsetUnits,
				flatShading: false,
				metalness: 0,
				roughness: 1,
			});
			if (hit) {
				m.map = hit.set.map;
				m.normalMap = hit.set.normalMap;
				m.roughnessMap = hit.set.roughnessMap;
				m.normalScale.set(hit.normalScale, hit.normalScale);
			} else if (old.map) {
				// fronds, curtains, fabric: keep the drawing, just treat it as sRGB
				old.map.encoding = THREE.sRGBEncoding;
				old.map.anisotropy = maxAniso;
				old.map.needsUpdate = true;
				m.map = old.map;
				m.roughness = 0.75;
			}
		}
		cache.set(old, m);
		return m;
	}

	const srgbToLinearArray = (arr) => {
		for (let i = 0; i < arr.length; i++) {
			const v = arr[i];
			arr[i] = v < 0.04045 ? v * 0.0773993808 : Math.pow(v * 0.9478672986 + 0.0521327014, 2.4);
		}
	};

	const meshes = [];
	scene.traverse((o) => o.isMesh && o !== sky && meshes.push(o));
	for (const o of meshes) {
		const old = o.material;
		o.material = convert(old, o);
		const g = o.geometry;
		if (old.vertexColors && g.attributes.color && !g.userData.lin) {
			srgbToLinearArray(g.attributes.color.array);
			g.attributes.color.needsUpdate = true;
			g.userData.lin = true;
		}
		if (o.instanceColor && !o.userData.lin) {
			srgbToLinearArray(o.instanceColor.array);
			o.instanceColor.needsUpdate = true;
			o.userData.lin = true;
		}
		// special cases recognised by their original look
		if (old.color && !old.map) {
			const hex = old.color.getHex();
			if (hex === 0x3e3631) { // harra basalt rocks
				o.material = new THREE.MeshStandardMaterial({...basalt, color: tint(1.3, 1.2, 1.15), roughness: 1, metalness: 0});
				o.material.normalScale.set(1.5, 1.5);
			} else if (hex === 0x2b4a52) { // water in the well
				o.material = new THREE.MeshStandardMaterial({color: lin(new THREE.Color(0x1d2f2c)), roughness: 0.04, metalness: 0});
			} else if (hex === 0x5c4329) { // trench
				o.material = new THREE.MeshStandardMaterial({...rep({...mud}, 60, 1), color: tint(0.9, 0.75, 0.6), roughness: 1, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2});
			} else if (hex === 0x4a3524) { // doors
				o.material = new THREE.MeshStandardMaterial({...wood, color: tint(0.55, 0.42, 0.32), roughness: 1, metalness: 0});
			}
		}
		if (old.isMeshPhongMaterial) { // mountains: real rock, smooth shading
			const r = {map: rock.map.clone(), normalMap: rock.normalMap.clone(), roughnessMap: rock.roughnessMap.clone()};
			for (const k in r) { r[k].repeat.set(24, 12); r[k].needsUpdate = true; }
			o.material = new THREE.MeshStandardMaterial({...r, color: lin(old.color.clone()).multiplyScalar(2.2), roughness: 1, metalness: 0});
			o.material.normalScale.set(2, 2);
		}
		if (o.material.isMeshStandardMaterial) { o.castShadow = o.castShadow || false; }
	}

	// skylight is strong in a desert; keep shade warm rather than blue
	for (const m of new Set(meshes.map((o) => o.material))) if (m.isMeshStandardMaterial) m.envMapIntensity = 0.32;

	// palm crowns: dusty grey-green of date palms
	scene.traverse((o) => {
		if (o.isInstancedMesh && o.material.map === TX.frondTex) {
			o.material.color = new THREE.Color(1, 1, 1);
			o.material.roughness = 0.65;
			o.material.side = THREE.DoubleSide;
			o.castShadow = true;
		}
	});

	// ---- sky & image-based light ----
	sky.visible = false;
	const atmo = new THREE.Sky();
	atmo.scale.setScalar(4000);
	const u = atmo.material.uniforms;
	u.turbidity.value = opts.turbidity;
	u.rayleigh.value = opts.rayleigh;
	u.mieCoefficient.value = 0.006;
	u.mieDirectionalG.value = 0.86;
	u.sunPosition.value.copy(SUNDIR).multiplyScalar(1000);
	atmo.renderOrder = -1;
	scene.add(atmo);

	const envScene = new THREE.Scene();
	const atmo2 = new THREE.Sky();
	atmo2.scale.setScalar(1000);
	Object.assign(atmo2.material.uniforms.turbidity, {value: opts.turbidity});
	atmo2.material.uniforms.rayleigh.value = opts.rayleigh;
	atmo2.material.uniforms.mieCoefficient.value = 0.006;
	atmo2.material.uniforms.mieDirectionalG.value = 0.86;
	atmo2.material.uniforms.sunPosition.value.copy(SUNDIR).multiplyScalar(1000);
	envScene.add(atmo2);
	// warm sand bounce from below
	const ground = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16, 0, Math.PI * 2, Math.PI / 2 - 0.05, Math.PI / 2 + 0.05), new THREE.MeshBasicMaterial({color: lin(new THREE.Color(0xc9a46e)), side: THREE.BackSide}));
	envScene.add(ground);
	const pmrem = new THREE.PMREMGenerator(renderer);
	scene.environment = pmrem.fromScene(envScene, 0.02).texture;

	scene.children.forEach((o) => {
		if (o.isHemisphereLight) {
			o.intensity = opts.hemi;
			o.color.set(0xe9dcc6); lin(o.color);
			o.groundColor.set(0xb98d58); lin(o.groundColor);
		}
	});
	sun.color.set(0xffdcae); lin(sun.color);
	sun.intensity = opts.sunIntensity;

	scene.fog.color.set(opts.fogColor); lin(scene.fog.color);
	scene.fog.near = opts.fogNear;
	scene.fog.far = opts.fogFar;

	// ---- post-processing: SSAO + soft bloom + sRGB out ----
	const composer = new THREE.EffectComposer(renderer);
	composer.setPixelRatio(1);
	composer.setSize(W, H);
	const ssao = new THREE.SSAOPass(scene, camera, W, H);
	ssao.kernelRadius = 0.9;
	ssao.minDistance = 0.0006;
	ssao.maxDistance = 0.06;
	composer.addPass(ssao);
	const bloom = new THREE.UnrealBloomPass(new THREE.Vector2(W, H), 0.18, 0.6, 0.92);
	composer.addPass(bloom);
	composer.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));

	window.__render = () => composer.render();
	return {materials: cache.size};
};
