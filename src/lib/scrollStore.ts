/**
 * Scroll velocity, shared without React.
 *
 * Effects that react to scroll speed (skewing type, stretching a marquee)
 * need a fresh number every frame. Putting that in React state would trigger
 * a re-render per frame and guarantee dropped frames — exactly what we're
 * trying to avoid.
 *
 * So the value lives in a module-level object. Lenis writes to it; consumers
 * read it inside their own rAF or GSAP ticker and drive a MotionValue or a
 * style directly, never through React.
 */

export const scrollState = {
  /** Pixels per frame, signed. Positive means scrolling down. */
  velocity: 0,
  /** `velocity` normalised to roughly -1…1 for easy use in transforms. */
  normalized: 0,
  /** 1 down, -1 up, 0 at rest. */
  direction: 0 as -1 | 0 | 1,
};

/** Above this, Lenis is mid-fling rather than settling. */
const MAX_VELOCITY = 40;

export function setScrollVelocity(velocity: number) {
  scrollState.velocity = velocity;
  scrollState.normalized = Math.max(-1, Math.min(1, velocity / MAX_VELOCITY));
  scrollState.direction = velocity > 0.1 ? 1 : velocity < -0.1 ? -1 : 0;
}

export function resetScrollVelocity() {
  scrollState.velocity = 0;
  scrollState.normalized = 0;
  scrollState.direction = 0;
}
