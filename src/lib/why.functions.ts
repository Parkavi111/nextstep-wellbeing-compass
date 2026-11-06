import { createServerFn } from "@tanstack/react-start";
import { fallbackWhy, OPTIONS, type Answers, type Option } from "./nextstep";

// Only the four multiple-choice answers are sent — never the free-text box.
export const getWhy = createServerFn({ method: "POST" })
  .inputValidator((d: { answers: Answers; step: Option }) => {
    if (!OPTIONS.includes(d.step)) throw new Error("bad step");
    return d;
  })
  .handler(async ({ data }) => {
    const { answers, step } = data;
    const key = process.env['ANTHROPIC_API_KEY'];
    if (!key) return { why: fallbackWhy(answers, step) };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-latest",
          max_tokens: 120,
          system:
            "You write one short, warm, simple explanation (max 2 sentences, no diagnosis, no medical claims) of why a wellbeing next step was suggested. Speak directly to the person as 'you'.",
          messages: [
            {
              role: "user",
              content: `Feeling: ${answers.feeling}. Duration: ${answers.duration}. Affects sleep/work: ${answers.impact}. Wants: ${answers.need}. Suggested step: ${step}.`,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const json = (await res.json()) as { content?: { text?: string }[] };
      const text = json.content?.[0]?.text?.trim();
      return { why: text || fallbackWhy(answers, step) };
    } catch {
      return { why: fallbackWhy(answers, step) };
    }
  });
