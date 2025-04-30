import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';


const GridButtons = ({ items }) => {
    const navigate = useNavigate();

    const handleClick = (item) => {
        navigate('/renderer', { state: { item } });
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            {items.map((item, index) => (
                <Button key={index} onClick={() => handleClick(item)}>
                    {item}
                </Button>
            ))}
        </div>
    );
};

export default GridButtons;