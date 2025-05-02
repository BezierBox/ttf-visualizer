import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export const fileLoaded = atom(false);
export const filename = atom("");
export const glyf = atomWithImmer({});
export const index_map = atomWithImmer({});

export const glyf_nums = atom((get) => {
  const glyphs = get(glyf);

  return Object.keys(glyphs).map((val) => parseInt(val));
});