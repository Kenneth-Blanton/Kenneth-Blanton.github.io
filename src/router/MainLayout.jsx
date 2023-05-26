import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button, Drawer } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { UserAuth } from "../data/AuthContext";

const MainLayout = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const { googleSignIn, user, logOut } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/home");
    }
    if (user == null) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="MainLayout">
      <header>
        <nav>
          <h1>
            <NavLink to="/">
              Opti
              <span style={{ color: "#3692d9" }}>Note</span>
            </NavLink>
          </h1>

          <>
            <Button
              style={{
                backgroundColor: "#3692d9",
                border: "none",
                color: "white",
              }}
              onClick={showDrawer}
            >
              <MenuOutlined />
            </Button>
            <Drawer
              title="OptiNote"
              placement="right"
              onClose={onClose}
              open={open}
              style={{ textAlign: "center" }}
            >
              <h3>Contents</h3>
              <p>
                {user ? (
                  <button
                    onClick={() => {
                      navigate("account");
                      onClose();
                    }}
                    style={{ width: "100%", fontSize: "20px" }}
                  >
                    <UserOutlined /> &ensp; Account
                  </button>
                ) : (
                  ""
                )}
              </p>
              <p>
                {user ? (
                  <button
                    onClick={() => {
                      navigate("home");
                      onClose();
                    }}
                    style={{ width: "100%", fontSize: "20px" }}
                  >
                    <CalendarOutlined /> &ensp; Calendar
                  </button>
                ) : (
                  ""
                )}
              </p>
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    onClose();
                  }}
                  style={{ width: "100%", fontSize: "20px" }}
                >
                  <LogoutOutlined />
                  &ensp; Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleGoogleSignIn();
                    onClose();
                  }}
                >
                  Sign In
                </button>
              )}
            </Drawer>
          </>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <span>
          Website by <a href="https://codebykenneth.dev/">Code By Kenneth</a>
          <script>document.write(new Date().getFullYear())</script>
        </span>
      </footer>
    </div>
  );
};

export default MainLayout;
