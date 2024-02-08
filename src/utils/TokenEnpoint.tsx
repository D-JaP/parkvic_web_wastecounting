const getTokenUrl = "https://api.parkvic.harry-playground.click/api/v1/exchangecodefortoken";

export const getTokenFromCode  = async (code:string):Promise<{
  access_token: string;
} | null>  => {
  // search for the token in the url
  const currentOrigin :string = window.location.origin;
  const response = await fetch(getTokenUrl, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": currentOrigin,
      "Access-Control-Allow-Credentials": "true",
      // "Access-Control-Allow-Methods": "POST",
    },
    body: JSON.stringify({"authorizationCode": code}),
  })
  
  .catch(
    (err) => {
      console.error(err);
      // throw new Error("failed to exchange code for token with err: " + err.message)
    }
  );
  let token_response:tokenResponse;
  try {
    token_response = await (response as Response).json();
  }
  catch (err) {
    console.log(err);
    return null;
  }
  return {
    access_token: token_response.access_token
  };
};
