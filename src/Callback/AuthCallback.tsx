import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import { getTokenFromUrl } from '../utils/AuthUtils'

function AuthCallback() {
    const location = useLocation()
    // const history = useNavigate()
    const auth = useContext(AuthContext)
    useEffect(() => {
        const token_response = getTokenFromUrl(location.search)

    
      return () => {
        
      }
    }, [])
    
  return (
    <div>logging in </div>
  )
}

export default AuthCallback