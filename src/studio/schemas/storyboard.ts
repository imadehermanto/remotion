import { z } from "zod";

export const ResearchSpecSchema = z.object({
  topic: z.string(),
  coreEducationalQuestion: z.string(),
  scientificPrinciples: z.array(z.string()),
  confirmedFacts: z.array(z.string()),
  commonMisconceptions: z.array(z.string()),
  analogies: z.array(z.string()),
  citationsAndSources: z.array(
    z.object({
      title: z.string(),
      source: z.string(),
      notes: z.string(),
    })
  ),
  technicalVerificationNotes: z.string(),
});

export type ResearchSpec = z.infer<typeof ResearchSpecSchema>;

export const ScriptSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  narrationText: z.string(),
  estimatedSeconds: z.number(),
  targetMood: z.string(),
  visualCue: z.string(),
});

export const ScriptSpecSchema = z.object({
  projectId: z.string(),
  title: z.string(),
  targetVoice: z.string().default("id-ID-ArdiNeural"),
  hook: z.string(),
  sections: z.array(ScriptSectionSchema),
  fullNarrationText: z.string(),
  estimatedTotalWords: z.number(),
  estimatedDurationSeconds: z.number(),
  closingTakeaway: z.string(),
});

export type ScriptSpec = z.infer<typeof ScriptSpecSchema>;

export const CameraMovementEnum = z.enum([
  "Static",
  "DollyIn",
  "DollyOut",
  "OrbitReveal",
  "MacroPushIn",
  "TrackingShot",
  "ExplodedViewReveal",
  "CutawayTransition",
  "MechanicalFollowThrough",
  "IsometricOverview",
]);

export type CameraMovement = z.infer<typeof CameraMovementEnum>;

export const ShotSpecSchema = z.object({
  shotId: z.string(),
  shotIndex: z.number().int(),
  startFrame: z.number().int(),
  endFrame: z.number().int(),
  durationFrames: z.number().int(),
  scenePurpose: z.string(),
  narrationSegment: z.string(),
  keyVisualAction: z.string(),
  subjectAndEnvironment: z.string(),
  cameraShotType: z.string(),
  cameraMovement: CameraMovementEnum,
  cameraConfig: z
    .object({
      startPos: z.tuple([z.number(), z.number(), z.number()]),
      endPos: z.tuple([z.number(), z.number(), z.number()]),
      startLookAt: z.tuple([z.number(), z.number(), z.number()]),
      endLookAt: z.tuple([z.number(), z.number(), z.number()]),
      fov: z.number().optional().default(45),
    })
    .optional(),
  primaryAnimation: z.string(),
  secondaryAnimation: z.string().optional(),
  lightingRig: z.string(),
  textOverlay: z
    .object({
      headline: z.string().optional(),
      subheadline: z.string().optional(),
      technicalBadge: z.string().optional(),
      calloutLabel: z.string().optional(),
    })
    .optional(),
  soundEffects: z.array(
    z.object({
      cue: z.string(),
      triggerFrameOffset: z.number().int().default(0),
      soundFile: z.string(),
      volume: z.number().min(0).max(1).default(0.5),
    })
  ),
  requiredAssets: z.array(z.string()),
  transitionStrategy: z.string().default("cut"),
});

export type ShotSpec = z.infer<typeof ShotSpecSchema>;

export const StoryboardSpecSchema = z.object({
  projectId: z.string(),
  fps: z.number().int().default(30),
  totalFrames: z.number().int(),
  shots: z.array(ShotSpecSchema),
});

export type StoryboardSpec = z.infer<typeof StoryboardSpecSchema>;

