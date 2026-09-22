// src/components/reserve/ReservationForm.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, Phone, Loader2, ArrowRight } from "lucide-react";
import {
  submitReservation,
  getTimeSlots,
  todayISO,
  formatDateLong,
  PARTY_SIZES,
  type ReservationRequest,
} from "@/lib/reservations";
import { site, telHref } from "@/lib/site";
import { EASE_LAHORI } from "@/lib/motion";

/**
 * Three-step booking request.
 *
 * IMPORTANT: `submitReservation` sends nothing anywhere yet. The final screen
 * therefore says the table is *not held* and asks the customer to ring. It
 * must never claim a confirmed booking — people would arrive at a restaurant
 * that had never heard of them. Change that wording only with a real backend.
 *
 * Mobile-first: one question per screen, every control ≥48px, the date field
 * uses the native picker, and the step never scrolls sideways.
 */

type Step = 0 | 1 | 2;

const STEPS = ["When", "Who", "Done"] as const;

/** Next seven days as one-tap chips, so the common case needs no date picker. */
function useQuickDates() {
  return useMemo(() => {
    const out: { iso: string; weekday: string; day: string; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const offset = d.getTimezoneOffset() * 60000;
      out.push({
        iso: new Date(d.getTime() - offset).toISOString().slice(0, 10),
        weekday: i === 0 ? "Today" : i === 1 ? "Tmrw" : d.toLocaleDateString("en-GB", { weekday: "short" }),
        day: String(d.getDate()),
        label: d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }),
      });
    }
    return out;
  }, []);
}

