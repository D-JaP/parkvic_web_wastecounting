const refreshTokenUrl = 'https://vnfjrbk7wpb44vnkix36nv5hf40ncdkh.lambda-url.ap-southeast-2.on.aws/';

const refreshToken = async () => {
    // const refresh_token = Cookies.get('refresh_token');
    // if (!refresh_token) {
    //     throw new Error('no refresh token');
    // }
    const response = await fetch(refreshTokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
        },
        credentials: 'include',
    });
    const token_response = await response.json();
    Cookies.set('access_token', token_response.access_token);
    Cookies.set('refresh_token', token_response.refresh_token);
    return token_response.access_token;
}; 