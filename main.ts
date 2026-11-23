// One Emoji, One Smile — a program that writes the single emoji
// most likely to make a stranger smile to /output/entry.txt.
//
// The emoji is a fixed string on purpose: the entry is judged on the
// writing, so the program's job is to deliver exactly that emoji, byte
// for byte, every run.

import { mkdirSync, writeFileSync } from "node:fs";

// Why this emoji, against the judge's brief:
// - It is warm at first glance: open arms offering a hug read as kind
//   and friendly with no context needed, the kind of thing that makes
//   a stranger smile.
// - It is universal: a hug gesture reads the same at any age and in
//   any background, with no irony, in-joke or sarcasm that could land
//   wrong.
// - It feels chosen, not default: it is not the first plain smiley
//   that comes to mind, yet it stays instantly readable at a glance.
// - It is right for a stranger: a welcoming hug is warm without any
//   intimacy or flirtation that would read oddly from someone unknown.
const EMOJI = "🤗";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function main(): void {
  // The gate only accepts 1 to 8 characters of UTF-8 text, so refuse
  // loudly instead of shipping text the gate would throw away. Count
  // code points, not UTF-16 units, so one emoji counts as one.
  const chars = [...EMOJI];
  if (chars.length < 1 || chars.length > 8) {
    throw new Error(`entry must be 1-8 characters, got ${chars.length}`);
  }
  if (EMOJI.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  // The entry must be exactly one emoji: one grapheme, no words, no
  // caption, no trailing newline — the gate counts every byte.
  if (chars.length !== 1) {
    throw new Error(`entry must be exactly one emoji, got ${chars.length} characters`);
  }
  // An exact tie on judge win rate goes to the smaller text, so keep
  // the entry at one emoji and nothing else: 4 bytes, the smallest a
  // single emoji outside the basic planes can be.
  if (Buffer.byteLength(EMOJI, "utf8") !== 4) {
    throw new Error(`entry must be one emoji (4 bytes), got ${Buffer.byteLength(EMOJI, "utf8")} bytes`);
  }
  // /output is a mount point in the grader sandbox: never delete the
  // directory itself, only create it if missing and write the file.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, EMOJI, "utf8");
  console.log(`Wrote ${chars.length} character to ${OUT_FILE}`);
}

main();
