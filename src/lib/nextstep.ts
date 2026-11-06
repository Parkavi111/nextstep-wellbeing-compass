export type Answers = {
  feeling?: "Calm" | "Stressed" | "Low" | "Overwhelmed";
  duration?: "Few days" | "Few weeks" | "Months";
  impact?: "Not really" | "A little" | "A lot";
  need?: "Talk to someone" | "Learn something" | "Just relax" | "Not sure";
};

export const OPTIONS = [
  "Book a counselor session",
  "Watch a 5-minute breathing video",
  "Take a stress self-assessment",
  "Join a 7-day gratitude program",
] as const;
export type Option = (typeof OPTIONS)[number];

export const HELPLINE_NAME = "Tele-MANAS (India, free, 24x7)";
export const HELPLINE_NUMBER = "14416";

const CRISIS_WORDS = [
  "suicide",
  "suicidal",
  "self-harm",
  "self harm",
  "end my life",
  "kill myself",
  "hurt myself",
  "want to die",
];

export function needsHumanSupport(a: Answers, text: string): boolean {
  const t = text.toLowerCase();
  if (CRISIS_WORDS.some((w) => t.includes(w))) return true;
  return a.feeling === "Overwhelmed" && a.duration === "Months" && a.impact === "A lot";
}

export function pickStep(a: Answers): Option {
  if (a.need === "Talk to someone") return OPTIONS[0];
  if (a.impact === "A lot" || a.duration === "Months") return OPTIONS[0];
  if (a.need === "Just relax") return OPTIONS[1];
  if (a.need === "Learn something") return a.feeling === "Calm" ? OPTIONS[3] : OPTIONS[2];
  if (a.feeling === "Calm") return OPTIONS[3];
  if (a.feeling === "Stressed" || a.feeling === "Overwhelmed") return OPTIONS[1];
  return OPTIONS[2];
}

export function fallbackWhy(a: Answers, step: Option): string {
  return `You mentioned feeling ${a.feeling?.toLowerCase() ?? "unsure"} for ${a.duration?.toLowerCase() ?? "a while"}, so "${step}" felt like a gentle place to begin. Small steps really do count.`;
}
