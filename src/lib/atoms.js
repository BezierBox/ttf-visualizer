import { atom, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { extract_glyphs_WASM, get_glyph_index_map_WASM, load_WASM, open_font_WASM } from "./wasm/glyph_module";

export const fileLoaded = atom(false);
export const filename = atom("");
export const glyphs = atomWithImmer({});
export const index_map = atomWithImmer({});

export const open_font = async (file) => {
  if (!is_loaded) {
    load_WASM();
  }

  open_font_WASM(file);
  const glyf = extract_glyphs_WASM();
  const indices = get_glyph_index_map_WASM();

  const [, setLoaded] = useAtom(fileLoaded);
  setLoaded((draft) => { return true });

  const [, setName] = useAtom(filename);
  setName((draft) => { return file.name });

  const [, setGlyphs] = useAtom(glyphs);
  setGlyphs((draft) => { return glyf });

  const [, setIndexMap] = useAtom(index_map);
  setIndexMap((draft) => { return indices });

}

