import React from "react";
import "./App.css";

import Home from "./Component/pages/Home";
import About from "./Component/pages/About";
import { Route, BrowserRouter, Routes, HashRouter } from "react-router-dom";
function App() {

  return (
    <HashRouter >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about.html" element={<About />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