function StepRail({ step }: { step: Step }) {
  return (
    <ol className="flex items-center gap-3" aria-label="Booking progress">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <span
                aria-current={active ? "step" : undefined}
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] tabular-nums transition-colors duration-300 ${
                  active
                    ? "border-brand-accent bg-brand-accent text-brand-base font-bold"
                    : done
                      ? "border-brand-green-light/60 text-brand-green-light"
                      : "border-brand-surface/35 text-brand-surface/55"
                }`}
              >
                {done ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={`font-body text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  active ? "text-brand-accent" : done ? "text-brand-surface/70" : "text-brand-surface/50"
                }`}
              >
                {label}
              </span>
            </span>
            {i < STEPS.length - 1 && <span className="w-6 h-px bg-brand-surface/20" />}
          </li>
        );
      })}
    </ol>
  );
}

function Chip({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`shrink-0 rounded-xl border font-body transition-colors duration-200 cursor-pointer ${
        selected
          ? "border-brand-accent bg-brand-accent text-brand-base font-semibold"
          : "border-brand-surface/30 bg-brand-surface/[0.03] text-brand-surface hover:border-brand-surface/45"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default function ReservationForm() {
  const reduceMotion = useReducedMotion() ?? false;
  const slots = useMemo(() => getTimeSlots(), []);
  const minDate = useMemo(() => todayISO(), []);
  const quickDates = useQuickDates();

  const [step, setStep] = useState<Step>(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const [form, setForm] = useState<ReservationRequest>({
    guests: 2,
    date: minDate,
    time: "19:00",
    name: "",
    phone: "",
    notes: "",
  });

  const set = useCallback(
    <K extends keyof ReservationRequest>(key: K, value: ReservationRequest[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
      setError(null);
    },
    []
  );

  const stepTwoValid = form.name.trim().length > 1 && form.phone.trim().length >= 7;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stepTwoValid || pending) return;

      setPending(true);
      setError(null);
      const result = await submitReservation(form);
      setPending(false);

      if (result.ok) {
        setReference(result.reference);
        setStep(2);
      } else {
        setError(result.error);
      }
    },
    [form, stepTwoValid, pending]
  );

  const slide = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -14 },
        transition: { duration: 0.35, ease: EASE_LAHORI },
      };

  const summary = `${form.guests} ${form.guests === 1 ? "guest" : "guests"} · ${formatDateLong(form.date)} · ${form.time}`;

  const inputClass =
    "w-full h-14 px-4 rounded-xl bg-brand-surface/[0.04] border border-brand-surface/30 " +
    "font-body text-base text-brand-surface placeholder:text-brand-surface/60 " +
    "focus:border-brand-accent focus:bg-brand-surface/[0.07] focus:outline-none transition-colors";

  return (
    <div className="w-full">
      <div className="mb-8">
        <StepRail step={step} />
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {step === 2 ? "Request noted" : `Step ${step + 1} of 3`}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <AnimatePresence mode="wait" initial={false}>
          {/* ---------------- Step 1: when ---------------- */}
          {step === 0 && (
            <motion.div key="s0" {...slide} className="space-y-8">
              <fieldset>
                <legend className="font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3.5">
                  How many of you?
                </legend>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {PARTY_SIZES.map((n) => (
                    <Chip key={n} selected={form.guests === n} onClick={() => set("guests", n)} className="h-13 py-3.5 text-base tabular-nums">
                      {n}
                    </Chip>
                  ))}
                </div>
                <p className="mt-3 font-body text-[11px] text-brand-muted">
                  More than eight?{" "}
                  <a href={telHref} className="text-brand-accent underline underline-offset-2">
                    Ring us
                  </a>{" "}
                  and we&rsquo;ll sort the room.
                </p>
              </fieldset>

              <fieldset>
                <legend className="font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3.5">
                  Which day?
                </legend>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {quickDates.map((d) => (
                    <Chip
                      key={d.iso}
                      selected={form.date === d.iso}
                      onClick={() => set("date", d.iso)}
                      className="py-2.5 flex flex-col items-center gap-0.5"
                    >
                      <span className="text-[9px] uppercase tracking-[0.12em] opacity-75">{d.weekday}</span>
                      <span className="text-lg leading-none tabular-nums">{d.day}</span>
                    </Chip>
                  ))}
                </div>

                <label htmlFor="res-date" className="mt-3 block">
                  <span className="sr-only">Or pick another date</span>
                  <input
                    id="res-date"
                    type="date"
                    value={form.date}
                    min={minDate}
                    onChange={(e) => set("date", e.target.value)}
                    className={inputClass}
                  />
                </label>
              </fieldset>

              <fieldset>
                <legend className="font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3.5">
                  What time?
                </legend>
                {/* A wrapping grid rather than a sideways scroller — a hidden
                    horizontal scrollbar on a phone means people never find the
                    later slots. */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {slots.map((slot) => (
                    <Chip key={slot} selected={form.time === slot} onClick={() => set("time", slot)} className="py-3 text-sm tabular-nums">
                      {slot}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 h-14 px-10 rounded-full
                  bg-brand-surface text-brand-base font-body text-[11px] uppercase tracking-[0.2em] font-semibold
                  hover:bg-brand-accent transition-colors duration-300 cursor-pointer"
              >
                Continue
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
              </button>
            </motion.div>
          )}

          {/* ---------------- Step 2: who ---------------- */}
          {step === 1 && (
            <motion.div key="s1" {...slide} className="space-y-6">
              <div className="rounded-xl border border-brand-accent/25 bg-brand-accent/[0.06] px-5 py-4">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-accent mb-1.5">Your table</p>
                <p className="font-heading italic text-lg sm:text-xl text-brand-surface">{summary}</p>
              </div>

              <div>
                <label htmlFor="res-name" className="block font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3">
                  Your name
                </label>
                <input id="res-name" type="text" required autoComplete="name" value={form.name}
                  onChange={(e) => set("name", e.target.value)} placeholder="Full name" className={inputClass} />
              </div>

              <div>
                <label htmlFor="res-phone" className="block font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3">
                  Phone number
                </label>
                <input id="res-phone" type="tel" required inputMode="tel" autoComplete="tel" value={form.phone}
                  onChange={(e) => set("phone", e.target.value)} placeholder="07…" className={inputClass} />
                <p className="mt-2 font-body text-[11px] text-brand-muted">We&rsquo;ll call you back on this number.</p>
              </div>

              <div>
                <label htmlFor="res-notes" className="block font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3">
                  Anything we should know?{" "}
                  <span className="text-brand-muted normal-case tracking-normal">(optional)</span>
                </label>
                <textarea id="res-notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)}
                  placeholder="Allergies, a birthday, a high chair…"
                  className="w-full px-4 py-3.5 rounded-xl bg-brand-surface/[0.04] border border-brand-surface/30
                    font-body text-base text-brand-surface placeholder:text-brand-surface/60
                    focus:border-brand-accent focus:outline-none transition-colors resize-none" />
              </div>

              {error && <p role="alert" className="font-body text-sm text-brand-hot">{error}</p>}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
                <button type="button" onClick={() => setStep(0)}
                  className="inline-flex items-center justify-center gap-2 h-14 px-7 rounded-full
                    border border-brand-surface/30 font-body text-[11px] uppercase tracking-[0.2em]
                    text-brand-surface hover:border-brand-accent hover:text-brand-accent
                    transition-colors duration-300 cursor-pointer">
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                  Back
                </button>

                <button type="submit" disabled={!stepTwoValid || pending}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 h-14 px-10 rounded-full
                    bg-brand-surface text-brand-base font-body text-[11px] uppercase tracking-[0.2em] font-semibold
                    hover:bg-brand-accent disabled:opacity-30 disabled:pointer-events-none
                    transition-colors duration-300 cursor-pointer">
                  {pending && <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />}
                  {pending ? "Sending…" : "Request this table"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ---------------- Step 3: done ---------------- */}
          {step === 2 && (
            <motion.div key="s2" {...slide} className="space-y-6">
              <div className="flex items-center gap-4">
                <motion.span
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: EASE_LAHORI }}
                  className="w-14 h-14 rounded-full bg-brand-green/20 border border-brand-green-light/40 flex items-center justify-center shrink-0"
                >
                  <Check className="w-6 h-6 text-brand-green-light" strokeWidth={2.5} />
                </motion.span>
                <div className="min-w-0">
                  <h2 className="font-heading italic text-2xl sm:text-3xl text-brand-surface leading-tight truncate">
                    Thank you, {form.name.trim().split(" ")[0]}.
                  </h2>
                  {reference && (
                    <p className="mt-1 font-body text-[11px] uppercase tracking-[0.18em] text-brand-muted">
                      Reference {reference}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-brand-surface/12 bg-brand-surface/[0.03] px-5 py-4">
                <p className="font-heading italic text-lg sm:text-xl text-brand-surface">{summary}</p>
              </div>

              {/* Deliberately does NOT say "confirmed" — nothing has reached the
                  restaurant, and a false confirmation strands people at the door. */}
              <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/[0.07] px-5 py-5">
                <p className="font-body text-sm leading-relaxed text-brand-surface/90">
                  Your table isn&rsquo;t held yet. Ring the restaurant to confirm it — one
                  minute on the phone and it&rsquo;s certain.
                </p>
                <a href={telHref}
                  className="mt-4 inline-flex items-center gap-2.5 h-12 px-6 rounded-full
                    bg-brand-accent text-brand-base font-body text-[11px] uppercase tracking-[0.2em] font-semibold
                    hover:bg-brand-surface transition-colors duration-300">
                  <Phone className="w-4 h-4" strokeWidth={2.5} />
                  {site.phone.display}
                </a>
              </div>

              <button type="button"
                onClick={() => {
                  setStep(0);
                  setReference(null);
                  setForm((f) => ({ ...f, name: "", phone: "", notes: "" }));
                }}
                className="font-body text-[11px] uppercase tracking-[0.2em] text-brand-muted hover:text-brand-accent transition-colors cursor-pointer">
                Book another table
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
