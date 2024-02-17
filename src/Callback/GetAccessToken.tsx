import refreshToken from "./RefreshToken";
import Cookies from "js-cookie";

export const getAccessToken =async () => {
    let access_token = Cookies.get("access_token");
    if (!access_token) {
        console.log("no access token. Trying refresh token");
        try{
            access_token = await refreshToken();
            console.log("refresh token success.");
            return access_token
        }
        catch(err){
            console.log("no refresh token. User not logged in");
            console.log(err)
            return null
        }
    }else {
      console.log("access token found");
      return access_token
    }
}