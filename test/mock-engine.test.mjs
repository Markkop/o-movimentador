import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMockCoachTurn,
  dedupeOperations,
  normalizeMessage,
} from "../lib/ai/mock-engine.js";

test("normalizeMessage removes accents and casing noise", () => {
  assert.equal(normalizeMessage("  Meditação À Noite "), "meditacao a noite");
});

test("buildMockCoachTurn keeps starter prompt parity", () => {
  const turn = buildMockCoachTurn({
    userMessage: "Fiquei sentado o dia todo hoje",
    teamId: "team-1",
    conversationId: "conv-1",
    context: {
      habits: [],
      tasks: [],
      upcomingActivities: [],
      equipmentItems: [],
    },
  });

  assert.match(turn.text, /reset de 8 minutos/i);
  assert.equal(turn.coachTurn.operations.length, 0);
  assert.deepEqual(
    turn.coachTurn.suggestedActions.map((item) => item.kind),
    ["question", "question", "question", "action", "action"]
  );
});

test("buildMockCoachTurn creates task and equipment operations deterministically", () => {
  const turn = buildMockCoachTurn({
    userMessage: "Tenho uma esteira e quero criar tarefa de 5 minutos para hoje.",
    teamId: "team-1",
    conversationId: "conv-9",
    context: {
      habits: [],
      tasks: [],
      upcomingActivities: [],
      equipmentItems: [],
    },
  });

  const taskOperation = turn.coachTurn.operations.find((operation) => operation.type === "create_task");
  const equipmentOperation = turn.coachTurn.operations.find(
    (operation) => operation.type === "add_equipment"
  );

  assert.ok(taskOperation);
  assert.equal(taskOperation.task.linkedConversationId, "conv-9");
  assert.ok(taskOperation.activity);
  assert.ok(equipmentOperation);
  assert.deepEqual(equipmentOperation.equipmentItems, [{ id: "treadmill", label: "Esteira" }]);
  assert.match(turn.text, /Também registrei em \*\*Equipamentos\*\*: Esteira\./);
});

test("dedupeOperations merges duplicate equipment and repeated items", () => {
  const operations = dedupeOperations([
    {
      type: "add_equipment",
      equipmentItems: [{ id: "treadmill", label: "Esteira" }],
    },
    {
      type: "add_equipment",
      equipmentItems: [
        { id: "treadmill", label: "Esteira" },
        { id: "hand-grip", label: "Hand Grip" },
      ],
    },
    {
      type: "create_activity",
      activity: { id: "a-1" },
    },
    {
      type: "create_activity",
      activity: { id: "a-1" },
    },
  ]);

  assert.equal(
    operations.filter((operation) => operation.type === "create_activity").length,
    1
  );

  const equipmentOperation = operations.find((operation) => operation.type === "add_equipment");
  assert.deepEqual(equipmentOperation.equipmentItems, [
    { id: "treadmill", label: "Esteira" },
    { id: "hand-grip", label: "Hand Grip" },
  ]);
});
