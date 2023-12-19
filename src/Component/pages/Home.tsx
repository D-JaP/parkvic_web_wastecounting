import React from 'react'
import Navbar from '../Navbar'
import MainSection from '../MainSection'
import Instruction from '../Instruction'

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