// src/components/reserve/ReservationForm.tsx
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, Phone, Users, CalendarDays, Clock, Loader2 } from "lucide-react";
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
 * IMPORTANT: `submitReservation` currently sends nothing anywhere. The final
 * screen therefore says the request is *noted* and asks the customer to ring
 * to confirm — it must never claim a table is held. If this shipped saying
 * "confirmed", people would arrive to a restaurant that had never heard of
 * them. Change that wording only when a real backend is wired up.
 *
 * Mobile-first: every control is a ≥44px tap target, the date field uses the
 * native picker, and steps are full-width rather than a cramped multi-column
 * form.
 */

type Step = 0 | 1 | 2;

const STEPS = ["Table", "Details", "Done"] as const;

function StepDots({ step }: { step: Step }) {
  return (
    <ol className="flex items-center gap-2.5" aria-label="Booking progress">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex items-center gap-2.5">
            <span
              aria-current={active ? "step" : undefined}
              className={`flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                active ? "text-brand-accent" : done ? "text-brand-surface/60" : "text-brand-surface/30"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] tabular-nums ${
                  active
                    ? "border-brand-accent text-brand-accent"
                    : done
                      ? "border-brand-green-light/50 text-brand-green-light"
                      : "border-brand-surface/25"
                }`}
              >
                {done ? <Check className="w-2.5 h-2.5" strokeWidth={3} /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </span>
            {i < STEPS.length - 1 && <span className="w-5 h-px bg-brand-surface/20" />}
          </li>
        );
      })}
    </ol>
  );
}

function FieldLabel({ children, icon: Icon }: { children: React.ReactNode; icon: typeof Users }) {
  return (
    <span className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3">
      <Icon className="w-3.5 h-3.5" strokeWidth={2} />
      {children}
    </span>
  );
}

