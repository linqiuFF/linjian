import { useLayoutEffect, useRef } from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BEATS, LYRICS } from "./pixel/data";
import { createEngine, END, START } from "./pixel/engine";

const FPS = 30;

// 像素字体要先加载好,画出来的字幕才对
const fontHandle = delayRender("加载字体");
new FontFace("LJBold", `url(${staticFile("fonts/bold2.woff2")})`, { weight: "700" })
  .load()
  .then((f) => {
    document.fonts.add(f);
    continueRender(fontHandle);
  });

export const PixelMV: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<ReturnType<typeof createEngine> | null>(null);

  // 每一帧在截图前同步画好:画面完全由时间决定
  useLayoutEffect(() => {
    if (!canvas.current) return;
    engine.current ??= createEngine(canvas.current, { LYRICS, BEATS });
    engine.current.renderAt(START + frame / FPS);
  }, [frame]);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <canvas ref={canvas} width={1920} height={1080} style={{ width: "100%", height: "100%" }} />
      {/* 从 1:04.3 开始放歌,开头 0.4 秒淡入,最后 0.6 秒淡出 */}
      <Audio
        src={staticFile("song2.mp3")}
        trimBefore={Math.round(START * FPS)}
        volume={(f) =>
          interpolate(f, [0, 12, durationInFrames - 18, durationInFrames], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <Composition
      id="PixelMV"
      component={PixelMV}
      durationInFrames={Math.round((END - START) * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
