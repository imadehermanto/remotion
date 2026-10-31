import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import voiceData from "../public/voice.json";

export const VoiceOverDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active sentence based on current frame
  const currentSentence = voiceData.sentences.find(
    (s) => frame >= s.startFrame && frame <= s.endFrame,
  );

  // Find active word based on current frame
  const activeWordIndex = voiceData.words.findIndex(
    (w) => frame >= w.startFrame && frame <= w.endFrame,
  );

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12,
    },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
        color: "#ffffff",
        padding: 60,
      }}
    >
      {/* Audio Voice Over */}
      <Audio src={staticFile("voice.mp3")} />

      {/* Main Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          opacity,
          transform: `scale(${scale})`,
          maxWidth: 1200,
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "8px 20px",
            borderRadius: 9999,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          🎙️ Edge-TTS Bahasa Indonesia
        </div>

        {/* Current Active Sentence */}
        <div
          style={{
            fontSize: 54,
            fontWeight: 800,
            lineHeight: 1.3,
            color: "#f8fafc",
            minHeight: 150,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {currentSentence ? currentSentence.text : voiceData.text}
        </div>

        {/* Word Highlight Pill Indicator */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
            marginTop: 20,
          }}
        >
          {voiceData.words.map((item, idx) => {
            const isActive = idx === activeWordIndex;
            return (
              <span
                key={idx}
                style={{
                  fontSize: 28,
                  padding: "6px 14px",
                  borderRadius: 8,
                  backgroundColor: isActive ? "#38bdf8" : "#1e293b",
                  color: isActive ? "#0f172a" : "#94a3b8",
                  fontWeight: isActive ? 700 : 500,
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                }}
              >
                {item.word}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
