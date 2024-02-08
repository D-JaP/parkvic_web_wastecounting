import Cookies from "js-cookie";
import refreshToken from "./RefreshToken";

const userinfo_endpoint =
  "https://parkvic.auth.ap-southeast-2.amazoncognito.com/oauth2/userInfo";

const UserInfoCallback  = async (authContext:AuthContextProps) => {
    // get cookie "access_token"
    let access_token = Cookies.get("access_token");
    if (!access_token) {
        console.log("no access token. Trying refresh token");
        try{
            access_token = await refreshToken();
            console.log("refresh token success.");
            
        }
        catch(err){
            console.log("no refresh token. User not logged in");
            console.log(err)
        }
    }else {
      console.log("access token found");
    }

    async function fetchUser(access_token:string) {
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
        authContext.updateUser({
          email: user_data.email,
          username: user_data.username
        } as User) 
        
        }
    if(access_token) fetchUser(access_token);
    
}


export default UserInfoCallback;