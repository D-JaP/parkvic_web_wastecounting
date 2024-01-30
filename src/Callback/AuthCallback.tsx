import { getTokenFromCode } from "../utils/TokenEnpoint";

const userinfo_endpoint =
  "https://parkvic.auth.ap-southeast-2.amazoncognito.com/oauth2/userInfo";

const AuthCallback = async (code: string, authContext: AuthContextProps) => {
  async function fetchData() {
    // get params from url
    console.log("getting user info");
    
    if (!code) {
      throw new Error("no code in url");
    }
    // exchange code for token
     
    const access_token = (await getTokenFromCode(code))?.access_token;
    
    if (!access_token) return null;
    else return access_token;
  }

  async function fetchUser(access_token:string) {
    
    // console.log(access_token);
    
    // if (!access_token) {
    //   return
    // }
    const response = await fetch(userinfo_endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        Authorization: "Bearer " + access_token,
      },
    });

    const user_data = await response.json().catch((err) => {
      console.log(err);
      throw new Error("failed to get user info with err: " + err.message);
    });
    authContext.user = {
      email: user_data.email,
      username: user_data.username
    }
    console.log(authContext.user);
    
    authContext.isAuthenticate = true;
  }

  const access_token = await fetchData();
  if (access_token == null) {
    return
  }
  
  await fetchUser(access_token);
  
  // window.location.href = "/";

  
  return authContext.user;
};

export default AuthCallback;
