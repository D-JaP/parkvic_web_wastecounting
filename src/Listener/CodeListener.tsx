import React, { useContext, useEffect } from 'react'
import AuthContext from '../Context/AuthContext';
function CodeListener({onCodeDetect}:{
    onCodeDetect: (code:string, authContext:AuthContextProps) => Promise<User | null | undefined>
}) {
    const authContext = useContext(AuthContext);
    useEffect(() => {
        const url = new URL(window.location.href);
        const urlParams = new URLSearchParams(url.search);      
      const code = urlParams.get("code");
      
      if (code!==null) {   
        onCodeDetect(code, authContext).then((user) => {
          if (user) {
            authContext.updateUser(user);
          }
        });
      }
      return () => {
        
      }
    }, [onCodeDetect, window.location.href])
    
  return (
    <div>code listener</div>
  )
}

export default CodeListener