export default function ReservationForm() {
  const reduceMotion = useReducedMotion() ?? false;
  const slots = useMemo(() => getTimeSlots(), []);
  const minDate = useMemo(() => todayISO(), []);
  const liveRegion = useRef<HTMLParagraphElement>(null);

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

  const set = useCallback(<K extends keyof ReservationRequest>(key: K, value: ReservationRequest[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }, []);

  const stepOneValid = Boolean(form.date && form.time && form.guests);
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
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
        transition: { duration: 0.38, ease: EASE_LAHORI },
      };

  return (
    <div className="w-full max-w-[640px]">
      <div className="mb-8">
        <StepDots step={step} />
      </div>

      {/* Announces step changes and errors to screen readers. */}
      <p ref={liveRegion} role="status" aria-live="polite" className="sr-only">
        {step === 2 ? "Request noted" : `Step ${step + 1} of 3`}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <AnimatePresence mode="wait" initial={false}>
          {/* ---------------- Step 1 ---------------- */}
          {step === 0 && (
            <motion.div key="step-0" {...slide} className="space-y-9">
              <fieldset>
                <legend className="sr-only">Number of guests</legend>
                <FieldLabel icon={Users}>How many of you?</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {PARTY_SIZES.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => set("guests", n)}
                      aria-pressed={form.guests === n}
                      className={`min-w-[52px] h-12 px-4 rounded-full border font-body text-sm tabular-nums transition-colors duration-250 cursor-pointer ${
                        form.guests === n
                          ? "border-brand-accent bg-brand-accent text-brand-base font-semibold"
                          : "border-brand-surface/20 text-brand-surface hover:border-brand-surface/45"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="mt-3 font-body text-[11px] text-brand-muted">
                  More than eight?{" "}
                  <a href={telHref} className="text-brand-accent underline underline-offset-2">
                    Give us a ring
                  </a>{" "}
                  and we&rsquo;ll sort the room out.
                </p>
              </fieldset>

              <div>
                <label htmlFor="res-date" className="block">
                  <FieldLabel icon={CalendarDays}>Which day?</FieldLabel>
                </label>
                <input
                  id="res-date"
                  type="date"
                  value={form.date}
                  min={minDate}
                  onChange={(e) => set("date", e.target.value)}
                  className="w-full h-14 px-4 rounded-xl bg-brand-raise border border-brand-surface/20
                    font-body text-base text-brand-surface
                    focus:border-brand-accent focus:outline-none transition-colors
                    [color-scheme:dark]"
                />
              </div>

              <fieldset>
                <legend className="sr-only">Arrival time</legend>
                <FieldLabel icon={Clock}>What time?</FieldLabel>
                <div
                  data-lenis-prevent
                  className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1
                    [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => set("time", slot)}
                      aria-pressed={form.time === slot}
                      className={`shrink-0 h-12 px-4 rounded-full border font-body text-sm tabular-nums transition-colors duration-250 cursor-pointer ${
                        form.time === slot
                          ? "border-brand-accent bg-brand-accent text-brand-base font-semibold"
                          : "border-brand-surface/20 text-brand-surface hover:border-brand-surface/45"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </fieldset>

              <button
                type="button"
                onClick={() => stepOneValid && setStep(1)}
                disabled={!stepOneValid}
                className="w-full sm:w-auto h-14 px-10 rounded-full bg-brand-surface text-brand-base
                  font-body text-[11px] uppercase tracking-[0.2em] font-semibold
                  hover:bg-brand-accent disabled:opacity-30 disabled:pointer-events-none
                  transition-colors duration-300 cursor-pointer"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* ---------------- Step 2 ---------------- */}
          {step === 1 && (
            <motion.div key="step-1" {...slide} className="space-y-7">
              <div className="rounded-xl border border-brand-surface/12 bg-brand-raise px-5 py-4">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-muted mb-1.5">
                  Your table
                </p>
                <p className="font-heading italic text-xl text-brand-surface">
                  {form.guests} {form.guests === 1 ? "guest" : "guests"} · {formatDateLong(form.date)} ·{" "}
                  {form.time}
                </p>
              </div>

              <div>
                <label htmlFor="res-name" className="block font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3">
                  Your name
                </label>
                <input
                  id="res-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Full name"
                  className="w-full h-14 px-4 rounded-xl bg-brand-raise border border-brand-surface/20
                    font-body text-base text-brand-surface placeholder:text-brand-surface/30
                    focus:border-brand-accent focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="res-phone" className="block font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3">
                  Phone number
                </label>
                <input
                  id="res-phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="07…"
                  className="w-full h-14 px-4 rounded-xl bg-brand-raise border border-brand-surface/20
                    font-body text-base text-brand-surface placeholder:text-brand-surface/30
                    focus:border-brand-accent focus:outline-none transition-colors"
                />
                <p className="mt-2 font-body text-[11px] text-brand-muted">
                  We&rsquo;ll call you back on this number to confirm.
                </p>
              </div>

              <div>
                <label htmlFor="res-notes" className="block font-body text-[10px] uppercase tracking-[0.22em] text-brand-accent mb-3">
                  Anything we should know? <span className="text-brand-muted normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  id="res-notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Allergies, a birthday, a high chair…"
                  className="w-full px-4 py-3.5 rounded-xl bg-brand-raise border border-brand-surface/20
                    font-body text-base text-brand-surface placeholder:text-brand-surface/30
                    focus:border-brand-accent focus:outline-none transition-colors resize-none"
                />
              </div>

              {error && (
                <p role="alert" className="font-body text-sm text-orange-300">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="inline-flex items-center justify-center gap-2 h-14 px-7 rounded-full
                    border border-brand-surface/25 font-body text-[11px] uppercase tracking-[0.2em]
                    text-brand-surface hover:border-brand-accent hover:text-brand-accent
                    transition-colors duration-300 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={!stepTwoValid || pending}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 h-14 px-10 rounded-full
                    bg-brand-surface text-brand-base font-body text-[11px] uppercase tracking-[0.2em] font-semibold
                    hover:bg-brand-accent disabled:opacity-30 disabled:pointer-events-none
                    transition-colors duration-300 cursor-pointer"
                >
                  {pending && <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />}
                  {pending ? "Sending…" : "Request this table"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ---------------- Step 3 ---------------- */}
          {step === 2 && (
            <motion.div key="step-2" {...slide} className="space-y-7">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-full bg-brand-green/20 border border-brand-green-light/40 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-brand-green-light" strokeWidth={2.5} />
                </span>
                <div>
                  <h2 className="font-heading italic text-2xl sm:text-3xl text-brand-surface leading-tight">
                    Thank you, {form.name.split(" ")[0]}.
                  </h2>
                  {reference && (
                    <p className="mt-1 font-body text-[11px] uppercase tracking-[0.18em] text-brand-muted">
                      Reference {reference}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-brand-surface/12 bg-brand-raise px-5 py-4">
                <p className="font-heading italic text-xl text-brand-surface">
                  {form.guests} {form.guests === 1 ? "guest" : "guests"} · {formatDateLong(form.date)} ·{" "}
                  {form.time}
                </p>
              </div>

              {/* Deliberately does NOT say "confirmed". Nothing has been sent to
                  the restaurant yet, and telling someone their table is held
                  when it isn't would leave them stranded at the door. */}
              <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/[0.07] px-5 py-4">
                <p className="font-body text-sm leading-relaxed text-brand-surface/90">
                  Your table isn&rsquo;t held yet. Please ring the restaurant to confirm it — it
                  takes a minute and your table is certain.
                </p>
                <a
                  href={telHref}
                  className="mt-4 inline-flex items-center gap-2.5 h-12 px-6 rounded-full
                    bg-brand-accent text-brand-base font-body text-[11px] uppercase tracking-[0.2em] font-semibold
                    hover:bg-brand-surface transition-colors duration-300"
                >
                  <Phone className="w-4 h-4" strokeWidth={2.5} />
                  {site.phone.display}
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setReference(null);
                  setForm((f) => ({ ...f, name: "", phone: "", notes: "" }));
                }}
                className="font-body text-[11px] uppercase tracking-[0.2em] text-brand-muted hover:text-brand-accent transition-colors cursor-pointer"
              >
                Book another table
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
