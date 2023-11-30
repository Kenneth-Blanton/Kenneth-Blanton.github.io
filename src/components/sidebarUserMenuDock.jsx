import React from "react";
import { MoreOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserAuth } from "../data/AuthContext.js";

export const SidebarUserMenuDock = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/");
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  const { googleSignIn, user, logOut } = UserAuth();

  const items = [
    {
      label: user ? (
        <NavLink to="/account">Profile</NavLink>
      ) : (
        <span onClick={handleGoogleSignIn} style={{ display: "block" }}>
          Sign In
        </span>
      ),
      icon: user ? <UserOutlined /> : null,
      key: "0",
    },

    {
      label: "3rd menu item",
      key: "1",
    },
    {
      label: user ? (
        <a href="#" onClick={handleLogOut} style={{ color: "red" }}>
          Sign Out
        </a>
      ) : null,
      icon: user ? (
        <a href="#" onClick={handleLogOut} style={{ color: "red" }}>
          <LogoutOutlined />
        </a>
      ) : null,
      key: "2",
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}
    >
      <button>
        <MoreOutlined />
      </button>
    </Dropdown>
  );
};
