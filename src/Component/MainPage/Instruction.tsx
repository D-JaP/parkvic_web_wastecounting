import React from 'react'
import './Instruction.scss'
function Instruction() {
    const src_img :string = `${process.env.PUBLIC_URL}/img/plastic_bottle_001_pred.jpg`;
  return (
    <div className='instruction container-md d-flex justify-content-between align-items-center'>
        <div className='text-side d-flex flex-column ms-auto me-auto'>
            <h2>How to get Litter Insights:</h2>
            <div className='step d-flex flex-row align-items-center'>
                <p className='number'>1</p>
                <p className='doc'>Select images in JPG or PNG format (<strong>maximum 40</strong>). Test <span><a href="https://parkvic-app.s3.ap-southeast-2.amazonaws.com/test_image.jpg" download="test_image">Image</a></span></p>
            </div>
            <div className='step d-flex flex-row align-items-center'>
                <p className='number'>2</p>
                <p className='doc'>Click <strong>Analyze</strong> button to run the AI engine</p>
            </div>
            <div className='step d-flex flex-row align-items-center'>
                <p className='number'>3</p>
                <p className='doc'>Select <strong>Dropdown Icon</strong>  to see image insights, or export to <strong>XSL</strong></p>
            </div>
        </div>
        <img src={src_img} alt='example img' className='img-eg '></img>
    </div>
  )
}

export default Instruction