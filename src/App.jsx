import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Upload from '@/pages/Upload.jsx'
import Characters from '@/pages/Characters.jsx'
import Renderer from '@/pages/Renderer'


import { load_WASM } from "./lib/wasm/glyph_module.js";

const App = () => {
  load_WASM();

  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/renderer/:glyf" element={<Renderer />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;