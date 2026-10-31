import { z } from "zod";

export const ColorPaletteSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  backgroundGradStart: z.string(),
  backgroundGradEnd: z.string(),
  textPrimary: z.string(),
  textSecondary: z.string(),
  glowOrLaser: z.string().optional(),
});

export const TypographyStyleSchema = z.object({
  fontFamily: z.string().default("Montserrat"),
  headingWeight: z.string().default("800"),
  bodyWeight: z.string().default("600"),
  subtitleStyle: z.enum(["MinimalModern", "HighContrastPill", "KineticPop", "EditorialClean"]).default("MinimalModern"),
  maxCharsPerLine: z.number().default(28),
});

export const VisualStyleSpecSchema = z.object({
  styleId: z.string(),
  name: z.string(),
  description: z.string(),
  colorPalette: ColorPaletteSchema,
  typography: TypographyStyleSchema,
  lightingRigDefault: z.string(),
  materialsPreference: z.string(),
  contrastLevel: z.enum(["high", "medium", "soft"]).default("high"),
  cameraConventions: z.string(),
  compositionGuidelines: z.string(),
});

export type VisualStyleSpec = z.infer<typeof VisualStyleSpecSchema>;

export const AudioAlignmentWordSchema = z.object({
  word: z.string(),
  startMs: z.number(),
  endMs: z.number(),
  startFrame: z.number().int(),
  endFrame: z.number().int(),
});

export const AudioAlignmentSentenceSchema = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
  startFrame: z.number().int(),
  endFrame: z.number().int(),
});

export const AudioTimingManifestSchema = z.object({
  projectId: z.string(),
  voiceFile: z.string(),
  voiceProvider: z.string().default("EdgeTTS"),
  voiceName: z.string(),
  fps: z.number().int().default(30),
  totalDurationMs: z.number(),
  totalDurationFrames: z.number().int(),
  sentences: z.array(AudioAlignmentSentenceSchema),
  words: z.array(AudioAlignmentWordSchema),
  bgm: z
    .object({
      file: z.string(),
      volume: z.number().min(0).max(1).default(0.15),
      fadeInFrames: z.number().int().default(15),
      fadeOutFrames: z.number().int().default(30),
    })
    .optional(),
  sfxEvents: z.array(
    z.object({
      id: z.string(),
      file: z.string(),
      triggerFrame: z.number().int(),
      volume: z.number().min(0).max(1).default(0.4),
      description: z.string().optional(),
    })
  ),
});

export type AudioTimingManifest = z.infer<typeof AudioTimingManifestSchema>;

export const QAIssueSeverityEnum = z.enum(["blocker", "critical", "warning", "info"]);

export const QAIssueSchema = z.object({
  id: z.string(),
  severity: QAIssueSeverityEnum,
  category: z.enum(["technical", "visual", "motion", "editorial", "audio"]),
  affectedShotId: z.string().optional(),
  startFrame: z.number().int().optional(),
  endFrame: z.number().int().optional(),
  title: z.string(),
  description: z.string(),
  suggestedFix: z.string(),
  resolved: z.boolean().default(false),
});

export type QAIssue = z.infer<typeof QAIssueSchema>;

export const QAReportSchema = z.object({
  projectId: z.string(),
  timestamp: z.string(),
  passed: z.boolean(),
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
  technicalChecks: z.object({
    typescriptValid: z.boolean(),
    eslintValid: z.boolean(),
    assetsResolved: z.boolean(),
    timelineSynced: z.boolean(),
    missingFiles: z.array(z.string()),
  }),
  visualChecks: z.object({
    safeZoneCompliant: z.boolean(),
    subjectFramingAcceptable: z.boolean(),
    contrastReadable: z.boolean(),
    blackFramesDetected: z.boolean(),
    contactSheetPath: z.string().optional(),
    previewFrames: z.array(z.string()),
  }),
  audioChecks: z.object({
    voiceDurationMatchesTimeline: z.boolean(),
    sfxBoundToEvents: z.boolean(),
    clippingDetected: z.boolean(),
  }),
  editorialChecks: z.object({
    hookEngagementRating: z.number().min(1).max(5),
    scientificAccuracyRating: z.number().min(1).max(5),
    pacingRating: z.number().min(1).max(5),
    clarityRating: z.number().min(1).max(5),
    feedback: z.string(),
  }),
  issues: z.array(QAIssueSchema),
});

export type QAReport = z.infer<typeof QAReportSchema>;

export const RevisionPlanSchema = z.object({
  projectId: z.string(),
  revisionIteration: z.number().int().default(1),
  maxIterationsAllowed: z.number().int().default(3),
  targetIssues: z.array(z.string()),
  sceneChanges: z.array(
    z.object({
      shotId: z.string(),
      description: z.string(),
      codeDiffNotes: z.string().optional(),
    })
  ),
  status: z.enum(["pending", "in_progress", "completed", "exhausted"]),
});

export type RevisionPlan = z.infer<typeof RevisionPlanSchema>;

