import React, { useContext, useEffect, useState } from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import UserInfoCallback from "../Callback/UserInfoCallback";
import Cookies from "js-cookie";
function Navbar() {
  let loginUrl: string;
  let signupUrl: string;
  const clientId = "572aocggegc3gkbeuba7mr16qv"
  // local host testing
  if (window.location.hostname === "localhost") {
    loginUrl =
      `https://parkvic.auth.ap-southeast-2.amazoncognito.com/login?client_id=${clientId}&response_type=code&scope=email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000`;
    signupUrl =
      `https://parkvic.auth.ap-southeast-2.amazoncognito.com/signup?client_id=${clientId}&response_type=code&scope=email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000`;
  } else {
    // production
    loginUrl =
      `https://parkvic.auth.ap-southeast-2.amazoncognito.com/login?client_id=${clientId}&response_type=code&scope=email+openid+phone+profile&redirect_uri=https%3A%2F%2Fdiqvd5r88q5zx.cloudfront.net%2F`;
    signupUrl =
      `https://parkvic.auth.ap-southeast-2.amazoncognito.com/signup?client_id=${clientId}&response_type=code&scope=email+openid+phone+profile&redirect_uri=https%3A%2F%2Fdiqvd5r88q5zx.cloudfront.net%2F`;
  }
  const logo: string = `${process.env.PUBLIC_URL}/img/parks-logo 1.png`;
  const menu: string = `${process.env.PUBLIC_URL}/img/menu.svg`;
  const [heightMenu, setheightMenu] = useState("0");

  
  const showMenu = () => {
    if (heightMenu === "0") {
      setheightMenu("35px");
    } else {
      setheightMenu("0");
    }
  };
  // user context
  const userContext = useContext(AuthContext)
  // call callback on react load 
  useEffect(() => {
    // check cookies access_token present 
    // if not present, do nothing
    // if present, call UserInfoCallback

    UserInfoCallback(userContext)
  
    return () => {
      
    }
  }, [userContext])
  
  // logout user 
  const logout = () => {
      userContext.logout();
      // invalidate cookies
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
  }
  
  return (
    <div className="navbar container-md d-flex justify-content-between align-item-center ms-auto me-auto">
      <a href="/">
        <img src={logo} className="logo" alt="Logo" />
      </a>
      <img src={menu} alt="menu icon" className="menu" onClick={showMenu} />
      <div className="spacing" style={{ maxHeight: heightMenu }}></div>
      <div className="tab" style={{ maxHeight: heightMenu }}>
        <Link to="/subscribe" className="text-header subscribe-btn">
          Subscribe
        </Link>
        <Link to="/about" className="text-header">
          Capabilities
        </Link>
        <a href="/" className="text-header">
          Home
        </a>
        {(userContext.user)? (
          <>
            <a href="#" className="text-header">Hi, {userContext.user.email}</a>
            <a href={`https://parkvic.auth.ap-southeast-2.amazoncognito.com/logout?client_id=${clientId}&logout_uri=http%3A%2F%2Flocalhost%3A3000`} onClick={logout}  className="text-header" >Log out</a>
          </>
        ) : (
          <>
            <Link to={loginUrl} className="text-header me-2">
              Log in
            </Link>
            <span className="text-header me-2 slash">/</span>
            <Link to={signupUrl} className="text-header signup">
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
