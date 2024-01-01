import React, { useState, useRef, useEffect } from "react";
import NoteCard from "../components/NoteCard";
import { db } from "../data/firebase";
import { UserAuth } from "../data/AuthContext";
import { FileOutlined, BookOutlined, LoadingOutlined } from "@ant-design/icons";
import { Layout, Button, Col, Row, Empty, Dropdown, Spin } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import UserCheck from "../router/UserCheck";
import { collection, query, where, getDocs } from "firebase/firestore";
const { Content, Footer } = Layout;

const Home = () => {
  UserCheck();
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState(
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 24,
          }}
          spin
        />
      }
    />
  );
  const { googleSignIn, user, logOut } = UserAuth();

  useEffect(() => {
    const getAllNotes = async () => {
      if (user && user.uid) {
        const q = query(
          collection(db, "notes"),
          where("hasAccess", "array-contains", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const newNotes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIsLoading(false);
        setNotes(newNotes);
      } else {
        console.log("No user is signed in.");
      }
    };

    if (user && user.uid) {
      getAllNotes();
    }
  }, [user]);

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
    },
  ];

  return (
    <Layout>
      <Content
        style={{
          height: "calc(100vh - 64px)",
          overflow: "scroll",
          padding: 90, // make sure to make this 30 on mobile
        }}
      >
        {isLoading ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                }}
                spin
              />
            }
          />
        ) : notes.length > 0 ? (
          <>
            <Row gutter={[96, 56]}>
              {notes.map((note, index) => (
                <Col
                  xs={24}
                  lg={12}
                  key={note.id}
                  style={{
                    // border: "1px solid red",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  <NoteCard note={note} />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 200 }}
            description={<span style={{ fontSize: 24 }}>No notes yet.</span>}
          >
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              className="creationButton"
              placement="top"
            >
              <Button>Create Note</Button>
            </Dropdown>
          </Empty>
        )}
      </Content>
    </Layout>
  );
};

export default Home;
