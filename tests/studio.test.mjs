import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const env = {
  ...process.env,
  PATH: `/opt/homebrew/bin:${process.env.PATH || ""}`,
};

test("1. Security: CLI rejects invalid inputs and shell injection attempts", () => {
  // Test invalid composition with shell characters
  assert.throws(
    () => {
      execFileSync(
        "node",
        ["scripts/qa-engine.mjs", "-c", "Invalid;rm -rf /"],
        { cwd: rootDir, env, stdio: "pipe" }
      );
    },
    /Invalid composition ID/
  );

  // Test negative frame number
  assert.throws(
    () => {
      execFileSync(
        "node",
        ["scripts/qa-engine.mjs", "-c", "TouchscreenExplainer", "-f", "-10,50"],
        { cwd: rootDir, env, stdio: "pipe" }
      );
    },
    /Invalid frame number/
  );

  // Test pipeline runner with invalid project ID
  assert.throws(
    () => {
      execFileSync(
        "node",
        ["scripts/pipeline-runner.mjs", "status", "-p", "bad/path/injection"],
        { cwd: rootDir, env, stdio: "pipe" }
      );
    },
    /Invalid identifier/
  );
});

test("2. Storyboard SSOT: Storyboard schema and shot integrity", () => {
  const storyboardPath = path.join(rootDir, "projects/touchscreen-explainer/storyboard.json");
  assert.ok(fs.existsSync(storyboardPath), "storyboard.json must exist");

  const storyboard = JSON.parse(fs.readFileSync(storyboardPath, "utf-8"));
  assert.equal(storyboard.projectId, "touchscreen-explainer");
  assert.equal(storyboard.fps, 30);
  assert.ok(storyboard.totalFrames >= 1700, "Must be at least 1700 frames");
  assert.ok(storyboard.shots.length >= 5, "Must have at least 5 shots");

  // Every shot must have startFrame, endFrame, and cameraConfig
  storyboard.shots.forEach((shot, idx) => {
    assert.ok(shot.startFrame < shot.endFrame, `Shot ${idx} startFrame must be < endFrame`);
    assert.ok(shot.cameraConfig, `Shot ${idx} must have cameraConfig`);
    assert.ok(shot.cameraConfig.startPos.length === 3, `Shot ${idx} startPos must be Vector3`);
    assert.ok(shot.cameraConfig.endPos.length === 3, `Shot ${idx} endPos must be Vector3`);
    assert.ok(shot.textOverlay?.headline, `Shot ${idx} must have a headline`);
  });
});

test("3. Deterministic QA Engine: Real checks and no fake semantic ratings", () => {
  const qaReportPath = path.join(rootDir, "out/qa/TouchscreenExplainer/qa-report.json");
  assert.ok(fs.existsSync(qaReportPath), "qa-report.json must exist");

  const report = JSON.parse(fs.readFileSync(qaReportPath, "utf-8"));

  // Check that overallStatus is valid
  assert.equal(report.overallStatus, "passed");

  // Check real evaluated checks exist
  assert.ok(report.evaluatedChecks.technicalLintAndTypecheck);
  assert.ok(report.evaluatedChecks.assetIntegrity);
  assert.ok(report.evaluatedChecks.timelineAndAudioSync);
  assert.ok(report.evaluatedChecks.visualFrameMetrics);
  assert.ok(report.evaluatedChecks.safeZoneCompliance);

  // Check real timeline audio numbers
  const timeline = report.evaluatedChecks.timelineAndAudioSync;
  assert.ok(timeline.durationSec > 50, "Audio duration must be > 50s");
  assert.equal(timeline.compositionFrames, 1728);

  // Check real luminance values
  const frames = report.evaluatedChecks.visualFrameMetrics.frames;
  assert.ok(frames.length >= 5, "Must inspect at least 5 frames");
  frames.forEach((f) => {
    assert.ok(f.sizeBytes > 50000, `Frame ${f.frame} must be > 50KB`);
    assert.ok(typeof f.yMin === "number", `Frame ${f.frame} yMin must be a number`);
    assert.ok(typeof f.yMax === "number", `Frame ${f.frame} yMax must be a number`);
    assert.ok(typeof f.yAvg === "number", `Frame ${f.frame} yAvg must be a number`);
    assert.ok(f.dynamicRange > 100, `Frame ${f.frame} must have healthy dynamic range`);
  });

  // Verify semantic checks are explicitly marked "not_evaluated" (NO fake 5/5 scores!)
  assert.equal(report.semanticVisualAndEditorial.status, "not_evaluated");
  assert.equal(report.semanticVisualAndEditorial["scientificAccuracyRating"], undefined);
  assert.equal(report.semanticVisualAndEditorial["pacingRating"], undefined);
});

test("4. Pipeline State Machine: Project status and stage tracking", () => {
  const out = execFileSync(
    "node",
    ["scripts/pipeline-runner.mjs", "status", "-p", "touchscreen-explainer"],
    { cwd: rootDir, env, encoding: "utf-8" }
  );

  assert.ok(out.includes("PROJECT STATUS: touchscreen-explainer"));
  assert.ok(out.includes("[init        ]"));
  assert.ok(out.includes("[research    ]"));
  assert.ok(out.includes("[storyboard  ]"));
});

