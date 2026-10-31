#!/usr/bin/env node
/**
 * REMOTION AI REELS STUDIO V2 - PRODUCTION PIPELINE STATE MACHINE
 *
 * Full-lifecycle orchestrator:
 * INIT -> RESEARCH -> BRIEF -> SCRIPT -> VOICE -> STORYBOARD -> SCENE -> KEYFRAMES -> QA -> RENDER
 *
 * Supports checkpoints, resume, and step-by-step stage execution.
 * Completely secure: uses execFileSync with argument arrays, strict regex validation.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const env = {
  ...process.env,
  PATH: `/opt/homebrew/bin:${process.env.PATH || ""}`,
};

const STAGES = [
  "init",
  "research",
  "brief",
  "script",
  "voice",
  "storyboard",
  "scene",
  "keyframes",
  "qa",
  "render",
];

function sanitizeId(id) {
  if (!id || typeof id !== "string" || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new Error(`Invalid identifier: "${id}". Must be alphanumeric with - or _.`);
  }
  return id;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    command: "run",
    project: "",
    composition: "",
    stage: "all",
    resume: false,
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "status" || a === "run" || a === "init" || a === "resume" || a === "help") {
      options.command = a;
    } else if (a === "--project" || a === "-p") {
      options.project = sanitizeId(args[++i]);
    } else if (a === "--composition" || a === "-c") {
      options.composition = sanitizeId(args[++i]);
    } else if (a === "--stage" || a === "-s") {
      options.stage = args[++i];
    } else if (a === "--resume" || a === "-r") {
      options.resume = true;
    }
  }

  if (options.command === "resume") {
    options.resume = true;
    options.command = "run";
  }

  return options;
}

function getProjectPaths(projectId) {
  const projectDir = path.join(rootDir, "projects", projectId);
  return {
    dir: projectDir,
    projectJson: path.join(projectDir, "project.json"),
    researchJson: path.join(projectDir, "research.json"),
    briefJson: path.join(projectDir, "creative-brief.json"),
    scriptJson: path.join(projectDir, "script.json"),
    storyboardJson: path.join(projectDir, "storyboard.json"),
  };
}

function loadOrCreateProjectSpec(projectId, title) {
  const paths = getProjectPaths(projectId);
  fs.mkdirSync(paths.dir, { recursive: true });

  if (fs.existsSync(paths.projectJson)) {
    try {
      return JSON.parse(fs.readFileSync(paths.projectJson, "utf-8"));
    } catch {
      // re-init if malformed
    }
  }

  const initialSpec = {
    id: projectId,
    title: title || projectId,
    topic: title || projectId,
    targetDurationSeconds: 52,
    fps: 30,
    width: 1080,
    height: 1920,
    language: "id-ID",
    narrativeStructure: "StepByStepMechanism",
    visualStyle: "CinematicTechnicalExplainer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: "init",
    stages: STAGES.reduce((acc, st) => {
      acc[st] = { status: "pending" };
      return acc;
    }, {}),
  };

  fs.writeFileSync(paths.projectJson, JSON.stringify(initialSpec, null, 2), "utf-8");
  return initialSpec;
}

function updateStageStatus(projectId, stage, status, details = {}) {
  const paths = getProjectPaths(projectId);
  const spec = loadOrCreateProjectSpec(projectId);

  if (!spec.stages[stage]) {
    spec.stages[stage] = {};
  }

  spec.stages[stage].status = status;
  spec.stages[stage].updatedAt = new Date().toISOString();
  Object.assign(spec.stages[stage], details);

  spec.currentStage = stage;
  spec.updatedAt = new Date().toISOString();

  fs.writeFileSync(paths.projectJson, JSON.stringify(spec, null, 2), "utf-8");
  return spec;
}

// Stage Handlers
const stageHandlers = {
  init: async (projectId) => {
    console.log(`\n▶️ [Stage: init] Initializing production workspace for "${projectId}"...`);
    const paths = getProjectPaths(projectId);
    fs.mkdirSync(paths.dir, { recursive: true });
    updateStageStatus(projectId, "init", "completed", { dir: path.relative(rootDir, paths.dir) });
    console.log(`   ✅ Workspace verified: ${path.relative(rootDir, paths.dir)}`);
  },

  research: async (projectId) => {
    console.log(`\n▶️ [Stage: research] Validating research spec...`);
    const paths = getProjectPaths(projectId);
    if (!fs.existsSync(paths.researchJson)) {
      throw new Error(`Missing ${path.relative(rootDir, paths.researchJson)}. Please create research spec.`);
    }
    const data = JSON.parse(fs.readFileSync(paths.researchJson, "utf-8"));
    if (!data.scientificPrinciples || !Array.isArray(data.scientificPrinciples) || data.scientificPrinciples.length === 0) {
      throw new Error("Research spec must contain at least one verified scientific principle.");
    }
    updateStageStatus(projectId, "research", "completed", {
      principlesCount: data.scientificPrinciples.length,
      artifactPath: path.relative(rootDir, paths.researchJson),
    });
    console.log(`   ✅ Research verified: ${data.scientificPrinciples.length} scientific principles documented.`);
  },

  brief: async (projectId) => {
    console.log(`\n▶️ [Stage: brief] Validating creative brief...`);
    const paths = getProjectPaths(projectId);
    if (!fs.existsSync(paths.briefJson)) {
      throw new Error(`Missing ${path.relative(rootDir, paths.briefJson)}`);
    }
    const data = JSON.parse(fs.readFileSync(paths.briefJson, "utf-8"));
    updateStageStatus(projectId, "brief", "completed", {
      visualStyle: data.visualStyle,
      narrativeStructure: data.narrativeStructure,
      artifactPath: path.relative(rootDir, paths.briefJson),
    });
    console.log(`   ✅ Creative brief verified: ${data.visualStyle} (${data.narrativeStructure})`);
  },

  script: async (projectId) => {
    console.log(`\n▶️ [Stage: script] Validating narration script...`);
    const paths = getProjectPaths(projectId);
    if (!fs.existsSync(paths.scriptJson)) {
      throw new Error(`Missing ${path.relative(rootDir, paths.scriptJson)}`);
    }
    const data = JSON.parse(fs.readFileSync(paths.scriptJson, "utf-8"));
    if (!data.fullNarrationText || data.fullNarrationText.trim().length < 50) {
      throw new Error("Script fullNarrationText is missing or too short.");
    }
    updateStageStatus(projectId, "script", "completed", {
      wordsCount: data.fullNarrationText.split(/\s+/).length,
      artifactPath: path.relative(rootDir, paths.scriptJson),
    });
    console.log(`   ✅ Script verified: ${data.fullNarrationText.split(/\s+/).length} words.`);
  },

  voice: async (projectId) => {
    console.log(`\n▶️ [Stage: voice] Generating Indonesian voice narration via Edge TTS...`);
    const paths = getProjectPaths(projectId);
    const scriptData = JSON.parse(fs.readFileSync(paths.scriptJson, "utf-8"));
    const text = scriptData.fullNarrationText;
    const voice = scriptData.targetVoice?.includes("Gadis") ? "gadis" : "ardi";

    const mp3File = path.join(rootDir, "public", `${projectId}.mp3`);
    const jsonFile = path.join(rootDir, "public", `${projectId}.json`);

    execFileSync(
      "node",
      ["scripts/generate-voice.mjs", "-v", voice, "-o", projectId, "-t", text],
      { cwd: rootDir, env, stdio: "inherit" }
    );

    if (!fs.existsSync(mp3File) || !fs.existsSync(jsonFile)) {
      throw new Error("Voice generation did not produce expected output files.");
    }

    updateStageStatus(projectId, "voice", "completed", {
      audioPath: path.relative(rootDir, mp3File),
      metadataPath: path.relative(rootDir, jsonFile),
    });
    console.log(`   ✅ Voice narration & word timestamps generated successfully.`);
  },

  storyboard: async (projectId) => {
    console.log(`\n▶️ [Stage: storyboard] Validating storyboard as Single Source of Truth...`);
    const paths = getProjectPaths(projectId);
    if (!fs.existsSync(paths.storyboardJson)) {
      throw new Error(`Missing ${path.relative(rootDir, paths.storyboardJson)}`);
    }
    const data = JSON.parse(fs.readFileSync(paths.storyboardJson, "utf-8"));
    if (!Array.isArray(data.shots) || data.shots.length === 0) {
      throw new Error("Storyboard must contain at least 1 shot.");
    }
    updateStageStatus(projectId, "storyboard", "completed", {
      shotsCount: data.shots.length,
      totalFrames: data.totalFrames,
      artifactPath: path.relative(rootDir, paths.storyboardJson),
    });
    console.log(`   ✅ Storyboard verified: ${data.shots.length} shots across ${data.totalFrames} frames.`);
  },

  scene: async (projectId, compositionName) => {
    const comp = compositionName || "TouchscreenExplainer";
    console.log(`\n▶️ [Stage: scene] Verifying Remotion composition "${comp}"...`);
    const compFile = path.join(rootDir, "src", `${comp}.tsx`);
    if (!fs.existsSync(compFile)) {
      throw new Error(`Composition source file src/${comp}.tsx not found.`);
    }

    execFileSync("npm", ["run", "lint"], { cwd: rootDir, env, stdio: "pipe" });
    updateStageStatus(projectId, "scene", "completed", { composition: comp, file: path.relative(rootDir, compFile) });
    console.log(`   ✅ Composition code syntax & types verified clean.`);
  },

  keyframes: async (projectId, compositionName) => {
    const comp = compositionName || "TouchscreenExplainer";
    console.log(`\n▶️ [Stage: keyframes] Capturing preview keyframes and contact sheet...`);
    const outDir = path.join(rootDir, "out", "qa", comp);

    execFileSync(
      "node",
      ["scripts/qa-engine.mjs", "-c", comp, "-o", "out/qa"],
      { cwd: rootDir, env, stdio: "inherit" }
    );

    const contactSheet = path.join(outDir, "contact-sheet.png");
    if (!fs.existsSync(contactSheet)) {
      throw new Error("Contact sheet was not generated.");
    }

    updateStageStatus(projectId, "keyframes", "completed", {
      contactSheet: path.relative(rootDir, contactSheet),
    });
    console.log(`   ✅ Keyframes and contact sheet generated at ${path.relative(rootDir, contactSheet)}.`);
  },

  qa: async (projectId, compositionName) => {
    const comp = compositionName || "TouchscreenExplainer";
    console.log(`\n▶️ [Stage: qa] Running deterministic Quality Assurance checks...`);
    const qaReportJson = path.join(rootDir, "out", "qa", comp, "qa-report.json");

    if (!fs.existsSync(qaReportJson)) {
      execFileSync(
        "node",
        ["scripts/qa-engine.mjs", "-c", comp, "-o", "out/qa"],
        { cwd: rootDir, env, stdio: "inherit" }
      );
    }

    const report = JSON.parse(fs.readFileSync(qaReportJson, "utf-8"));
    if (report.overallStatus !== "passed") {
      updateStageStatus(projectId, "qa", "needs_revision", { issues: report.issues });
      throw new Error(`QA failed with ${report.issues.length} issue(s). See QA-REPORT.md.`);
    }

    updateStageStatus(projectId, "qa", "completed", { reportPath: path.relative(rootDir, qaReportJson) });
    console.log(`   ✅ Deterministic QA PASSED.`);
  },

  render: async (projectId, compositionName) => {
    const comp = compositionName || "TouchscreenExplainer";
    console.log(`\n▶️ [Stage: render] Rendering final production MP4 for "${comp}"...`);
    const outFile = path.join(rootDir, "out", `${comp}.mp4`);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });

    execFileSync(
      "npx",
      ["remotion", "render", comp, outFile],
      { cwd: rootDir, env, stdio: "inherit" }
    );

    if (!fs.existsSync(outFile) || fs.statSync(outFile).size === 0) {
      throw new Error("Render finished but output file is missing or zero bytes.");
    }

    const sizeMb = (fs.statSync(outFile).size / (1024 * 1024)).toFixed(1);
    updateStageStatus(projectId, "render", "completed", {
      mp4Path: path.relative(rootDir, outFile),
      sizeMb: parseFloat(sizeMb),
    });
    console.log(`   ✅ Video Render Complete: ${path.relative(rootDir, outFile)} (${sizeMb} MB)`);
  },
};

async function main() {
  const opts = parseArgs();

  if (opts.command === "help") {
    console.log(`
REMOTION STUDIO V2 - PIPELINE STATE MACHINE RUNNER

Commands:
  run          Execute pipeline stages sequentially (default)
  status       Display current state and checkpoints of a project
  help         Display this help message

Options:
  -p, --project <id>       Project identifier (required)
  -c, --composition <id>   Remotion composition name (default: TouchscreenExplainer)
  -s, --stage <stage>      Execute single stage (${STAGES.join(", ")}, or "all")
  -r, --resume             Resume from last uncompleted checkpoint
`);
    return;
  }

  const projectId = opts.project || "touchscreen-explainer";
  const composition = opts.composition || "TouchscreenExplainer";

  if (opts.command === "status") {
    const paths = getProjectPaths(projectId);
    if (!fs.existsSync(paths.projectJson)) {
      console.log(`Project "${projectId}" has not been initialized yet.`);
      return;
    }
    const spec = JSON.parse(fs.readFileSync(paths.projectJson, "utf-8"));
    console.log(`=======================================================`);
    console.log(`  PROJECT STATUS: ${spec.id} (${spec.title})`);
    console.log(`  Updated : ${spec.updatedAt}`);
    console.log(`=======================================================`);
    STAGES.forEach((st) => {
      const info = spec.stages[st] || { status: "pending" };
      const icon = info.status === "completed" ? "✅" : info.status === "failed" || info.status === "needs_revision" ? "❌" : "⏳";
      console.log(`  ${icon} [${st.padEnd(12)}] : ${info.status}`);
    });
    console.log(``);
    return;
  }

  if (opts.command === "init") {
    loadOrCreateProjectSpec(projectId);
    console.log(`✅ Project "${projectId}" workspace initialized at projects/${projectId}/project.json`);
    return;
  }

  // Load or create project specification
  const spec = loadOrCreateProjectSpec(projectId);

  let targetStages = STAGES;
  if (opts.stage !== "all") {
    if (!STAGES.includes(opts.stage)) {
      throw new Error(`Unknown stage "${opts.stage}". Available: ${STAGES.join(", ")}`);
    }
    targetStages = [opts.stage];
  } else if (opts.resume) {
    // Find first stage that is not completed
    const firstIncompleteIdx = STAGES.findIndex(
      (st) => spec.stages[st]?.status !== "completed"
    );
    if (firstIncompleteIdx >= 0) {
      targetStages = STAGES.slice(firstIncompleteIdx);
      console.log(`Resuming production pipeline from stage "${targetStages[0]}"...`);
    } else {
      console.log(`All stages are already marked as completed for project "${projectId}". Use --stage <name> to re-run.`);
      return;
    }
  }

  console.log(`\n🚀 Starting Studio V2 Pipeline for project "${projectId}"...`);
  console.log(`   Stages to execute: ${targetStages.join(" -> ")}\n`);

  for (const st of targetStages) {
    const handler = stageHandlers[st];
    if (handler) {
      try {
        updateStageStatus(projectId, st, "running");
        await handler(projectId, composition);
      } catch (err) {
        updateStageStatus(projectId, st, "failed", { error: err.message });
        console.error(`\n❌ Pipeline halted at stage "${st}":`, err.message);
        process.exit(1);
      }
    }
  }

  console.log(`\n🎉 Pipeline execution completed successfully for project "${projectId}".\n`);
}

main().catch((err) => {
  console.error("Fatal Pipeline Error:", err.message);
  process.exit(1);
});
