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

export const open_font_WASM = async (file) => {
  return new Promise((resolve, reject) => {
    if (Module == undefined) {
      reject("Attempted to open font with undefined module");
    }

    if (!file) {
      reject("No file was provided");
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const filename = `/tmp/${file.name}`;

      // Write file to virtual filesystem
      Module.FS.writeFile(filename, data);

      // Call your C++ function via ccall
      Module.open_font(filename);
      resolve();
    };
    reader.readAsArrayBuffer(file);
  });
};

export const get_glyph_index_map_WASM = () => {
  if (Module == undefined) {
    throw Error("Attempted to open font with undefined module");
  }

  const glyph_map = Module.glyph_index_to_unicode_map();
  const key_map = glyph_map.keys();

  const js_map = {};
  for (let i = 0; i < key_map.size(); i++) {
    const key = key_map.get(i);
    const unicode_vec = glyph_map.get(key);
    const inner_array = [];
    for (let j = 0; j < unicode_vec.size(); j++) {
      inner_array.push(unicode_vec.get(j));
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
  // console.log(c_map);
  // const key_map = c_map;
  const j_map = {};

  // console.log(key_map);

  for (let i = 0; i < c_map.size(); i++) {
    const c_glyph = c_map.get(i);
    const j_glyph = [];
    for (let j = 0; j < c_glyph.size(); j++) {
      const c_inner = c_glyph.get(j);
      const j_inner = [];

      for (let k = 0; k < c_inner.size(); k++) {
        j_inner.push(c_inner.get(k));
      }
      c_inner.delete();
      j_glyph.push(j_inner);
    }
    c_glyph.delete();
    j_map[i] = j_glyph;
  }
  return j_map;
};

export const write_entries_WASM = (state, next) => {
  if (Module == undefined) {
    throw Error("Attempted to open font with undefined module");
  }
  const state_keys = Object.keys(state);

  const input = new Module.MapUint16VectorWBPoint();
  for (const key of state_keys) {
    const glyph = state[key];
    const ind = parseInt(key);
    const vec = new Module.VectorWBPoint();
    for (let i = 0; i < glyph.length; i++) {
      for (let j = 0; j < glyph[i].length; j++) {
        vec.push_back({
          x: glyph[i][j].x,
          y: glyph[i][j].y,
          onCurve: glyph[i][j].onCurve,
          endPt: j == glyph[i].length - 1,
        });
      }
    }
    input.set(ind, vec);
  }

  Module.write_entries(input);

  try {
    const data = Module.FS.readFile("output.ttf"); // Returns a Uint8Array
    const blob = new Blob([data], { type: "application/octet-stream" });

    // Create a temporary anchor element to trigger download
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "output.ttf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch (err) {
    console.error("Failed to download file from WASM FS:", err);
  }

  next();
};
