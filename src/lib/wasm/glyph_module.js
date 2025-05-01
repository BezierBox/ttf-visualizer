import createModule from "./main.js";

let Module;

export const load_WASM = async () => {
  if (Module !== undefined) {
    return true;
  } else {
    try {
      Module = await createModule();
      return true;
    } catch {
      return false;
    }
  }
};

export const is_loaded_WASM = () => {
  return Module != undefined;
};

export const open_font_WASM = (file) => {
  if (Module == undefined) {
    throw Error("Attempted to open font with undefined module");
  }

  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const filename = `/tmp/${file.name}`;

    // Write file to virtual filesystem
    Module.FS.writeFile(filename, data);

    // Call your C++ function via ccall
    Module.open_font(filename);
  };
  reader.readAsArrayBuffer(file);
};

export const get_glyph_index_map_WASM = () => {
  if (Module == undefined) {
    throw Error("Attempted to open font with undefined module");
  }

  const glyph_map = Module.glyph_index_to_unicode_map();
  const key_map = glyph_map.keys();

  const js_map = {};
  for (const key of key_map) {
    const unicode_vec = glyph_map.get(key);
    const inner_array = [];
    for (let i = 0; i < unicode_vec.size(); i++) {
      inner_array.push(unicode_vec.get(i));
    }
    unicode_vec.delete();
    js_map[key] = inner_array;
  }
  glyph_map.delete();

  return js_map;
};

export const extract_glyph_WASM = (unicode) => {
  if (Module == undefined) {
    throw Error("Attempted to open font with undefined module");
  }

  const c_glyph = Module.extract_glyph(unicode);
  const j_glyph = [];

  for (let i = 0; i < c_glyph.size(); i++) {
    const c_inner = c_glyph.get(i);
    const j_inner = [];

    for (let j = 0; j < c_inner.size(); j++) {
      j_inner.push(c_inner.get(j));
    }
    c_inner.delete();
    j_glyph.push(j_inner);
  }
  c_glyph.delete();

  return j_glyph;
};

export const unicode_to_glyph_index_WASM = (unicode) => {
  if (Module == undefined) {
    throw Error("Attempted to open font with undefined module");
  }

  return Module.find_glyph_index(unicode);
};

export const extract_glyphs_WASM = () => {
  if (Module == undefined) {
    throw Error("Attempted to open font with undefined module");
  }

  const c_map = Module.extract_glyphs();
  const key_map = c_map.keys();
  const j_map = {};

  for (const key of key_map) {
    const c_glyph = c_map.get(key);
    const j_glyph = [];
    for (let i = 0; i < c_glyph.size(); i++) {
      const c_inner = c_glyph.get(i);
      const j_inner = [];

      for (let j = 0; j < c_inner.size(); j++) {
        j_inner.push(c_inner.get(j));
      }
      c_inner.delete();
      j_glyph.push(j_inner);
    }
    c_glyph.delete();
    j_map[key] = j_glyph;
  }
  return j_map;
};
