import React from 'react'
import Navbar from '../MainPage/Navbar'
import MainSection from '../MainPage/MainSection'
import Instruction from '../MainPage/Instruction'

function Home() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <MainSection></MainSection>
      <Instruction></Instruction>
    </div>
  )
}

export default Home