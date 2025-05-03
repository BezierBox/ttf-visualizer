import { RouteIcon, RouteOffIcon, Trash2 } from "lucide-react";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { produce } from "immer";

const PointColumn = ({
  selectedPoint,
  glyph,
  setGlyph,
  setHistory,
  setFuture,
}) => {
  // handle updating coords
  const handleCoordChange = (shape, point, axis, value) => {
    setHistory(
      produce((draft) => {
        draft.push(glyph);
      }),
    );
    setFuture([]);
    setGlyph(
      produce((draft) => {
        draft[shape][point][axis] = parseFloat(value);
      }),
    );
  };

  // change on-curve to off-curve, vice versa
  const handleToggleCurve = (shape, point) => {
    setHistory(
      produce((draft) => {
        draft.push(glyph);
      }),
    );
    setFuture([]);
    setGlyph(
      produce((draft) => {
        draft[shape][point].onCurve = !draft[shape][point].onCurve;
      }),
    );
  };

  const removeCoordinate = (shape, point) => {
    setHistory(
      produce((draft) => {
        draft.push(glyph); //save current state for undo
      }),
    );
    setFuture([]); //clear future stack for redo
    setGlyph(
      produce((draft) => {
        draft[shape] = draft[shape].filter((_, i) => i !== point); //remove point
      }),
    );
  };

  const addCoordinate = (shape, point) => {
    setHistory(
      produce((draft) => {
        draft.push(glyph); //save current state for undo
      }),
    );
    setFuture([]); //clear future stack for redo
    setGlyph(
      produce((draft) => {
        let x =
          draft[shape].length > point + 1
            ? (draft[shape][point].x + draft[shape][point + 1].x) / 2
            : point != 0
              ? draft[shape][point].x +
                (draft[shape][point].x - draft[shape][point - 1].x)
              : draft[shape][point].x + 10;
        let y =
          draft[shape].length > point + 1
            ? (draft[shape][point].y + draft[shape][point + 1].y) / 2
            : point != 0
              ? draft[shape][point].y +
                (draft[shape][point].y - draft[shape][point - 1].y)
              : draft[shape][point].y + 10;

        draft[shape].splice(point + 1, 0, {
          x: x,
          y: y,
          onCurve: true,
        });
      }),
    );
  };

  const selected = selectedPoint && glyph[selectedPoint.ci]?.[selectedPoint.pi];

  return (
    <div className="w-full max-w-md max-h-2/3 overflow-scroll border rounded-xl">
      <h2 className="text-xl font-bold mt-4">Coordinates</h2>
      {glyph.map((shape, index) =>
        shape.map((coord, index2) => (
          <div>
            <div
              key={`coord-${index}-${index2}`}
              className={`p-2 rounded-md ${
                selectedPoint &&
                selectedPoint.ci === index &&
                selectedPoint.pi === index2
                  ? "bg-blue-50"
                  : "bg-white"
              }`}
            >
              <Label className="text-sm">
                Curve {index + 1} - Point {index2 + 1}
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={coord.x}
                  onChange={(e) =>
                    handleCoordChange(index, index2, "x", e.target.value)
                  }
                  placeholder="X"
                  className="bg-white"
                />
                <Input
                  type="number"
                  value={coord.y}
                  onChange={(e) =>
                    handleCoordChange(index, index2, "y", e.target.value)
                  }
                  placeholder="Y"
                  className="bg-white"
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
                <Button
                  variant="destructive"
                  onClick={() => removeCoordinate(index, index2)}
                  aria-label="Delete point"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
            <button
              className="relative w-96 mx-auto py-4 h-px group"
              onClick={() => {
                addCoordinate(index, index2);
              }}
            >
              <div className="w-full h-px bg-gray-300 group-hover:bg-green-900"></div>
              <div
                className={`absolute top-1 right-1/2 bg-white px-2 text-gray-300 group-hover:text-green-900`}
              >
                +
              </div>
            </button>
          </div>
        )),
      )}
    </div>
  );
};

export default PointColumn;
