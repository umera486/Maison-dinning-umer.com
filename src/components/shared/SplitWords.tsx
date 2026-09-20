// src/components/shared/SplitWords.tsx
"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { wordUp } from "@/lib/motion";

/**
 * Per-word motion typography, without destroying the text.
 *
 * The obvious implementation — `text.split(" ").map(w => <span>{w}</span>)`
 * with a margin for spacing — produces markup whose text content reads
 * "Lahore,cookedinNorbury." Every space is thrown away by `split` and faked
 * with CSS, so screen readers, search engines, translation tools and
 * copy-paste all get one run-on word.
 *
 * Here each word keeps a real space text node between the mask wrappers, so
 * the DOM reads "Lahore, cooked in Norbury." and the spacing is the natural
 * word space rather than a margin.
 *
 * Must be rendered inside a parent carrying a `stagger()` variant.
 */
export default function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="reveal-mask inline-block align-bottom">
            <motion.span variants={wordUp} className="inline-block transform-gpu">
              {word}
            </motion.span>
          </span>
          {/* A real space, outside the clipping wrapper so it is never cut. */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
