import React from 'react'
import './Plan.scss'
import { Link } from 'react-router-dom'

function Plan({onsubscribe}:{onsubscribe:()=>void}) {
  return (
    <div className='plan-form content-center'>
        <h3>Standard Plan</h3>
        <p className="price">$0.99 <span>/month</span></p>
        <p>Unlimited Images</p>
        <p>No image storage fee</p>
        <button className='btn' onClick={onsubscribe}>Subscribe now</button>
    </div>
  )
}

export default Plan