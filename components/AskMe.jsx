"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

// The "Ask me anything" chat in Contact. The browser never talks to Claude directly: it
// sends the conversation to this site's own /api/ask route (app/api/ask/route.js), which
// holds the API key and streams the answer back as plain text.

const suggestions = [
  "What has Priyanshu built?",
  "Is he open to internships?",
  "Has he worked with MongoDB?",
  "What does he do at GDG?",
];

const MAX_CHARS = 500;

export default function AskMe() {
  const [messages, setMessages] = useState([]); // { role: "user" | "assistant", content, error? }
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const abortRef = useRef(null);
  const logRef = useRef(null);

  // Keep the newest message in view as answers stream in
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  // Stop any answer still streaming if the visitor leaves the page
  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(question) {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);

    const history = [...messages.filter((m) => !m.error), { role: "user", content: q }];
    // Show the question right away, and an empty answer for the stream to fill
    setMessages([...history, { role: "assistant", content: "" }]);

    const controller = new AbortController();
    abortRef.current = controller;

    // Appends to the answer being written (always the last message)
    const append = (chunk, error = false) =>
      setMessages((prev) => {
        const next = prev.slice();
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + chunk, error: last.error || error };
        return next;
      });

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) }),
        signal: controller.signal,
      });
      if (!res.ok) {
        // 400, 429, 503: the route explains in one plain sentence
        append((await res.text()) || "Something went wrong. Please try again.", true);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        append(decoder.decode(value, { stream: true }));
      }
    } catch (error) {
      if (error.name !== "AbortError") append("Couldn't reach the chat. Check your connection and try again.", true);
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    ask(input);
  }

  const started = messages.length > 0;

  return (
    <div className="mt-16 rounded-3xl border border-foreground/10 bg-gradient-to-b from-foreground/[0.06] to-foreground/[0.02] p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-xs font-medium uppercase tracking-widest text-accent">Ask me anything</h3>
        <p className="text-xs text-foreground/40">Answers come from my resume and this site. Powered by Claude.</p>
      </div>
      <p className="mt-2 max-w-xl text-sm text-foreground/60">
        Not sure if I fit the role? Ask here first. It answers like I would, from my resume, and says so when it doesn&apos;t know.
      </p>

      {/* The conversation. role="log" + aria-live tells screen readers to announce new
          answers as they arrive, without stealing focus from the input. */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className={`mt-6 flex max-h-96 flex-col gap-3 overflow-y-auto scroll-smooth pr-1 ${started ? "" : "hidden"}`}
      >
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "self-end rounded-br-md bg-accent text-background"
                : m.error
                  ? "self-start rounded-bl-md border border-foreground/10 text-foreground/50"
                  : "self-start rounded-bl-md bg-foreground/[0.07] text-foreground/90"
            }`}
          >
            {m.content || (
              // Three dots while the first words are on their way
              <span className="inline-flex gap-1 py-1" aria-label="Thinking">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.2 }}
                    className="size-1.5 rounded-full bg-foreground/60"
                  />
                ))}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Starter questions, until the visitor asks their own */}
      {!started && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => ask(s)}
                className="rounded-full border border-foreground/15 bg-foreground/5 px-3.5 py-1.5 text-sm transition-colors hover:border-accent/60 hover:text-accent"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <label htmlFor="ask-input" className="sr-only">
          Your question
        </label>
        <input
          id="ask-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Ask about my projects, skills or availability"
          autoComplete="off"
          maxLength={MAX_CHARS}
          disabled={busy}
          className="min-w-0 flex-1 rounded-full border border-foreground/15 bg-background/60 px-4 py-2.5 text-sm placeholder:text-foreground/35 focus:border-accent/60 focus:outline-none disabled:opacity-60"
        />
        {busy ? (
          <button
            type="button"
            onClick={() => abortRef.current?.abort()}
            className="rounded-full border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/10"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-40"
          >
            Ask
          </button>
        )}
      </form>
    </div>
  );
}
