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
