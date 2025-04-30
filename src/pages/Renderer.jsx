import React, {useState} from "react";
import Canvas from "@/Canvas.jsx";
import CoordinateColumn from "@/pages/CoordinateColumn";
import { useLocation } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';


const Renderer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const item = location.state?.item;

    const [coordinates, setCoordinates] = useState([
        { x: 0, y: 0 },
        { x: 10, y: 10 },
    ]);

    const handleClick = () => {
        navigate('/characters');
    };

    return (
        <div>
            <h1 className="text-xl font-bold leading-none">Bezier Glyph Renderer</h1>
            <p>Chosen Character: {item}</p>
            <Button onClick={handleClick}>Save Glyph</Button>
            <div class="flex flex-row min-h-screen justify-center items-center gap-5">
                <Canvas />
                <CoordinateColumn coordinates={coordinates} setCoordinates={setCoordinates}/>
            </div>
        </div>
    );
};

export default Renderer;