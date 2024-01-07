import React, { useContext } from "react";
import "./App.css";

import Home from "./Component/pages/Home";
import About from "./Component/pages/About";
import { Route, BrowserRouter, Routes, HashRouter } from "react-router-dom";
import Subscribe from "./Component/pages/Subscribe";
import AuthProvider from "./Context/AuthContext";
import AuthCallback from "./Callback/AuthCallback";
function App() {
  return (
    <HashRouter >
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loginsuccess" element={<AuthCallback />} />
          <Route path="/about" element={<About />} />
          <Route path="/subscribe" element = {<Subscribe/>} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
