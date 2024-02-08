const refreshTokenUrl = 'https://api.parkvic.harry-playground.click/api/v1/refreshtoken';

const refreshToken = async () => {
    
    try{
        const response = await fetch(refreshTokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://parkvic-app.harry-playground.click',
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