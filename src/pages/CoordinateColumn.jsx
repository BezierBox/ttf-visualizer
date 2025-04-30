import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CoordinateColumn = ({ coordinates, setCoordinates }) => {
  const handleChange = (index, axis, value) => {
    const updated = [...coordinates];
    updated[index][axis] = Number(value);
    setCoordinates(updated);
  };

  const addCoordinate = () => {
    setCoordinates([...coordinates, { x: 0, y: 0 }]);
  };

  const removeCoordinate = (index) => {
    const updated = coordinates.filter((_, i) => i !== index);
    setCoordinates(updated);
  };

  return (
    <div className="w-full max-w-md p-4 space-y-4 border rounded-xl">
      <h2 className="text-xl font-bold">Coordinates</h2>

      {coordinates.map((coord, index) => (
        <div key={index} className="space-y-1">
          <Label className="text-sm">Point {index + 1}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={coord.x}
              onChange={(e) => handleChange(index, "x", e.target.value)}
              placeholder="X"
            />
            <Input
              type="number"
              value={coord.y}
              onChange={(e) => handleChange(index, "y", e.target.value)}
              placeholder="Y"
            />
            <Button variant="destructive" onClick={() => removeCoordinate(index)}>
              ✕
            </Button>
          </div>
        </div>
      ))}

      <Button onClick={addCoordinate}>Add Point</Button>
    </div>
  );
};

export default CoordinateColumn;
