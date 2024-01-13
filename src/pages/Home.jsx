import React, { useState, useContext, useEffect } from "react";
import NoteCard from "../components/NoteCard";
import BookCard from "../components/BookCard";
import { BooksViewContext } from "../data/BookViewContext";
import { db } from "../data/firebase";
import { UserAuth } from "../data/AuthContext";
import { FileOutlined, BookOutlined, LoadingOutlined } from "@ant-design/icons";
import { Layout, Button, Col, Row, Empty, Dropdown, Spin, Modal } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import UserCheck from "../router/UserCheck";
import { collection, query, where, getDocs } from "firebase/firestore";
const { Content, Footer } = Layout;

const Home = () => {
  UserCheck();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { isBooksViewActive } = useContext(BooksViewContext);

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
  const [books, setBooks] = useState(
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

    const getAllBooks = async () => {
      if (user && user.uid) {
        const q = query(
          collection(db, "books"),
          where("hasAccess", "array-contains", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const newBooks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIsLoading(false);
        setBooks(newBooks);
      } else {
        console.log("No user is signed in.");
      }
    };

    if (user && user.uid) {
      getAllNotes();
      getAllBooks();
    }
  }, [user]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
    console.log("modal is visible");
  };

  const handleOk = () => {
    setIsModalVisible(false);
    console.log("modal is closed");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    console.log("modal is closed");
  };

  const items = [
    {
      label: <NavLink to="/cn">Create Note</NavLink>,
      icon: <FileOutlined />,
      key: "0",
    },
    {
      label: <ul onClick={showModal}>Create Book</ul>,
      icon: <BookOutlined />,
      key: "1",
    },
  ];

  const handleTitleChange = async (e) => {
    setTitle(e.target.value);
  };

  const editDescription = async (e) => {
    setDescription(e.target.value);
  };

  return (
    <Layout>
      <Content
        style={{
          height: "calc(100vh - 64px)",
          overflow: "scroll",
          padding: "36px 60px", // make sure to make this 30 on mobile
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
        ) : isBooksViewActive ? (
          notes.length > 0 ? (
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
          )
        ) : (
          <Row gutter={[96, 56]}>
            {books.map((book, index) => (
              <Col
                xs={24}
                lg={12}
                key={book.id}
                style={{
                  // border: "1px solid red",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <BookCard book={book} user={user} />
              </Col>
            ))}
          </Row>
        )}
        <Modal
          title="Create Book"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <label>
            <b>Title</b>
          </label>
          <br />
          <input
            type="text"
            placeholder="Enter title"
            style={{
              padding: 10,
              fontSize: 20,
              color: "rgba(100,100,100,.8)",
            }}
            onChange={handleTitleChange}
            id="noteTitle"
          ></input>

          <label
            style={{
              display: "block",
              margin: "2em auto 0",
            }}
          >
            <b>Description</b>
          </label>
          <textarea
            type="text"
            placeholder={"Enter description"}
            id="description"
            onChange={editDescription}
            style={{
              width: "100%",
              height: "100%",
              resize: "none",
              fontFamily: "inherit",
              fontSize: "inherit",
              padding: "0.5em",
              margin: "0em auto 1em",
            }}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default Home;
