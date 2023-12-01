import React, { useState } from 'react'
import "./OverLayImage.scss"

function OverLayImage({src, handleCloseBtnClick} : {
    src :string,
    handleCloseBtnClick:  any
}) {
    const image_icon: string = `${process.env.PUBLIC_URL}/img/close.svg`;

    const [load, setload] = useState(false)
    const handleLoad = () => {
        setload(true);
    }
  return (
    <div className={`overlay ${load?"appear":""}`}>
        <img src={src} className={`image  ${load?"appear":""}`} alt="View img" onLoad={handleLoad}/>
        <img src={image_icon} className='close' alt='close' onClick={() =>{handleCloseBtnClick();setload(false)}}></img>
    </div>
  )
}

export default OverLayImage