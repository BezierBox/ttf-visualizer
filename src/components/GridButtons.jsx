import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { glyf, index_map } from "@/lib/atoms";
import { renderGlyphToImage } from "@/lib/renderGlyphToImage";

const GridButtons = ({ items }) => {
  const navigate = useNavigate();
  const [indexMap] = useAtom(index_map);
  const [glyphs] = useAtom(glyf);

  const handleClick = (item) => {
    navigate(`/renderer/${item}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {items.map((item, index) => (
        <Button
          key={`glyf-${index}`}
          onClick={() => handleClick(item)}
          className={`h-60 text-2xl`}
        >
          <div>
            <img src={renderGlyphToImage({ contours: glyphs[item] })} />
            {item in indexMap
              ? indexMap[item].map((val) => String.fromCharCode(val)).join(", ")
              : "Unmapped"}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default GridButtons;
