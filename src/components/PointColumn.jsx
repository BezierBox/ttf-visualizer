import { RouteIcon, RouteOff, RouteOffIcon } from "lucide-react";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { produce } from "immer";

const PointColumn = ({ selectedPoint, setSelectedPoint, glyph, setGlyph }) => {
  //handle updating coords
  const handleCoordChange = (shape, point, axis, value) => {
    setGlyph(
      produce((draft) => {
        draft[shape][point][axis] = parseFloat(value);
      }),
    );
  };

  //change on-curve to off-curve, vice versa
  const handleToggleCurve = (shape, point) => {
    setGlyph(
      produce((draft) => {
        draft[shape][point].onCurve = !draft[shape][point].onCurve;
      }),
    );
  };

  const removeCoordinate = (shape, point) => {
    setGlyph(
      produce((draft) => {
        delete draft[shape][point];
      }),
    );
  };

  const selected = selectedPoint && glyph[selectedPoint.ci]?.[selectedPoint.pi];

  return (
    <div className="w-full max-w-md max-h-1/2 overflow-scroll space-y-4 border rounded-xl">
      <h2 className="text-xl font-bold mt-4">Coordinates</h2>
      {glyph.map((shape, index) =>
        shape.map((coord, index2) => (
          <div
            key={`coord-${index}-${index2}`}
            className={`p-2 m-2 rounded-md ${selectedPoint && selectedPoint.ci == index && selectedPoint.pi == index2 ? "bg-blue-50" : "bg-white"}`}
          >
            <Label className="text-sm">Point {index + index2 + 1}</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={coord.x}
                onChange={(e) =>
                  handleCoordChange(index, index2, "x", e.target.value)
                }
                placeholder="X"
                className={`bg-white`}
              />
              <Input
                type="number"
                value={coord.y}
                onChange={(e) =>
                  handleCoordChange(index, index2, "y", e.target.value)
                }
                placeholder="Y"
                className={`bg-white`}
              />
              <Button
                className={
                  coord.onCurve
                    ? `bg-blue-400 hover:bg-blue-600`
                    : `bg-purple-400 hover:bg-purple-600`
                }
                onClick={() => handleToggleCurve(index, index2)}
                aria-label={`Toggle ${coord.onCurve ? "Off-Curve" : "On-Curve"}`}
              >
                {coord.onCurve ? <RouteIcon /> : <RouteOffIcon />}
              </Button>
              {/* <Button
                variant="destructive"
                onClick={() => removeCoordinate(index, index2)}
              >
                ✕
              </Button> */}
            </div>
          </div>
        )),
      )}
    </div>
  );
};

export default PointColumn;
