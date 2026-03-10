import test from "node:test";
import assert from "node:assert/strict";
import { createCoachTools } from "../lib/ai/tools.js";
import { createLiveFallbackWarning, hasOpenAIConfig } from "../lib/ai/live-engine.js";
import { resolveRequestedMode } from "../lib/ai/types.js";

test("resolveRequestedMode defaults safely to mock", () => {
  assert.equal(resolveRequestedMode("live"), "live");
  assert.equal(resolveRequestedMode("mock"), "mock");
  assert.equal(resolveRequestedMode("anything-else"), "mock");
});

test("createLiveFallbackWarning returns a user-safe warning payload", () => {
  const warning = createLiveFallbackWarning(new Error("boom"));

  assert.deepEqual(warning, {
    code: "live_fallback",
    message:
      "A resposta em tempo real falhou nesta rodada. Usei o modo mock para não interromper o fluxo.",
  });
});

test("hasOpenAIConfig reflects OPENAI_API_KEY presence", () => {
  const previous = process.env.OPENAI_API_KEY;

  delete process.env.OPENAI_API_KEY;
  assert.equal(hasOpenAIConfig(), false);

  process.env.OPENAI_API_KEY = "test-key";
  assert.equal(hasOpenAIConfig(), true);

  if (previous) {
    process.env.OPENAI_API_KEY = previous;
  } else {
    delete process.env.OPENAI_API_KEY;
  }
});

test("createCoachTools hydrates live operations with ids and conversation context", async () => {
  const tools = createCoachTools({
    teamId: "team-1",
    conversationId: "conv-77",
  });

  const result = await tools.commitCoachState.execute({
    suggestedActions: [{ label: "Criar rotina", message: "Cria uma rotina", kind: "action" }],
    warnings: [],
    operations: [
      {
        type: "create_task",
        task: {
          title: "Bloco curto",
          description: "Reservar alguns minutos ainda hoje.",
        },
        activity: {
          type: "task",
          title: "Bloco curto",
          description: "Próximo passo pronto.",
        },
      },
      {
        type: "add_equipment",
        equipmentItems: [{ label: "Esteira" }, { label: "Esteira" }],
      },
    ],
  });

  const taskOperation = result.operations.find((operation) => operation.type === "create_task");
  const equipmentOperation = result.operations.find((operation) => operation.type === "add_equipment");

  assert.ok(taskOperation.task.id.startsWith("task-"));
  assert.equal(taskOperation.task.teamId, "team-1");
  assert.equal(taskOperation.task.linkedConversationId, "conv-77");
  assert.equal(taskOperation.activity.linkedConversationId, "conv-77");
  assert.deepEqual(result.suggestedActions, [
    { label: "Criar rotina", message: "Cria uma rotina", kind: "action" },
  ]);
  assert.deepEqual(equipmentOperation.equipmentItems, [{ id: "esteira", label: "Esteira" }]);
});
