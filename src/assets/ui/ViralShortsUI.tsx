import { loadFont } from "@remotion/google-fonts/Montserrat";
import React, { useMemo } from "react";
import {
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BRAND_THEME, SFX } from "../catalog";

const { fontFamily } = loadFont("normal", {
  weights: ["800", "900"],
  subsets: ["latin"],
});

export interface WordTiming {
  word?: string;
  text?: string;
  startFrame: number;
  endFrame: number;
}

export interface TopHeadlineSpec {
  from: number;
  to: number;
  line1: string;
  line2: string;
  line2Color: string;
}

export interface FloatingBadgeSpec {
  id: string;
  from: number;
  to: number;
  text: string;
  icon: string;
  x: number;
  y: number;
  bgColor: string;
  textColor: string;
  borderColor: string;
  tilt: number;
}

export interface RedCircleSpec {
  id: string;
  from: number;
  to: number;
  x: number;
  y: number;
  size: number;
}

/**
 * 1. Top Viral Headline Banner (Wait, Really!? Style)
 */
export const ViralHeadlineBanner: React.FC<{
  headlines: TopHeadlineSpec[];
}> = ({ headlines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeHeadline = headlines.find(
    (h) => frame >= h.from && frame < h.to
  );
  if (!activeHeadline) return null;

  const pop = spring({
    frame: frame - activeHeadline.from,
    fps,
    config: { damping: 14, stiffness: 200 },
  });
  const fadeOut = interpolate(
    frame,
    [activeHeadline.to - 10, activeHeadline.to],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 95,
        left: 44,
        right: 44,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transform: `scale(${interpolate(pop, [0, 1], [0.85, 1])})`,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          fontSize: 54,
          fontWeight: 900,
          color: "#ffffff",
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          WebkitTextStroke: `12px ${BRAND_THEME.colors.darkOutline}`,
          paintOrder: "stroke fill",
          textShadow: "0 10px 24px rgba(0,0,0,0.85)",
        }}
      >
        {activeHeadline.line1}
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: activeHeadline.line2Color,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          marginTop: 4,
          WebkitTextStroke: `14px ${BRAND_THEME.colors.darkOutline}`,
          paintOrder: "stroke fill",
          textShadow: "0 12px 28px rgba(0,0,0,0.9)",
        }}
      >
        {activeHeadline.line2}
      </div>
    </div>
  );
};

/**
 * 2. Floating Action Status Pills
 */
