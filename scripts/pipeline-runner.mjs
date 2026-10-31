#!/usr/bin/env node
/**
 * REMOTION AI REELS STUDIO V2 - PRODUCTION PIPELINE RUNNER
 *
 * Orchestrates the full lifecycle:
 * RESEARCH -> SCRIPT -> VOICE -> STORYBOARD -> SCENE -> QA -> RENDER -> REPORT
 */

import { execSync } from "node:child_process";
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

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    command: "help",
    project: "",
    stage: "all",
    composition: "",
  };

  if (args.length > 0) {
    options.command = args[0];
  }

  for (let i = 1; i < args.length; i++) {
    const a = args[i];
    if (a === "--project" || a === "-p") {
      options.project = args[++i];
    } else if (a === "--stage" || a === "-s") {
      options.stage = args[++i];
    } else if (a === "--composition" || a === "-c") {
      options.composition = args[++i];
    }
  }

  return options;
}

function showHelp() {
  console.log(`
REMOTION AI REELS STUDIO V2 - PIPELINE COMMANDS

Usage:
  npm run pipeline -- <command> [options]

Commands:
  status               Check status of projects
  qa                   Run QA checks on composition
  render               Render final MP4 for composition
  contact-sheet        Generate contact sheet preview

Options:
  -p, --project <id>       Project slug / directory
  -c, --composition <id>   Remotion composition ID
  -s, --stage <stage>      Target stage to execute
`);
}

async function main() {
  const opts = parseArgs();

  if (opts.command === "help" || opts.command === "--help") {
    showHelp();
    return;
  }

  if (opts.command === "qa") {
    const comp = opts.composition || opts.project;
    if (!comp) {
      console.error("❌ Please specify --composition or --project");
      process.exit(1);
    }
    execSync(`node scripts/qa-engine.mjs --composition ${comp}`, {
      cwd: rootDir,
      env,
      stdio: "inherit",
    });
    return;
  }

  if (opts.command === "render") {
    const comp = opts.composition || opts.project;
    if (!comp) {
      console.error("❌ Please specify --composition or --project");
      process.exit(1);
    }
    const outFile = path.join(rootDir, "out", `${comp}.mp4`);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    console.log(`🚀 Rendering composition "${comp}" to ${path.relative(rootDir, outFile)}...`);
    execSync(`npx remotion render ${comp} ${outFile}`, {
      cwd: rootDir,
      env,
      stdio: "inherit",
    });
    console.log(`✅ Render complete! Output: ${outFile}`);
    return;
  }

  console.log(`Unknown command: ${opts.command}`);
  showHelp();
}

main().catch((err) => {
  console.error("Pipeline runner error:", err);
  process.exit(1);
});

