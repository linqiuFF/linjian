# 被你改变的那部分我 · 像素 MV(HyperFrames 版)

- `compositions/pixel.html`:像素画面场景,画面引擎在 `assets/pixel-engine.js`(和 `../pixel4.html` 同一套)
- `compositions/lyrics.html`:歌词,用 registry 的 line-swap 做法——上一句从遮罩里往上退,下一句从下面顶上来,关键词画一条暖色下划线
- `compositions/organic-light-leak-overlay.html`:registry 的暖色漏光,叠在回忆那一段
- `assets/song2.mp3`:从 64.3 秒开始放(index.html 里 `data-media-start`)

```bash
npm run dev      # 预览(或用 HyperFrames 桌面版打开这个文件夹)
npm run check    # 检查
npm run render   # 导出 MP4
```
