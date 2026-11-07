# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Видео «Медина Пророка ﷺ»

Вертикальный ролик 1080×1920, ~55 с (композиция `Medina`, код в `src/medina/`).
Кадры сняты прямо из 3D-реконструкции `../medina.html`; тексты и цитаты — из её карточек.

Как пересобрать кадры:

```console
node capture/build-scene.mjs   # medina.html → capture/scene.html (без интерфейса)
node capture/capture.mjs       # рендер планов → public/shots/*.mp4 (можно указать id планов)
capture/grade.sh               # цветокоррекция + VP9 → public/shots/*.webm
npx remotion render Medina out/medina.mp4
```

Камера каждого плана задаётся в `capture/shots.mjs`, тексты — в `src/medina/data.ts`.

### Слой реализма

`medina.html` не меняется. `capture/realism.js` подключается только в съёмочную копию сцены и:
- заменяет нарисованные кодом текстуры на фото-текстуры Poly Haven (CC0): песок, галька, глина,
  камень, кора пальмы, соломенная кровля, дерево, базальт, скалы — с картами рельефа и шероховатости
  (`capture/textures/`, источник и лицензия — в `CREDITS.md`);
- переводит все материалы на физически корректные (PBR) в линейном цветовом пространстве;
- рисует небо по модели атмосферного рассеяния и освещает им сцену (IBL);
- добавляет SSAO (затенение в углах и под навесами), лёгкое свечение и суперсэмплинг (`SS=1.34`).

`REALISM=0 node capture/capture.mjs` снимает сцену в исходном виде, как её рисует `medina.html`.

## Видео «Сурака ибн Малик и путь в Медину»

Вертикальный ролик 1080×1920, 2:07 (композиция `Suraqa`, код в `src/suraqa/`) — моушн-графика под озвучку ElevenLabs
(`public/suraqa/voice.mp3`).

- Сюжет — хадис из «Сахиха» аль-Бухари (глава о переселении Пророка ﷺ и его сподвижников в Медину);
  арабские цитаты в кадре сверены по «Джами‘ аль-усуль» Ибн аль-Асира, т. 11, с. 583–588.
- Субтитры — `src/suraqa/captions.ts`: озвучка распознана faster-whisper (small) и вычитана вручную.
- Шрифты — Playfair Display, Manrope (Fontsource, SIL OFL) и Amiri, лежат в `public/fonts`.
- Звуки удара, перехода и нарастания (`public/suraqa/*.m4a`) синтезированы ffmpeg; ветер — `public/audio/wind.m4a`.

```console
npx remotion render Suraqa out/suraqa.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
```

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
