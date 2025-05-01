import { atom, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { extract_glyphs_WASM, get_glyph_index_map_WASM, is_loaded_WASM, load_WASM, open_font_WASM } from "./wasm/glyph_module";

export const fileLoaded = atom(false);
export const filename = atom("");
export const glyphs = atomWithImmer({});
export const index_map = atomWithImmer({});
