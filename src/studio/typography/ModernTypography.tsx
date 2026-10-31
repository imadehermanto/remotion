import { loadFont } from "@remotion/google-fonts/Montserrat";
import React, { useMemo } from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LAYOUT, SAFE_ZONE } from "../../assets/production/safeZone";
import { AudioAlignmentWordSchema } from "../schemas/qa";
import { z } from "zod";

type AudioWord = z.infer<typeof AudioAlignmentWordSchema>;

const { fontFamily } = loadFont("normal", {
  weights: ["600", "700", "800", "900"],
  subsets: ["latin"],
});

export interface HeadlineSpec {
  fromFrame: number;
  toFrame: number;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

/**
 * Modern, safe-zone compliant headline.
 * Placed precisely within LAYOUT.headlineTop, ensuring zero overlap with 3D models.
 */
export const StudioHeadline: React.FC<{
  headlines: HeadlineSpec[];
}> = ({ headlines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const active = headlines.find(
    (h) => frame >= h.fromFrame && frame < h.toFrame
  );
  if (!active) return null;

  const pop = spring({
    frame: frame - active.fromFrame,
    fps,
    config: { damping: 14, stiffness: 220 },
  });

  const fadeOut = interpolate(
    frame,
    [active.toFrame - 8, active.toFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: LAYOUT.headlineTop,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        fontFamily,
        transform: `scale(${interpolate(pop, [0, 1], [0.92, 1])})`,
        opacity: fadeOut,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          textShadow: "0 4px 16px rgba(0,0,0,0.85)",
        }}
      >
        {active.title}
      </div>
      {active.subtitle && (
        <div
          style={{
            marginTop: 6,
            fontSize: 28,
            fontWeight: 700,
            color: active.accentColor || "#38bdf8",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          {active.subtitle}
        </div>
      )}
    </div>
  );
};

export interface TechnicalCalloutSpec {
  id: string;
  fromFrame: number;
  toFrame: number;
  label: string;
  sublabel?: string;
  x: number; // canvas px
  y: number; // canvas px
  accentColor?: string;
}

export const StudioTechnicalCallout: React.FC<{
  callouts: TechnicalCalloutSpec[];
}> = ({ callouts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {callouts.map((c) => {
        if (frame < c.fromFrame || frame >= c.toFrame) return null;

        const enter = spring({
          frame: frame - c.fromFrame,
          fps,
          config: { damping: 13, stiffness: 200 },
        });

        const exit = interpolate(frame, [c.toFrame - 6, c.toFrame], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const color = c.accentColor || "#38bdf8";

        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              transform: `scale(${enter}) translate(-50%, -50%)`,
              opacity: exit,
              fontFamily,
              pointerEvents: "none",
              zIndex: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(15, 23, 42, 0.92)",
                border: `2px solid ${color}`,
                borderRadius: 14,
                padding: "8px 16px",
                boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 15px ${color}44`,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}`,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#f8fafc",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {c.label}
                </span>
                {c.sublabel && (
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#94a3b8",
                    }}
                  >
                    {c.sublabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export const StudioKineticSubtitles: React.FC<{
  words: AudioWord[];
  wordsPerPhrase?: number;
  styleMode?: "MinimalModern" | "HighContrastPill" | "KineticPop";
  accentColor?: string;
}> = ({
  words,
  wordsPerPhrase = 4,
  styleMode = "MinimalModern",
  accentColor = "#38bdf8",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phrases = useMemo(() => {
    const list: {
      words: AudioWord[];
      startFrame: number;
      endFrame: number;
    }[] = [];

    for (let i = 0; i < words.length; i += wordsPerPhrase) {
      const slice = words.slice(i, i + wordsPerPhrase);
      if (slice.length > 0) {
        list.push({
          words: slice,
          startFrame: slice[0].startFrame,
          endFrame: slice[slice.length - 1].endFrame + 6,
        });
      }
    }
    return list;
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
        bottom: LAYOUT.subtitleBottom + 20,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        pointerEvents: "none",
        zIndex: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px 14px",
          maxWidth: 960,
          background:
            styleMode === "HighContrastPill"
              ? "rgba(15, 23, 42, 0.88)"
              : "rgba(0, 0, 0, 0.45)",
          padding: "12px 24px",
          borderRadius: 20,
          backdropFilter: "blur(8px)",
          border:
            styleMode === "HighContrastPill"
              ? `1px solid ${accentColor}44`
              : "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        {activePhrase.words.map((w, idx) => {
          const isActive = frame >= w.startFrame && frame <= w.endFrame + 3;
          const isPast = frame > w.endFrame + 3;

          const wordPop = spring({
            frame: Math.max(0, frame - w.startFrame),
            fps,
            config: { damping: 13, stiffness: 240 },
          });

          const scale = isActive
            ? interpolate(wordPop, [0, 1], [0.94, 1.08])
            : 1.0;

          const color = isActive
            ? accentColor
            : isPast
              ? "#ffffff"
              : "#94a3b8";

          return (
            <span
              key={`${w.startFrame}-${idx}`}
              style={{
                display: "inline-block",
                fontSize: 42,
                fontWeight: 800,
                color,
                transform: `scale(${scale})`,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                textShadow: isActive
                  ? `0 0 16px ${accentColor}88, 0 4px 12px rgba(0,0,0,0.9)`
                  : "0 2px 8px rgba(0,0,0,0.8)",
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
