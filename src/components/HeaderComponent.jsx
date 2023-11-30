import { Layout, Menu, Button, Col, Row, Drawer, Dropdown } from "antd";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  BookOutlined,
  PlusCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileOutlined,
  EditOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect, useContext } from "react";
const { Header, Content, Footer, Sider } = Layout;

const HeaderComponent = ({ collapsed, setCollapsed, setOpen, user }) => {
  const location = useLocation();

  let content;
  switch (location.pathname) {
    case "/welcome":
      content = <h1>Landing Page</h1>;
      break;
    case "/":
      content = <h1>You are logged in</h1>;
      break;
    case "/cn":
      content = <h1>Creating Note</h1>;
      break;
    default:
      content = "Default content";
  }

  // const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

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

  const items = [
    {
      label: <NavLink to="/cn">Create Note</NavLink>,
      icon: <FileOutlined />,
      key: "0",
    },
    {
      label: <NavLink to="/cb">Create Book</NavLink>,
      icon: <BookOutlined />,
      key: "",
      disabled: true,
    },
  ];

  return (
    <Header className="main-header">
      <Row>
        <Col span={2}>
          {windowWidth > 960 ? (
            <Button
              style={{ color: "var(--primary)" }}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          ) : (
            <Button style={{ color: "var(--primary)" }} onClick={showDrawer}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          )}
        </Col>
        <Col span={20}>
          <div>{content}</div>
        </Col>
        <Col span={2}>
          {user ? (
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              className="creationButton"
              placement="bottomRight"
            >
              <Button>
                <PlusCircleOutlined />
              </Button>
            </Dropdown>
          ) : null}
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderComponent;
