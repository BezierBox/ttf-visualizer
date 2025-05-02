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
      <h3 className="text-xl font-bold leading-none">
        Choose a Glyph to Render
      </h3>
      <Button onClick={handleSave}>Save TTF File</Button>
      <GridButtons items={glyphNums} />
    </div>
  );
};

export default Characters;
