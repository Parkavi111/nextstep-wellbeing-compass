import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { OPTIONS, needsHumanSupport, pickStep, type Answers, type Option } from "@/lib/nextstep";
import { getWhy } from "@/lib/why.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NextStep by YourDOST — find your next step" },
      { name: "description", content: "Answer 4 quick questions and get one gentle next step for your wellbeing." },
      { property: "og:title", content: "NextStep by YourDOST" },
      { property: "og:description", content: "Not sure what to do next? Answer 4 quick questions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const QUESTIONS: { key: keyof Answers; q: string; opts: string[] }[] = [
  { key: "feeling", q: "How are you feeling most days lately?", opts: ["Calm", "Stressed", "Low", "Overwhelmed"] },
  { key: "duration", q: "How long has this been going on?", opts: ["Few days", "Few weeks", "Months"] },
  { key: "impact", q: "Is it affecting your sleep or work?", opts: ["Not really", "A little", "A lot"] },
  { key: "need", q: "What would help right now?", opts: ["Talk to someone", "Learn something", "Just relax", "Not sure"] },
];

type Screen = "welcome" | "q" | "text" | "loading" | "result" | "support";

function Index() {
  const why = useServerFn(getWhy);
  const [screen, setScreen] = useState<Screen>("welcome");
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [text, setText] = useState(""); // in memory only, never stored or sent
  const [step, setStep] = useState<Option | null>(null);
  const [reason, setReason] = useState("");
  const [showOthers, setShowOthers] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const restart = () => {
    setScreen("welcome"); setI(0); setAnswers({}); setText(""); setStep(null);
    setReason(""); setShowOthers(false); setFeedback(null);
  };

  const answer = (v: string) => {
    const next = { ...answers, [QUESTIONS[i]!.key]: v } as Answers;
    setAnswers(next);
    if (i < QUESTIONS.length - 1) setI(i + 1);
    else setScreen("text");
  };

  const finish = async () => {
    if (needsHumanSupport(answers, text)) {
      setText("");
      setScreen("support");
      return;
    }
    setText("");
    const s = pickStep(answers);
    setStep(s);
    setScreen("loading");
    try {
      const r = await why({ data: { answers, step: s } });
      setReason(r.why);
    } catch {
      setReason("This felt like a gentle, doable place to start. Small steps really do count.");
    }
    setScreen("result");
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col">
        <header className="mb-10 flex items-center justify-between">
          <span className="font-display text-xl text-primary">NextStep</span>
          <span className="text-xs text-muted-foreground">by YourDOST</span>
        </header>

        {screen === "welcome" && (
          <section className="flex flex-1 flex-col justify-center gap-8 animate-in fade-in">
            <h1 className="font-display text-4xl leading-tight text-foreground">Not sure what to do next?</h1>
            <p className="text-lg text-muted-foreground">Answer 4 quick questions.</p>
            <button className="btn-calm" onClick={() => setScreen("q")}>Start</button>
            <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
              This is not a diagnosis. For emergencies, call a helpline.
            </p>
          </section>
        )}

        {screen === "q" && (
          <section key={i} className="flex flex-1 flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-2">
              {QUESTIONS.map((_, n) => (
                <div key={n} className={`h-1.5 flex-1 rounded-full ${n <= i ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
            <h2 className="font-display text-3xl leading-snug text-foreground">{QUESTIONS[i]!.q}</h2>
            <div className="flex flex-col gap-3">
              {QUESTIONS[i]!.opts.map((o) => (
                <button key={o} className="btn-option" onClick={() => answer(o)}>{o}</button>
              ))}
            </div>
            {i > 0 && (
              <button className="text-sm text-muted-foreground underline" onClick={() => setI(i - 1)}>Back</button>
            )}
          </section>
        )}

        {screen === "text" && (
          <section className="flex flex-1 flex-col gap-6 animate-in fade-in">
            <h2 className="font-display text-3xl text-foreground">Anything else you want to share?</h2>
            <p className="text-sm text-muted-foreground">Optional. This is never saved.</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="rounded-2xl border border-input bg-card p-4 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
              placeholder="Type here, or skip…"
            />
            <button className="btn-calm" onClick={finish}>See my next step</button>
          </section>
        )}

        {screen === "loading" && (
          <section className="flex flex-1 items-center justify-center">
            <div className="h-16 w-16 animate-pulse rounded-full bg-accent" />
          </section>
        )}

        {screen === "result" && step && (
          <section className="flex flex-1 flex-col gap-6 animate-in fade-in">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Your next step</p>
            <div className="rounded-3xl bg-card p-6 shadow-soft">
              <h2 className="font-display text-3xl leading-snug text-foreground">{step}</h2>
              <p className="mt-4 text-sm font-semibold text-primary">Why this was suggested</p>
              <p className="mt-1 text-base text-muted-foreground">{reason}</p>
            </div>
            <button className="btn-calm">Start: {step}</button>
            <button className="btn-option" onClick={() => setShowOthers((v) => !v)}>Pick something else</button>
            {showOthers && (
              <div className="flex flex-col gap-3">
                {OPTIONS.filter((o) => o !== step).slice(0, 2).map((o) => (
                  <button key={o} className="btn-option" onClick={() => { setStep(o); setShowOthers(false); setReason("A good choice — go with what feels right for you today."); }}>{o}</button>
                ))}
              </div>
            )}
            <div className="mt-4 rounded-2xl bg-muted p-5 text-center">
              {feedback ? (
                <p className="text-foreground">Thank you for telling us.</p>
              ) : (
                <>
                  <p className="mb-3 text-foreground">Was this helpful?</p>
                  <div className="flex gap-3">
                    <button className="btn-option flex-1" onClick={() => setFeedback("yes")}>Yes</button>
                    <button className="btn-option flex-1" onClick={() => setFeedback("no")}>No</button>
                  </div>
                </>
              )}
            </div>
            <button className="text-sm text-muted-foreground underline" onClick={restart}>Start over</button>
          </section>
        )}

        {screen === "support" && (
          <section className="flex flex-1 flex-col justify-center gap-6 text-center animate-in fade-in">
            <div className="mx-auto h-20 w-20 rounded-full bg-accent" />
            <h2 className="font-display text-3xl leading-snug text-foreground">You deserve support from a person right now</h2>
            <p className="text-muted-foreground">You don't have to figure this out alone. A trained counselor can listen.</p>
            <button className="btn-calm">Talk to a counselor now</button>
            <p className="rounded-2xl bg-muted p-4 text-foreground">
              Helpline: <span className="font-semibold">[Helpline number]</span>
            </p>
            <button className="text-sm text-muted-foreground underline" onClick={restart}>Go back to start</button>
          </section>
        )}
      </div>
    </main>
  );
}
