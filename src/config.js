// ENV VERSION 1
// export const host_origin = 'https://parkvic-app.harry-playground.click'
// export const api_origin = 'https://api.parkvic.harry-playground.click'
// export const core_api_path = api_origin + '/api/v1/process-image'
// export const payment_api_path = api_origin + '/api/v1/payment-intent'
// export const refreshTokenUrl = 'https://api.parkvic.harry-playground.click/api/v1/refreshtoken'
// export const logoutUrl = 'https://api.parkvic.harry-playground.click/logout'
// export const getTokenUrl = "https://api.parkvic.harry-playground.click/api/v1/exchangecodefortoken";

// ENV VERSION 2
export const host_origin = 'https://parkvic-app.harry-playground.click'
export const api_origin = 'https://api-v2.parkvic.harry-playground.click'
export const core_api_path = api_origin + '/api/v1/imageprocess'
export const payment_api_path = api_origin + '/api/v1/payment-intent'
export const refreshTokenUrl = api_origin + '/api/v1/refreshtoken'
export const logoutUrl = api_origin + '/logout'
export const getTokenUrl = api_origin + "/api/v1/exchangecodefortoken";

// Cognito Client Credentials
export const client_id = '27934daphhnaqm05lvlr33e5uk'