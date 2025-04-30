import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import GridButtons from "./GridButtons";
import { useNavigate } from 'react-router-dom';


const Characters = () => {
    const navigate = useNavigate();
    const characters = ["A", "B", "C", "D", "E", "F", "G", "H", "anything works"];

    const handleSave = () => {
        navigate('/');
    };

	return (
		<div className="grid gap-2">
            <h3 className="text-xl font-bold leading-none">Choose a Glyph to Render</h3>
            <Button onClick={handleSave}>Save TTF File</Button>
            <GridButtons items={characters} />
        </div>
	);
};

export default Characters;