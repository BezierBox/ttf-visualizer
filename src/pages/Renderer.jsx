import React, { useState } from "react";
import Canvas from "@/components/Canvas.jsx";
import CoordinateColumn from "@/pages/CoordinateColumn";
import { useLocation, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { glyf, index_map } from "@/lib/atoms";
import { useAtom } from "jotai";
import PointColumn from "@/components/PointColumn";

const Renderer = () => {
  const navigate = useNavigate();
  const [indexMap] = useAtom(index_map);
  const [glyphs, setGlyphs] = useAtom(glyf);
  const { glyph } = useParams();
  if (glyph in glyphs == false) {
    navigate("/characters");
  }

  const nchars = glyph in indexMap ? indexMap[glyph].length : 0;
  const chars = nchars != 0 ? String.fromCharCode(indexMap[glyph]) : "Unmapped";

  const [points, setPoints] = useState(glyphs[glyph]);
  const [selected, setSelected] = useState(null);

  const handleClick = () => {
    navigate("/characters");
  };

  return (
    <div>
      <h1 className="text-xl font-bold leading-none">Bezier Glyph Renderer</h1>
      <p>Chosen Character: {chars}</p>
      <Button onClick={handleClick}>Save Glyph</Button>
      <div class="flex flex-row min-h-screen justify-center items-center gap-5">
        <Canvas
          glyph={points}
          setGlyph={setPoints}
          selectedPoint={selected}
          setSelectedPoint={setSelected}
        />
        <PointColumn
          glyph={points}
          setGlyph={setPoints}
          selectedPoint={selected}
          setSelectedPoint={setSelected}
        />
      </div>
    </div>
  );
};

export default Renderer;
