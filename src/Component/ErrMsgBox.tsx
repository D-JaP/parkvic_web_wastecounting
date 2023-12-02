import React, { useState } from 'react'
import "./ErrMsgBox.scss"

function ErrMsgBox({message, kill} : {message:string, kill:any}) {
    const close_icon = `${process.env.PUBLIC_URL}/img/close.svg`
    const [hide, setHide] = useState(false)
    
  return (
    <div className={`MessageBox d-flex ${hide?"hide":""}`}>
        <p>Error: {message!=null?message:""}</p>
        <img className='close_icon' src={close_icon} alt="close" onClick={() => {setHide(true); kill()}}/>
    </div>
  )
}

export default ErrMsgBox