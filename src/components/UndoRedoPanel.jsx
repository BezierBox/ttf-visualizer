import React from "react";
import { Button } from "./ui/button";

const UndoRedoPanel = ({
  points,
  setPoints,
  history,
  setHistory,
  future,
  setFuture,
  className,
}) => {
  const handleUndo = () => {
    if (history.length === 0) return;

    const prev = history[history.length - 1];

    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [JSON.parse(JSON.stringify(points)), ...f]);
    setPoints(JSON.parse(JSON.stringify(prev))); //deep copy previous state for deletes
  };

  const handleRedo = () => {
    if (future.length === 0) return;

    const next = future[0];

    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, JSON.parse(JSON.stringify(points))]); 
    setPoints(JSON.parse(JSON.stringify(next))); //deepcopy
  };

  return (
    <div className={`mt-4 flex gap-3 ${className}`}>
      <Button onClick={handleUndo} disabled={history.length === 0}>
        Undo
      </Button>
      <Button onClick={handleRedo} disabled={future.length === 0}>
        Redo
      </Button>
    </div>
  );
};

export default UndoRedoPanel;
