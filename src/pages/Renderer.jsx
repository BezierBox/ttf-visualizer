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
    setGlyphs((draft) => {
      draft[glyph] = points;
    });

    navigate("/characters");
  };

  return (
    <div className="">
      <h1 className="text-3xl font-bold leading-none">Bezier Glyph Renderer</h1>
      <h2 className="text-xl">Chosen Character: {chars}</h2>
      <div class="flex flex-row h-[calc(100vh-10rem)] max-h-screen justify-center items-center gap-5">
        <div className="relative h-1/2">
          <Canvas
            glyph={points}
            setGlyph={setPoints}
            selectedPoint={selected}
            setSelectedPoint={setSelected}
            className={`mt-20`}
          />
          <Button
            className={`absolute w-full h-12 bottom-0 left-0`}
            onClick={handleClick}
          >
            Save Glyph
          </Button>
        </div>
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
