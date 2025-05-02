import React from "react";
import { Button } from "./ui/button";

const UndoRedoPanel = ({ onUndo, onRedo, canUndo, canRedo }) => {
  return (
    <div className="mt-4 flex gap-3">
      <Button onClick={onUndo} disabled={!canUndo}>Undo</Button>
      <Button onClick={onRedo} disabled={!canRedo}>Redo</Button>
    </div>
  );
};

export default UndoRedoPanel;