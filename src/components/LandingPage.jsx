import { UserAuth } from "../data/AuthContext.js";
import { Layout } from "antd";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect, createContext } from "react";
import UserCheck from "../router/UserCheck.jsx";
import { db } from "../data/firebase.js";
const { Header, Content, Footer, Sider } = Layout;

const LandingPage = () => {
  const { googleSignIn, user, logOut } = UserAuth();

  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (user != null) {
  //     navigate("/");
  //   }
  //   if (user == null) {
  //     navigate("/welcome");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user]);

  let content = ["This is the first content", "This is the second content"];

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Layout className="welcomePage">
      <Content>
        <p>The window width is: {windowWidth}</p>

        <button onClick={handleGoogleSignIn}>Sign In</button>
        <br />
        <br />
        <button>
          <NavLink to="/">Home</NavLink>
        </button>
      </Content>
    </Layout>
  );
};

export default LandingPage;
