import { z } from "zod";
import { normalizeCoachTurnData } from "./types.js";
import { dedupeOperations, normalizeMessage } from "./mock-engine.js";

const suggestedActionInputSchema = z.object({
  label: z.string().min(1),
  message: z.string().min(1),
  kind: z.enum(["question", "action"]).default("action"),
});

const activityInputSchema = z.object({
  type: z.enum(["habit", "task", "insight"]),
  title: z.string().min(1),
  description: z.string().min(1),
  meta: z.string().default("Novo"),
  whenLabel: z.string().default("Hoje"),
});

const operationInputSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("create_habit"),
    habit: z.object({
      name: z.string().min(1),
      cadence: z.string().default("Diário"),
      targetLabel: z.string().default("5 min"),
      progress: z.number().default(0),
      progressLabel: z.string().default("0 de 5 min"),
      statusLabel: z.string().default("Começa hoje"),
    }),
    activity: activityInputSchema.optional(),
  }),
  z.object({
    type: z.literal("create_task"),
    task: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      whenLabel: z.string().default("Hoje"),
      status: z.string().default("Hoje"),
    }),
    activity: activityInputSchema.optional(),
  }),
  z.object({
    type: z.literal("create_activity"),
    activity: activityInputSchema,
  }),
  z.object({
    type: z.literal("add_equipment"),
    equipmentItems: z
      .array(
        z.object({
          id: z.string().optional(),
          label: z.string().min(1),
        })
      )
      .min(1),
  }),
  z.object({
    type: z.literal("suggest_action"),
    suggestion: suggestedActionInputSchema,
  }),
]);

const commitCoachStateInputSchema = z.object({
  suggestedActions: z.array(suggestedActionInputSchema).default([]),
  operations: z.array(operationInputSchema).default([]),
  warnings: z
    .array(
      z.object({
        code: z.string().min(1),
        message: z.string().min(1),
      })
    )
    .default([]),
});

function createId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`;
}

function createActivity(activity, teamId, conversationId) {
  return {
    id: createId("next"),
    teamId,
    title: activity.title,
    description: activity.description,
    type: activity.type,
    meta: activity.meta || "Novo",
    whenLabel: activity.whenLabel || "Hoje",
    linkedConversationId: conversationId,
  };
}

function slugifyEquipment(label) {
  return normalizeMessage(label).replace(/\s+/g, "-");
}

function hydrateOperation(operation, { teamId, conversationId }) {
  switch (operation.type) {
    case "create_habit":
      return {
        type: "create_habit",
        habit: {
          id: createId("habit"),
          teamId,
          cadence: operation.habit.cadence || "Diário",
          targetLabel: operation.habit.targetLabel || "5 min",
          progress: operation.habit.progress ?? 0,
          progressLabel: operation.habit.progressLabel || "0 de 5 min",
          statusLabel: operation.habit.statusLabel || "Começa hoje",
          ...operation.habit,
        },
        ...(operation.activity
          ? {
              activity: createActivity(
                { ...operation.activity, type: operation.activity.type || "habit" },
                teamId,
                conversationId
              ),
            }
          : {}),
      };
    case "create_task":
      return {
        type: "create_task",
        task: {
          id: createId("task"),
          teamId,
          whenLabel: operation.task.whenLabel || "Hoje",
          status: operation.task.status || "Hoje",
          ...operation.task,
          linkedConversationId: conversationId,
        },
        ...(operation.activity
          ? {
              activity: createActivity(
                { ...operation.activity, type: operation.activity.type || "task" },
                teamId,
                conversationId
              ),
            }
          : {}),
      };
    case "create_activity":
      return {
        type: "create_activity",
        activity: createActivity(operation.activity, teamId, conversationId),
      };
    case "add_equipment":
      return {
        type: "add_equipment",
        equipmentItems: operation.equipmentItems.map((item) => ({
          id: item.id || slugifyEquipment(item.label),
          label: item.label,
        })),
      };
    case "suggest_action":
      return {
        type: "suggest_action",
        suggestion: operation.suggestion,
      };
    default:
      return operation;
  }
}

export function createCoachTools({ teamId, conversationId, onCommit }) {
  return {
    commitCoachState: {
      description:
        "Registra ações sugeridas e mudanças estruturadas da resposta do coach antes da mensagem final.",
      inputSchema: commitCoachStateInputSchema,
      execute: async (input) => {
        const normalized = normalizeCoachTurnData({
          suggestedActions: input.suggestedActions,
          warnings: input.warnings,
          operations: dedupeOperations(
            input.operations.map((operation) =>
              hydrateOperation(operation, {
                teamId,
                conversationId,
              })
            )
          ),
        });

        onCommit?.(normalized);

        return normalized;
      },
    },
  };
}
