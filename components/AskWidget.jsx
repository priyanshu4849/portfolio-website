"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import PixelBuddy from "./PixelBuddy";

// The "Ask me anything" chat, as a little character in the bottom right corner of every
// page. Click it (or its "ask me?" bubble) and a chat panel opens above it. The character's
// face follows what's happening: it thinks while waiting for an answer, talks while the
// answer streams in, smiles when done, and looks sorry when something goes wrong.
//
// The browser never talks to Claude directly: it sends the conversation to this site's own
// /api/ask route (app/api/ask/route.js), which holds the API key and streams the answer
// back as plain text.

const suggestions = [
  "What has Priyanshu built?",
  "Is he open to internships?",
  "Has he worked with MongoDB?",
  "What does he do at GDG?",
];

const MAX_CHARS = 500;

// Whether the character should be on screen. On the home page it stays hidden until the
// visitor has scrolled past the hero, whose buttons sit in the same corner. Other pages
// (like the 404) show it at once. Read through useSyncExternalStore so the first render
// in the browser matches the server's HTML (hidden), with no flash.
function subscribeScroll(onChange) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
function pastHero() {
  return (
    !document.getElementById("hero") ||
    window.scrollY > window.innerHeight * 0.5
  );
}

export default function AskWidget() {
  const shown = useSyncExternalStore(subscribeScroll, pastHero, () => false); // the character is on screen
  const [open, setOpen] = useState(false); // the chat panel is open
  const [bubbleReady, setBubbleReady] = useState(false); // a moment has passed since the character appeared
  const [everOpened, setEverOpened] = useState(false);
  const [hover, setHover] = useState(false);
  const [mood, setMood] = useState("idle");
  const [messages, setMessages] = useState([]); // { role, content, error? }
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const abortRef = useRef(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const moodTimer = useRef(null);

  // The speech bubble appears a moment after the character does, and goes away for good
  // once the chat has been opened.
  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setBubbleReady(true), 1200);
    return () => clearTimeout(t);
  }, [shown]);
  const bubble = bubbleReady && !open && !everOpened;

  // Opening: focus the input. Closing: put focus back on the character. Esc closes.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest message in view as answers stream in
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, open]);

  // Stop any answer still streaming if the visitor leaves the page
  useEffect(() => () => abortRef.current?.abort(), []);

  function openChat() {
    setOpen(true);
    setEverOpened(true);
  }

  function close() {
    setOpen(false);
    launcherRef.current?.focus();
  }

  // A mood that goes back to idle on its own after a moment (the smile, the sorry face)
  const flash = useCallback((m, ms) => {
    clearTimeout(moodTimer.current);
    setMood(m);
    moodTimer.current = setTimeout(() => setMood("idle"), ms);
  }, []);

  async function ask(question) {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    clearTimeout(moodTimer.current);
    setMood("thinking");

    const history = [
      ...messages.filter((m) => !m.error),
      { role: "user", content: q },
    ];
    // Show the question right away, and an empty answer for the stream to fill
    setMessages([...history, { role: "assistant", content: "" }]);

    const controller = new AbortController();
    abortRef.current = controller;

    // Appends to the answer being written (always the last message)
    const append = (chunk, error = false) =>
      setMessages((prev) => {
        const next = prev.slice();
        const last = next[next.length - 1];
        next[next.length - 1] = {
          ...last,
          content: last.content + chunk,
          error: last.error || error,
        };
        return next;
      });

    let ok = false;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) }),
        signal: controller.signal,
      });
      if (!res.ok) {
        // 400, 429, 503: the route explains in one plain sentence
        append(
          (await res.text()) || "Something went wrong. Please try again.",
          true,
        );
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let first = true;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        if (first) {
          setMood("talking");
          first = false;
        }
        append(decoder.decode(value, { stream: true }));
      }
      ok = true;
    } catch (error) {
      if (error.name === "AbortError")
        ok = true; // the visitor pressed Stop: not a problem
      else
        append(
          "Couldn't reach the chat. Check your connection and try again.",
          true,
        );
    } finally {
      setBusy(false);
      abortRef.current = null;
      if (ok) flash("happy", 2500);
      else flash("sad", 3000);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    ask(input);
  }

  const started = messages.length > 0;
  const face = hover && mood === "idle" && !open ? "happy" : mood;

  return (
    <>
      {/* The chat panel */}
      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            role="dialog"
            aria-label="Ask me anything"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 bottom-24 z-40 flex max-h-[min(34rem,calc(100svh-7.5rem))] origin-bottom-right flex-col rounded-3xl border border-foreground/10 bg-background/95 shadow-2xl shadow-black/60 backdrop-blur-md sm:inset-x-auto sm:right-6 sm:w-96"
          >
            <header className="flex items-center gap-3 border-b border-foreground/10 px-5 py-3">
              <PixelBuddy mood={face} size={28} />
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold">Ask me anything</h2>
                <p className="truncate text-xs text-foreground/40">
                  From my resume and this site · Claude
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="flex size-8 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </header>

            {/* The conversation. role="log" + aria-live tells screen readers to announce new
                answers as they arrive, without stealing focus from the input. */}
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto scroll-smooth px-5 py-4"
            >
              {!started && (
                <>
                  <p className="text-sm text-foreground/60">
                    Hi, I&apos;m the chat on Priyanshu&apos;s site. Ask about
                    his projects, skills or availability. If I don&apos;t know,
                    I&apos;ll say so.
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => ask(s)}
                          className="rounded-full border border-foreground/15 bg-foreground/5 px-3 py-1.5 text-xs transition-colors hover:border-accent/60 hover:text-accent"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "self-end rounded-br-md bg-accent text-background"
                      : m.error
                        ? "self-start rounded-bl-md border border-foreground/10 text-foreground/50"
                        : "self-start rounded-bl-md bg-foreground/[0.07] text-foreground/90"
                  }`}
                >
                  {m.content || (
                    // Three dots while the first words are on their way
                    <span
                      className="inline-flex gap-1 py-1"
                      aria-label="Thinking"
                    >
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: d * 0.2,
                          }}
                          className="size-1.5 rounded-full bg-foreground/60"
                        />
                      ))}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex gap-2 border-t border-foreground/10 p-3"
            >
              <label htmlFor="ask-input" className="sr-only">
                Your question
              </label>
              <input
                ref={inputRef}
                id="ask-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Ask about my projects, skills or availability"
                autoComplete="off"
                maxLength={MAX_CHARS}
                disabled={busy}
                className="min-w-0 flex-1 rounded-full border border-foreground/15 bg-foreground/5 px-4 py-2 text-sm placeholder:text-foreground/35 focus:border-accent/60 focus:outline-none disabled:opacity-60"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  className="rounded-full border border-foreground/15 bg-foreground/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/10"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-40"
                >
                  Ask
                </button>
              )}
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* The character in the corner, with its speech bubble. It's always in the page (so
          it's in the server's HTML too) and pops in once `shown` turns true; while hidden
          it can't be clicked, tabbed to, or read out. */}
      <motion.div
        initial={false}
        animate={
          shown
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 24, scale: 0.8 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        aria-hidden={!shown}
        className={`fixed right-4 bottom-4 z-40 flex items-end gap-2 sm:right-6 sm:bottom-6 ${shown ? "" : "pointer-events-none"}`}
      >
        <AnimatePresence>
          {bubble && (
            <motion.button
              key="bubble"
              type="button"
              onClick={openChat}
              tabIndex={-1}
              aria-hidden="true"
              initial={{ opacity: 0, x: 8, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-5 rounded-xl bg-foreground px-3 py-1.5 font-display text-sm font-bold text-background after:absolute after:top-1/2 after:-right-1.5 after:size-3 after:-translate-y-1/2 after:rotate-45 after:rounded-sm after:bg-foreground"
            >
              ask me?
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          ref={launcherRef}
          type="button"
          onClick={() => (open ? close() : openChat())}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          aria-label={open ? "Close chat" : "Ask me anything"}
          aria-expanded={open}
          aria-haspopup="dialog"
          tabIndex={shown ? 0 : -1}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          // A slow bob while it waits, like it's breathing
          animate={mood === "idle" && !open ? { y: [0, -3, 0] } : { y: 0 }}
          transition={{
            y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          <PixelBuddy
            mood={face}
            size={64}
            className="drop-shadow-[0_6px_16px_rgba(232,178,143,0.35)]"
          />
        </motion.button>
      </motion.div>
    </>
  );
}
