import { z } from "zod";

export const coachModeSchema = z.enum(["mock", "live"]);

export const coachSuggestedActionSchema = z.object({
  label: z.string().min(1),
  message: z.string().min(1),
  kind: z.enum(["question", "action"]).default("action"),
});

export const coachWarningSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
});

export const habitSchema = z.object({
  id: z.string().min(1),
  teamId: z.string().min(1),
  name: z.string().min(1),
  cadence: z.string().min(1),
  targetLabel: z.string().min(1),
  progress: z.number(),
  progressLabel: z.string().min(1),
  statusLabel: z.string().min(1),
});

export const taskSchema = z.object({
  id: z.string().min(1),
  teamId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  whenLabel: z.string().min(1),
  status: z.string().min(1),
  linkedConversationId: z.string().min(1),
});

export const activitySchema = z.object({
  id: z.string().min(1),
  teamId: z.string().min(1),
  type: z.enum(["habit", "task", "insight"]),
  title: z.string().min(1),
  description: z.string().min(1),
  meta: z.string().min(1),
  whenLabel: z.string().min(1),
  linkedConversationId: z.string().min(1),
});

export const equipmentItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

export const coachOperationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("create_habit"),
    habit: habitSchema,
    activity: activitySchema.optional(),
  }),
  z.object({
    type: z.literal("create_task"),
    task: taskSchema,
    activity: activitySchema.optional(),
  }),
  z.object({
    type: z.literal("create_activity"),
    activity: activitySchema,
  }),
  z.object({
    type: z.literal("add_equipment"),
    equipmentItems: z.array(equipmentItemSchema).min(1),
  }),
  z.object({
    type: z.literal("suggest_action"),
    suggestion: coachSuggestedActionSchema,
  }),
]);

export const coachTurnDataSchema = z.object({
  suggestedActions: z.array(coachSuggestedActionSchema).default([]),
  operations: z.array(coachOperationSchema).default([]),
  warnings: z.array(coachWarningSchema).default([]),
});

export const coachContextSchema = z.object({
  habits: z.array(z.any()).default([]),
  tasks: z.array(z.any()).default([]),
  upcomingActivities: z.array(z.any()).default([]),
  equipmentItems: z.array(z.any()).default([]),
  activeConversationTitle: z.string().default("Nova conversa"),
});

export const coachChatBodySchema = z.object({
  mode: coachModeSchema.optional(),
  teamId: z.string().optional(),
  context: coachContextSchema.default({}),
});

export const coachChatRequestSchema = z.object({
  id: z.string().optional(),
  messages: z.array(z.any()).default([]),
  body: coachChatBodySchema.default({}),
});

export const coachDataPartSchemas = {
  "coach-turn": coachTurnDataSchema,
};

export function createEmptyCoachTurnData() {
  return {
    suggestedActions: [],
    operations: [],
    warnings: [],
  };
}

export function normalizeCoachTurnData(input) {
  const parsed = coachTurnDataSchema.safeParse(input);
  if (parsed.success) {
    return parsed.data;
  }

  return createEmptyCoachTurnData();
}

export function createCoachWarning(code, message) {
  return { code, message };
}

export function resolveRequestedMode(mode) {
  return mode === "live" ? "live" : "mock";
}
