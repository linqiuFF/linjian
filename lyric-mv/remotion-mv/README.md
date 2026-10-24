# 被你改变的那部分我 · 像素 MV(Remotion 版)

1:04–1:35 这一段的像素动画,做成了 Remotion 项目。画面引擎在 `src/pixel/engine.js`(和 `../pixel4.html` 同一套),
歌词时间轴在 `src/pixel/data.js`,组件和音频在 `src/Composition.tsx`。

## 在电脑上打开

```bash
npm i
npm run dev            # 打开 Remotion Studio,能拖时间轴预览
npx remotion render PixelMV out/pixel-mv.mp4   # 导出视频
```

## 常改的地方

- 歌词文字或时间:`src/pixel/data.js` 里的 `LYRICS`
- 截取的歌曲片段:`src/pixel/engine.js` 顶部的 `START` / `END`(秒)
- 音量淡入淡出:`src/Composition.tsx` 里 `<Audio>` 的 `volume`
