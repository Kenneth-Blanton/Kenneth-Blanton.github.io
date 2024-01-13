import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../data/firebase";
import { Layout, Menu, Button, Col, Row, Drawer, Dropdown, Space } from "antd";
import { BooksViewContext } from "../data/BookViewContext.js";
import {
  UploadOutlined,
  UserOutlined,
  FileOutlined,
  HomeOutlined,
  BookOutlined,
  PlusCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  RightOutlined,
  AudioOutlined,
  SearchOutlined,
  LeftOutlined,
  MailOutlined,
  SettingOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { UserAuth } from "../data/AuthContext.js";
import HeaderComponent from "../components/HeaderComponent.jsx";
import { SidebarUserMenuDock } from "../components/sidebarUserMenuDock.jsx";
import { set } from "firebase/database";
const { Header, Content, Footer, Sider } = Layout;

const MainLayout = () => {
  const { user } = UserAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [isBooksViewActive, setIsBooksViewActive] = useState(true);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  function getItem(label, key, title, icon, children, type) {
    return {
      key,
      icon,
      title,
      children,
      label,
      type,
    };
  }
  const items = [
    getItem("Notes", "sub1", null, <FileOutlined />, [
      getItem("Option 5", "5", null),
      getItem("Option 6", "6", null),
    ]),
    getItem("Books", "sub2", null, <BookOutlined />, [
      getItem("Option 7", "7", null),
      getItem("Option 8", "8", null),
      getItem("Submenu", "sub3", null, <MailOutlined />, [
        getItem("Option 9", "9"),
        getItem("Option 10", "10", null, <SettingOutlined />, [
          getItem("Option 11", "11"),
          getItem("Option 12", "12"),
          getItem("Option 13", "13"),
          getItem("Option 14", "14"),
          getItem("Option 15", "15"),
          getItem("Option 16", "16"),
          getItem("Option 17", "17"),
          getItem("Option 18", "18"),
          getItem("Option 19", "19"),
          getItem("Option 20", "20"),
          getItem("Option 21", "21"),
          getItem("Option 22", "22"),
          getItem("Option 23", "23"),
          getItem("Option 24", "24"),
          getItem("Option 25", "25"),
          getItem("Option 26", "26"),
          getItem("Option 27", "27"),
          getItem("Option 28", "28"),
          getItem("Option 29", "29"),
        ]),
      ]),
    ]),
  ];

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
    <Layout
      style={{ minHeight: "100svh", maxWidth: "100%", overflowX: "hidden" }}
    >
      <Sider
        trigger={null}
        collapsible
        breakpoint="lg"
        collapsedWidth={0}
        collapsed={collapsed}
        onCollapse={() => {
          setCollapsed(!collapsed);
        }}
        id="sideBar"
        width={325}
      >
        <div>
          <NavLink to="/" id="logo">
            <span>
              Opti
              <span>Note</span>
            </span>
          </NavLink>
          <div className="searchBarWrapper">
            <input type="text" className="searchBar" placeholder="Search" />
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          id="sideBarMenu"
          items={[
            ...items.map((item) => {
              return {
                label: item.label,
                key: item.key,
                title: item.title,
                type: item.type,
                icon: item.icon,
                children: item.children,
              };
            }),
          ]}
        />
        <Row
          className={collapsed ? "sidebarUserMenuCollapsed" : "codeByKenneth"}
        >
          <NavLink
            to={"https://codebykenneth.dev/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Code By Kenneth
          </NavLink>
        </Row>
        <Row
          className={collapsed ? "sidebarUserMenuCollapsed" : "sidebarUserMenu"}
        >
          <Col span={8}>
            {user ? (
              <img
                src={user ? user.photoURL : null}
                alt="Profile Pic"
                height={50}
                width={50}
              />
            ) : (
              <NavLink to="/" id="logo">
                <span>
                  O<span>N</span>
                </span>
              </NavLink>
            )}
          </Col>
          <Col span={8}>{user ? user.displayName : null}</Col>
          <Col span={8}>
            <SidebarUserMenuDock />
          </Col>
        </Row>
      </Sider>
      <Drawer
        title={
          <NavLink to="/" id="logo" onClick={onClose}>
            <span>
              Opti
              <span style={{ color: "#3692d9" }}>Note</span>
            </span>
          </NavLink>
        }
        placement="left"
        closable={false}
        onClose={onClose}
        open={open}
        style={{ background: "#282828" }}
      >
        <Menu
          theme="dark"
          mode="inline"
          id="sideBarMenu"
          items={[
            ...items.map((item) => {
              return {
                label: item.label,
                key: item.key,
                title: item.title,
                type: item.type,
                icon: item.icon,
                children: item.children,
              };
            }),
          ]}
        />
        <Row className={"codeByKenneth"}>
          <NavLink
            to={"https://codebykenneth.dev/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Code By Kenneth
          </NavLink>
          <button onClick={onClose} style={{ position: "absolute", right: 0 }}>
            <LeftOutlined />
          </button>
        </Row>

        <Row className={"sidebarUserMenu"}>
          <Col span={8} style={{ textAlign: "center" }}>
            {user ? (
              <img
                src={user ? user.photoURL : null}
                alt="Profile Pic"
                height={50}
                width={50}
              />
            ) : (
              <NavLink to="/" id="logo">
                <span>
                  O<span>N</span>
                </span>
              </NavLink>
            )}
          </Col>

          <Col span={8} style={{ textAlign: "center" }}>
            {user ? user.displayName : null}
          </Col>
          <Col span={8} style={{ textAlign: "center" }}>
            <SidebarUserMenuDock />
          </Col>
        </Row>
      </Drawer>
      <BooksViewContext.Provider
        value={{ isBooksViewActive, setIsBooksViewActive }}
      >
        <Layout style={{ maxWidth: "100%" }}>
          <main>
            <HeaderComponent
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              open={open}
              setOpen={setOpen}
              user={user}
              // isBooksViewActive={isBooksViewActive}
              // setIsBooksViewActive={setIsBooksViewActive}
            />
            <Outlet
            // isBooksViewActive={isBooksViewActive}
            />
          </main>
        </Layout>
      </BooksViewContext.Provider>
    </Layout>
  );
};

export default MainLayout;
