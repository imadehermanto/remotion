import { z } from "zod";

export const NarrativeStructureEnum = z.enum([
  "MysteryReveal",
  "ProblemMechanismSolution",
  "MythRealityDemonstration",
  "InsideTheMachine",
  "StepByStepMechanism",
  "CauseAndEffect",
  "VisualExperiment",
  "Comparison",
  "ContinuousJourneyThroughSystem",
]);

export type NarrativeStructure = z.infer<typeof NarrativeStructureEnum>;

export const VisualStyleTypeEnum = z.enum([
  "CinematicTechnicalExplainer",
  "PremiumStylized3D",
  "EducationalCutaway",
  "MinimalistProductVisualization",
  "EngineeringSchematic",
  "MacroMechanical",
  "Mixed2D3DMotionGraphics",
]);

export type VisualStyleType = z.infer<typeof VisualStyleTypeEnum>;

export const ProductionStageStatusEnum = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "needs_revision",
  "blocked",
]);

export type ProductionStageStatus = z.infer<typeof ProductionStageStatusEnum>;

export const ProductionStageEnum = z.enum([
  "research",
  "creative_brief",
  "script",
  "storyboard",
  "styleframes",
  "audio_voice",
  "scene_assembly",
  "draft_render",
  "qa_evaluation",
  "scene_revision",
  "final_render",
  "delivered",
]);

export type ProductionStage = z.infer<typeof ProductionStageEnum>;

export const ProjectSpecSchema = z.object({
  id: z.string(),
  title: z.string(),
  topic: z.string(),
  targetDurationSeconds: z.number().min(15).max(120).default(50),
  fps: z.number().int().default(30),
  width: z.number().int().default(1080),
  height: z.number().int().default(1920),
  language: z.string().default("id-ID"),
  narrativeStructure: NarrativeStructureEnum.default("StepByStepMechanism"),
  visualStyle: VisualStyleTypeEnum.default("CinematicTechnicalExplainer"),
  createdAt: z.string(),
  updatedAt: z.string(),
  currentStage: ProductionStageEnum.default("research"),
  stages: z.record(
    ProductionStageEnum,
    z.object({
      status: ProductionStageStatusEnum,
      startedAt: z.string().optional(),
      completedAt: z.string().optional(),
      summary: z.string().optional(),
      artifactPath: z.string().optional(),
    })
  ),
});

export type ProjectSpec = z.infer<typeof ProjectSpecSchema>;

