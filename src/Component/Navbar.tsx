import React from 'react'
import './Navbar.scss'
function Navbar() {
    const logo:string = `${process.env.PUBLIC_URL}/img/parks-logo 1.png`

  return (
    <div className='navbar container-md d-flex justify-content-between align-item-center ms-auto me-auto'>
        <a href="/"><img src={logo} alt='Logo'/></a>

        <div className='tab'>
            <a href='/' className='text-header'>Capabilities</a>
            <a href='/' className='text-header'>About</a>
            <a href='/' className='text-header me-2'>Log in</a>
            <span className='text-header me-2'>/</span>
            <a href='/' className='text-header'>Sign up</a>
        </div>
    </div>
  )
}

export default Navbar