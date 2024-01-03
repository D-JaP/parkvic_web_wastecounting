import React from "react";
import "./App.css";

import Home from "./Component/pages/Home";
import About from "./Component/pages/About";
import { Route, BrowserRouter, Routes, HashRouter } from "react-router-dom";
import Subscribe from "./Component/pages/Subscribe";
function App() {

  return (
    <HashRouter >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/subscribe" element = {<Subscribe/>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
