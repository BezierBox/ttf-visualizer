import React from "react";
import "./App.css";
import Canvas from "./Canvas.jsx";

const App = () => {
  return (
    <div className="App">
      <h1>Bezier Glyph Renderer</h1>
      <Canvas />
    </div>
  );
};

export default App;