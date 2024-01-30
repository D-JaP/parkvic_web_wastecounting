import React, { useContext } from "react";
import "./App.css";

import Home from "./Component/pages/Home";
import About from "./Component/pages/About";
import { Route, BrowserRouter, Routes, HashRouter } from "react-router-dom";
import Subscribe from "./Component/pages/Subscribe";
import AuthCallback from "./Callback/AuthCallback";
import CodeListener from "./Listener/CodeListener";
import { AuthProvider } from "./Context/AuthContext";
function App() {
  // use authContext
  
  const handleCodeDetectOauth2 = async (code:string, authContext:AuthContextProps) => 
    await AuthCallback(code, authContext);
  ;

  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <CodeListener
                  onCodeDetect={handleCodeDetectOauth2}
                ></CodeListener>
              </>
            }
          ></Route>
          <Route path="/about" element={<About />} />
          <Route path="/subscribe" element={<Subscribe />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
