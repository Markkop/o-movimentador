import { createUIMessageStreamResponse, validateUIMessages } from "ai";
import { createLiveStream } from "@/lib/ai/live-engine";
import { createMockStream } from "@/lib/ai/mock-engine";
import {
  coachChatRequestSchema,
  coachDataPartSchemas,
  resolveRequestedMode,
} from "@/lib/ai/types";

export const maxDuration = 30;

export async function POST(req) {
  const json = await req.json();
  const parsed = coachChatRequestSchema.parse(json);
  const conversationId = parsed.id ?? `conv-${crypto.randomUUID()}`;
  const mode = resolveRequestedMode(parsed.body?.mode);
  const teamId = parsed.body?.teamId ?? "team-1";
  const context = parsed.body?.context ?? {};
  const messages = await validateUIMessages({
    messages: parsed.messages,
    dataSchemas: coachDataPartSchemas,
  });

  const stream =
    mode === "live"
      ? createLiveStream({ messages, conversationId, teamId, context })
      : createMockStream({ messages, conversationId, teamId, context });

  return createUIMessageStreamResponse({ stream });
}
