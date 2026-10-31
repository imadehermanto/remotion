import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Helper to parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    text: "",
    file: "",
    voice: "id-ID-GadisNeural", // default female Indonesian
    output: "voice",
    rate: undefined,
    pitch: undefined,
    fps: 30,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--text" || arg === "-t") {
      options.text = args[++i];
    } else if (arg === "--file" || arg === "-f") {
      options.file = args[++i];
    } else if (arg === "--voice" || arg === "-v") {
      const v = args[++i];
      if (v.toLowerCase() === "gadis" || v.toLowerCase() === "female") {
        options.voice = "id-ID-GadisNeural";
      } else if (v.toLowerCase() === "ardi" || v.toLowerCase() === "male") {
        options.voice = "id-ID-ArdiNeural";
      } else {
        options.voice = v;
      }
    } else if (arg === "--name" || arg === "-o" || arg === "--output") {
      options.output = args[++i];
    } else if (arg === "--rate" || arg === "-r") {
      options.rate = args[++i];
    } else if (arg === "--pitch" || arg === "-p") {
      options.pitch = args[++i];
    } else if (arg === "--fps") {
      options.fps = parseInt(args[++i], 10) || 30;
    }
  }

  return options;
}

// Convert ms to SRT timestamp 00:00:00,000
function msToSrtTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(millis).padStart(3, "0")}`;
}

async function main() {
  const options = parseArgs();

  let textToSpeak = options.text;
  if (!textToSpeak && options.file) {
    const raw = fs.readFileSync(path.resolve(options.file), "utf-8");
    try {
      const parsed = JSON.parse(raw);
      textToSpeak = parsed.fullNarrationText || parsed.text || raw;
    } catch {
      textToSpeak = raw;
    }
  }

  if (!textToSpeak) {
    textToSpeak =
      "Halo teman-teman! Selamat datang di Remotion. Suara ini dihasilkan menggunakan Edge TTS bahasa Indonesia berkualitas tinggi.";
    console.log("ℹ️  Tidak ada teks yang diberikan, menggunakan teks default demonstrasi.");
  }

  const voiceName = options.voice;
  const baseName = options.output.replace(/\.[^/.]+$/, "");
  const mp3Path = path.join(publicDir, `${baseName}.mp3`);
  const jsonPath = path.join(publicDir, `${baseName}.json`);
  const srtPath = path.join(publicDir, `${baseName}.srt`);

  console.log(`🎙️  Men-generate voice over...`);
  console.log(`   Suara  : ${voiceName}`);
  console.log(`   Teks   : "${textToSpeak}"`);
  console.log(`   Output : public/${baseName}.mp3`);

  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3, {
    wordBoundaryEnabled: true,
    sentenceBoundaryEnabled: true,
  });

  const prosody = {};
  if (options.rate) prosody.rate = options.rate;
  if (options.pitch) prosody.pitch = options.pitch;

  const { audioStream, metadataStream } = tts.toStream(textToSpeak, prosody);

  const writeAudio = fs.createWriteStream(mp3Path);
  audioStream.pipe(writeAudio);

  const sentences = [];
  const words = [];

  metadataStream.on("data", (chunk) => {
    try {
      const parsed = JSON.parse(chunk.toString());
      if (Array.isArray(parsed.Metadata)) {
        for (const item of parsed.Metadata) {
          const type = item.Type;
          const data = item.Data;
          if (!data) continue;

          // Microsoft Offset and Duration are in 100-nanosecond ticks (10,000 ticks = 1 ms)
          const startMs = Math.round(data.Offset / 10000);
          const durationMs = Math.round(data.Duration / 10000);
          const endMs = startMs + durationMs;
          const startFrame = Math.round((startMs / 1000) * options.fps);
          const endFrame = Math.round((endMs / 1000) * options.fps);

          if (type === "SentenceBoundary") {
            sentences.push({
              text: data.text?.Text || "",
              startMs,
              endMs,
              durationMs,
              startFrame,
              endFrame,
            });
          } else if (type === "WordBoundary") {
            words.push({
              word: data.text?.Text || "",
              startMs,
              endMs,
              durationMs,
              startFrame,
              endFrame,
            });
          }
        }
      }
    } catch {
      // ignore json chunk split issues if any
    }
  });

  await Promise.all([
    new Promise((resolve, reject) => {
      audioStream.once("error", (e) => {
        writeAudio.destroy();
        reject(e);
      });
      writeAudio.once("close", () => {
        if (writeAudio.bytesWritten > 0) {
          resolve();
        } else {
          reject(new Error("No audio data written"));
        }
      });
      writeAudio.once("error", reject);
    }),
    new Promise((resolve, reject) => {
      metadataStream.once("close", resolve);
      metadataStream.once("error", reject);
    }),
  ]);

  // Calculate total audio duration from words / sentences
  const lastItem = words[words.length - 1] || sentences[sentences.length - 1];
  const totalDurationMs = lastItem ? lastItem.endMs : 0;
  const totalDurationFrames = Math.round((totalDurationMs / 1000) * options.fps);

  // Write JSON metadata
  const metadataResult = {
    voice: voiceName,
    text: textToSpeak,
    fps: options.fps,
    totalDurationMs,
    totalDurationFrames,
    sentences,
    words,
  };

  fs.writeFileSync(jsonPath, JSON.stringify(metadataResult, null, 2), "utf-8");

  // Write SRT file (based on sentences, or words if no sentences)
  const srtItems = sentences.length > 0 ? sentences : words;
  let srtContent = "";
  srtItems.forEach((item, index) => {
    const text = item.text || item.word;
    srtContent += `${index + 1}\n`;
    srtContent += `${msToSrtTime(item.startMs)} --> ${msToSrtTime(item.endMs)}\n`;
    srtContent += `${text}\n\n`;
  });

  fs.writeFileSync(srtPath, srtContent, "utf-8");

  console.log(`✅ Selesai! File yang dihasilkan:`);
  console.log(`   - Audio    : public/${baseName}.mp3`);
  console.log(`   - Metadata : public/${baseName}.json (Total: ${totalDurationFrames} frames @ ${options.fps}fps)`);
  console.log(`   - Subtitle : public/${baseName}.srt`);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Terjadi kesalahan:", err);
  process.exit(1);
});

