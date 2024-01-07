import { Location, useLocation } from "react-router-dom";

interface tokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token: string;
  token_type: string;
}

export const getTokenFromUrl = async (urlSearchParam: string) => {
  // search for the token in the url
  const searchParams = new URLSearchParams(urlSearchParam);
  const access_token = searchParams.get("access_token");
  const id_token = searchParams.get("id_token");
  const refresh_token = searchParams.get("refresh_token");
  const token_type = searchParams.get("token_type");
  const expires_in = searchParams.get("expires_in");
  return {
    access_token,
    id_token,
    refresh_token,
    token_type,
    expires_in,
  };
};
