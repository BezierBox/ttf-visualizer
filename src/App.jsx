import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Upload from '@/pages/Upload.jsx'
import Characters from '@/pages/Characters.jsx'
import Renderer from '@/pages/Renderer'


const App = () => {
  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/renderer" element={<Renderer />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;