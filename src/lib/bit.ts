"use client";

/** Lets any component make Bit, the mascot, say something. */
export const BIT_EVENT = "bit:say";

export type BitMood = "idle" | "wave" | "think" | "party";

export function say(text: string, mood: BitMood = "idle") {
  window.dispatchEvent(new CustomEvent(BIT_EVENT, { detail: { text, mood } }));
}
