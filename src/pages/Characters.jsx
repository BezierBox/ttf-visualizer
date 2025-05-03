import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import GridButtons from "../components/GridButtons";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { glyf, glyf_nums } from "@/lib/atoms";

const Characters = () => {
  const navigate = useNavigate();
  const [glyphNums] = useAtom(glyf_nums);

  const handleSave = () => {
    navigate("/");
  };

  return (
    <div className="grid gap-2">
      <h1 className="text-7xl font-bold leading-none">
        Choose a Glyph to Render
      </h1>
      <GridButtons items={glyphNums} />
      <div className="fixed flex bottom-0 left-0 w-full h-16 bg-white items-center justify-center border-t-2 border-gray-900">
        <Button onClick={handleSave} className={`grow mx-2 text-3xl h-12`}>
          Save TTF File
        </Button>
      </div>
    </div>
  );
};

export default Characters;
