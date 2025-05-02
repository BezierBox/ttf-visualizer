import { RouteIcon, RouteOff, RouteOffIcon } from "lucide-react";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { produce } from "immer";

const PointColumn = ({ selectedPoint, setSelectedPoint, glyph, setGlyph }) => {
  //handle updating coords
  const handleCoordChange = (point, axis, value) => {
    // if (!point) return;
    setGlyph(
      produce((draft) => {
        for (let i = 0; i < draft.length; i++) {
          if (point < draft[i].length) {
            draft[i][point][axis] = value;
            break;
          }
          point -= draft[i].length;
        }
      }),
    );
  };

  //change on-curve to off-curve, vice versa
  const handleToggleCurve = (point) => {
    // if (!point) return;
    // setGlyph((prev) => {
    //   const updated = JSON.parse(JSON.stringify(prev));
    //   const pt = updated[point.ci][point.pi];
    //   pt.onCurve = !pt.onCurve;
    //   return updated;
    // });
    setGlyph(
      produce((draft) => {
        for (let i = 0; i < draft.length; i++) {
          if (point < draft[i].length) {
            draft[i][point].onCurve = !draft[i][point].onCurve;
            break;
          }
          point -= draft[i].length;
        }
      }),
    );
  };

  // const selected = selectedPoint && glyph[selectedPoint.ci]?.[selectedPoint.pi];

  return (
    <div className="w-full max-w-md p-4 space-y-4 border rounded-xl">
      <h2 className="text-xl font-bold">Coordinates</h2>

      {glyph.flat().map((coord, index) => (
        <div key={`coord-${index}`} className="space-y-1">
          <Label className="text-sm">Point {index + 1}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={coord.x}
              onChange={(e) => handleCoordChange(index, "x", e.target.value)}
              placeholder="X"
            />
            <Input
              type="number"
              value={coord.y}
              onChange={(e) => handleCoordChange(index, "y", e.target.value)}
              placeholder="Y"
            />
            <Button
              className={
                coord.onCurve
                  ? `bg-blue-400 hover:bg-blue-600`
                  : `bg-purple-400 hover:bg-purple-600`
              }
              onClick={() => handleToggleCurve(index)}
              aria-label={`Toggle ${coord.onCurve ? "Off-Curve" : "On-Curve"}`}
            >
              {coord.onCurve ? <RouteIcon /> : <RouteOffIcon />}
            </Button>
            {/* <Button
              variant="destructive"
              onClick={() => removeCoordinate(index)}
            >
              ✕
            </Button> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PointColumn;
