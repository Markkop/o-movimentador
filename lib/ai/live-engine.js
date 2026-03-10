import { convertToModelMessages, createUIMessageStream, stepCountIs, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { buildCoachSystemPrompt } from "./prompt.js";
import { createMockStream, createMockWarningForLiveFallback } from "./mock-engine.js";
import { createCoachTools } from "./tools.js";
import { createEmptyCoachTurnData } from "./types.js";

export function hasOpenAIConfig() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function createLiveFallbackWarning(error) {
  if (!error) {
    return null;
  }

  return createMockWarningForLiveFallback(error);
}

export function createLiveStream({ messages, conversationId, teamId, context }) {
  return createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      let coachTurn = createEmptyCoachTurnData();

      try {
        if (!hasOpenAIConfig()) {
          throw new Error("OPENAI_API_KEY is missing");
        }

        const result = streamText({
          model: openai(process.env.OPENAI_MODEL || "gpt-4.1-mini"),
          temperature: 0.4,
          stopWhen: stepCountIs(3),
          system: buildCoachSystemPrompt({ context }),
          messages: await convertToModelMessages(messages),
          tools: createCoachTools({
            teamId,
            conversationId,
            onCommit: (value) => {
              coachTurn = value;
            },
          }),
        });

        writer.merge(
          result.toUIMessageStream({
            originalMessages: messages,
            sendFinish: false,
          })
        );
        await result.consumeStream({ onError: writer.onError });
        writer.write({
          type: "data-coach-turn",
          data: coachTurn,
        });
        writer.write({ type: "finish" });
      } catch (error) {
        const warning = createLiveFallbackWarning(error);
        writer.merge(
          createMockStream({
            messages,
            conversationId,
            teamId,
            context,
            warnings: warning ? [warning] : [],
          })
        );
      }
    },
  });
}
