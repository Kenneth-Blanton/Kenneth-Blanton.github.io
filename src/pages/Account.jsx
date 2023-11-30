import React, { useEffect } from "react";
import { Layout } from "antd";
import { UserAuth } from "../data/AuthContext";
import { useNavigate } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

const Account = () => {
  const { logOut, user } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user == null) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Layout>
      <Header>
        <span style={{ color: "red" }}>Account Page</span>
      </Header>
      <Content>
        <p>Welcome, {user?.displayName}</p>
        <button onClick={handleSignOut}>Logout</button>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};

export default Account;
