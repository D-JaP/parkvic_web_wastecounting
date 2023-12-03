import React, { useState } from 'react'
import './Navbar.scss'
function Navbar() {
    const logo:string = `${process.env.PUBLIC_URL}/img/parks-logo 1.png`
    const menu:string = `${process.env.PUBLIC_URL}/img/menu.svg`
    const [heightMenu, setheightMenu] = useState("0")

    const showMenu = () => {
      if (heightMenu === "0"){
        setheightMenu("35px")
      }
      else {
        setheightMenu("0")
      }
    }
  return (
    <div className='navbar container-md d-flex justify-content-between align-item-center ms-auto me-auto'>
        <a href="/"><img src={logo}  className="logo" alt='Logo'/></a>
        <img src={menu} alt="menu icon" className='menu' onClick={showMenu} />
        <div className='spacing' style={{maxHeight:heightMenu}}></div>
        <div className='tab' style={{maxHeight:heightMenu}}>
          <a href='/' className='text-header'>Capabilities</a>
          <a href='/' className='text-header'>About</a>
          <a href='/' className='text-header me-2'>Log in</a>
          <span className='text-header me-2 slash'>/</span>
          <a href='/' className='text-header signup'>Sign up</a>
        </div>
    </div>
  )
}

export default Navbar