/**
 * Reservation submission — the seam for a real booking backend.
 *
 * Right now this resolves locally and sends nothing anywhere. That is a
 * deliberate, agreed interim state, but it means **no reservation made
 * through this form reaches the restaurant**. The UI must therefore never
 * tell a customer their table is confirmed; it tells them the request is
 * noted and asks them to ring to confirm. See ReservationForm.
 *
 * To make it real, replace the body of `submitReservation` with a POST to a
 * route handler (or an email service such as Resend). Nothing that renders
 * needs to change.
 */

export interface ReservationRequest {
  guests: number;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  /** 24h `HH:MM`. */
  time: string;
  name: string;
  phone: string;
  notes?: string;
}

export type ReservationResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

/** Human-readable reference so a caller can quote it on the phone. */
function makeReference(req: ReservationRequest): string {
  const day = req.date.replaceAll("-", "").slice(4); // MMDD
  const time = req.time.replace(":", "");
  return `LW-${day}-${time}`;
}

export async function submitReservation(
  req: ReservationRequest
): Promise<ReservationResult> {
  // Simulated latency, so the pending state is exercised in development and
  // the button's disabled/spinner path is real rather than theoretical.
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (!req.name.trim() || !req.phone.trim() || !req.date || !req.time) {
    return { ok: false, error: "Some details are missing." };
  }

  // TODO(backend): POST to /api/reservations. Nothing is transmitted today.
  return { ok: true, reference: makeReference(req) };
}

/** Party sizes offered as one-tap choices. Larger parties are told to ring. */
export const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

/**
 * Service times. NEEDS-CONFIRMATION: the owner has not supplied real opening
 * hours, so this is a plausible range rather than a verified one — which is
 * exactly why the form asks the customer to ring to confirm.
 */
export function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let minutes = 12 * 60; minutes <= 22 * 60; minutes += 30) {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}

/** `YYYY-MM-DD` for today, in the visitor's own timezone. */
export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function formatDateLong(iso: string): string {
  if (!iso) return "";
  // Parsed as local midnight, not UTC, so the date never shifts a day.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
