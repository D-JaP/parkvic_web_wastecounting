import React from 'react';
import './App.css';
import Navbar from './Component/Navbar';
import MainSection from './Component/MainSection';
import Instruction from './Component/Instruction';
function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <MainSection></MainSection>
      <Instruction></Instruction>
    </div>
  );
}

export default App;