export const FloatingBadgePills: React.FC<{
  badges: FloatingBadgeSpec[];
}> = ({ badges }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {badges.map((b) => {
        if (frame < b.from || frame > b.to) return null;

        const enter = spring({
          frame: frame - b.from,
          fps,
          config: { damping: 12, stiffness: 210 },
        });
        const exit = interpolate(frame, [b.to - 10, b.to], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const scale = interpolate(enter, [0, 1], [0.4, 1]) * exit;
        const floatY = Math.sin((frame - b.from) * 0.1) * 4;

        return (
          <div
            key={b.id}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y + floatY,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${b.tilt}deg)`,
              backgroundColor: b.bgColor,
              color: b.textColor,
              border: `6px solid ${b.borderColor}`,
              borderRadius: 999,
              padding: "14px 32px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              boxShadow:
                "0 12px 0px rgba(9, 13, 22, 0.95), 0 20px 35px rgba(0,0,0,0.55)",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: 36,
                WebkitTextStroke: "4px #090d16",
                paintOrder: "stroke fill",
              }}
            >
              {b.icon}
            </span>
            <span
              style={{
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: "-0.01em",
              }}
            >
              {b.text}
            </span>
          </div>
        );
      })}
    </>
  );
};

/**
 * 3. Animated Red Focus Rings
 */
export const RedFocusRings: React.FC<{
  circles: RedCircleSpec[];
}> = ({ circles }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {circles.map((c) => {
        if (frame < c.from || frame > c.to) return null;

        const enter = spring({
          frame: frame - c.from,
          fps,
          config: { damping: 12, stiffness: 180 },
        });
        const exit = interpolate(frame, [c.to - 10, c.to], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const pulse = 1 + Math.sin((frame - c.from) * 0.18) * 0.04;

        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              width: c.size,
              height: c.size,
              transform: `translate(-50%, -50%) scale(${enter * pulse})`,
              opacity: exit,
              borderRadius: "50%",
              border: "8px dashed #ff2a2a",
              boxShadow:
                "0 0 0 5px #090d16, inset 0 0 28px rgba(255, 42, 42, 0.35), 0 14px 30px rgba(0,0,0,0.6)",
            }}
          />
        );
      })}
    </>
  );
};

/**
 * 4. Word-by-Word Pop Subtitles
 */
export const ViralWordSubtitles: React.FC<{
  words: WordTiming[];
  wordsPerPhrase?: number;
  getWordColor?: (word: string) => string;
}> = ({ words, wordsPerPhrase = 4, getWordColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phrases = useMemo(() => {
    const chunks: {
      words: WordTiming[];
      startFrame: number;
      endFrame: number;
    }[] = [];

    for (let i = 0; i < words.length; i += wordsPerPhrase) {
      const slice = words.slice(i, i + wordsPerPhrase);
      if (slice.length > 0) {
        chunks.push({
          words: slice,
          startFrame: slice[0].startFrame,
          endFrame: slice[slice.length - 1].endFrame + 8,
        });
      }
    }
    return chunks;
  }, [words, wordsPerPhrase]);

  const activePhrase = useMemo(() => {
    for (let i = 0; i < phrases.length; i++) {
      const p = phrases[i];
      const nextStart =
        i < phrases.length - 1 ? phrases[i + 1].startFrame : p.endFrame;
      if (frame >= p.startFrame && frame < nextStart) {
        return p;
      }
    }
    return null;
  }, [phrases, frame]);

  if (!activePhrase) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 155,
        left: 48,
        right: 48,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px 26px",
          maxWidth: 960,
        }}
      >
        {activePhrase.words.map((w, idx) => {
          const isActive =
            frame >= w.startFrame && frame <= w.endFrame + 4;
          const isPast = frame > w.endFrame + 4;

          const wordPop = spring({
            frame: Math.max(0, frame - w.startFrame),
            fps,
            config: { damping: 12, stiffness: 260 },
          });

          const scale = isActive
            ? interpolate(wordPop, [0, 1], [0.92, 1.09])
            : 1.0;

          const label = w.word ?? w.text ?? "";
          const color = isActive
            ? getWordColor
              ? getWordColor(label)
              : BRAND_THEME.colors.yellowPop
            : isPast
              ? "#ffffff"
              : "#cbd5e1";

          return (
            <span
              key={`${w.startFrame}-${idx}`}
              style={{
                display: "inline-block",
                margin: "0 4px",
                fontSize: 56,
                fontWeight: 900,
                textTransform: "uppercase",
                color,
                transform: `scale(${scale})`,
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
                WebkitTextStroke: `13px ${BRAND_THEME.colors.darkOutline}`,
                paintOrder: "stroke fill",
                textShadow: isActive
                  ? "0 10px 24px rgba(0,0,0,0.9)"
                  : "0 6px 14px rgba(0,0,0,0.8)",
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 5. Wrapper Font Channel + SFX Helper
 */
export const ViralShortsOverlayContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export const SceneSFXLayer: React.FC<{
  cutFrames: number[];
  dingFrames: number[];
}> = ({ cutFrames, dingFrames }) => {
  return (
    <>
      {cutFrames.map((f) => (
        <Sequence key={`whoosh-${f}`} from={f} durationInFrames={45} layout="none">
          <Audio src={staticFile(SFX.whoosh)} volume={0.28} />
        </Sequence>
      ))}
      {dingFrames.map((f) => (
        <Sequence key={`ding-${f}`} from={f} durationInFrames={45} layout="none">
          <Audio src={staticFile(SFX.ding)} volume={0.25} />
        </Sequence>
      ))}
    </>
  );
};

/**
 * 6. Kartu Pemicu Komentar & Debat Penonton (Muncul di 4 Detik Terakhir Video)
 */
export const CommentTriggerCard: React.FC<{
  from: number;
  to: number;
  question: string;
  optionA: string;
  optionB: string;
}> = ({ from, to, question, optionA, optionB }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < from || frame > to) return null;

  const pop = spring({
    frame: frame - from,
    fps,
    config: { damping: 13, stiffness: 190 },
  });

  const pulse = 1 + Math.sin((frame - from) * 0.2) * 0.025;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 360,
        left: 54,
        right: 54,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${interpolate(pop, [0, 1], [0.5, 1]) * pulse})`,
      }}
    >
      <div
        style={{
          backgroundColor: "#0f172a",
          border: "6px solid #facc15",
          borderRadius: 28,
          padding: "18px 28px",
          boxShadow: "0 14px 0 #090d16, 0 22px 40px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#facc15",
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}
        >
          💬 TULIS DI KOMENTAR: {question}
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              backgroundColor: "#ef4444",
              color: "#ffffff",
              border: "4px solid #090d16",
              borderRadius: 16,
              padding: "10px 16px",
              fontSize: 25,
              fontWeight: 900,
              textAlign: "center",
            }}
          >
            {optionA}
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: "#38bdf8",
              color: "#082f49",
              border: "4px solid #090d16",
              borderRadius: 16,
              padding: "10px 16px",
              fontSize: 25,
              fontWeight: 900,
              textAlign: "center",
            }}
          >
            {optionB}
          </div>
        </div>
      </div>
    </div>
  );
};


