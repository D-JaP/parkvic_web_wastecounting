import { host_origin, refreshTokenUrl } from '../config';

const refreshToken = async () => {
    
    try{
        const response = await fetch(refreshTokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': host_origin,
            },
            credentials: 'include',
        });
        const token_response = await response.json();
        console.log("Cookies is being set...")
        
        return token_response.access_token;
    }
    catch (err){
        console.log("refresh token failed with err : ", err);
    }
    
}; 

export default refreshToken;