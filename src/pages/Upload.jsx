import React, { use, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extract_glyphs_WASM, get_glyph_index_map_WASM, is_loaded_WASM, load_WASM, open_font_WASM } from '@/lib/wasm/glyph_module';
import { useAtom } from 'jotai';
import { fileLoaded, filename, glyf, index_map } from '@/lib/atoms';


const Upload = () => {
  const [selected, setSelected] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const [, setLoaded] = useAtom(fileLoaded);
  const [, setName] = useAtom(filename);
  const [, setGlyphs] = useAtom(glyf);
  const [, setIndexMap] = useAtom(index_map);

  const handleInput = () => {
    setSelected(fileRef.current != undefined && fileRef.current.files.length > 0);
  }

  const handleSubmit = async () => {
    if (selected) {
      if (!is_loaded_WASM()) {
        await load_WASM();
      }
    
      await open_font_WASM(fileRef.current.files[0]);
      const glyphs = extract_glyphs_WASM();
      const indices = get_glyph_index_map_WASM();
    
      setName((draft) => { return fileRef.current.files[0].name });
      setGlyphs((draft) => { return glyphs });
      setIndexMap((draft) => { return indices });
      setLoaded((draft) => { return true });

      navigate("/characters");
    }
  };

  return (
    <div className="grid items-center justify-center gap-1.5">
      <h1 className="text-2l font-bold">Welcome to BezierBox</h1>
		  <Label htmlFor="ttf-file">Select a TTF File</Label>
	  	<Input id="ttf-file" type="file" accept=".ttf" ref={fileRef} onChange={handleInput} />
      <Button type="submit" onClick={handleSubmit} disabled={!selected} >
        Confirm File Choice
      </Button>
    </div>
  );
};

export default Upload;
