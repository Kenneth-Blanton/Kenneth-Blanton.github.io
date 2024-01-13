import {
  Layout,
  Menu,
  Button,
  Col,
  Row,
  Drawer,
  Dropdown,
  Modal,
  Spin,
  Alert,
  Switch,
  DatePicker,
} from "antd";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { BooksViewContext } from "../data/BookViewContext.js";
import {
  BookOutlined,
  PlusCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect, useContext } from "react";
import { db, storage } from "../data/firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { v4 } from "uuid";
import { set } from "firebase/database";
const { Header, Content, Footer, Sider } = Layout;

const HeaderComponent = ({
  collapsed,
  setCollapsed,
  setOpen,
  user,
  // isBooksViewActive,
  // setIsBooksViewActive,
}) => {
  const location = useLocation();
  // console.log(user);
  const { isBooksViewActive, setIsBooksViewActive } =
    useContext(BooksViewContext);
  // const [isBooksViewActive, setIsBooksViewActive] = useState(false);
  const toggleHomeViewButton = () => {
    setIsBooksViewActive(!isBooksViewActive);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [bookBackground, setBookBackground] = useState(null);
  const [addedNotes, setAddedNotes] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [availableNotes, setAvailableNotes] = useState([]);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isAdded, setIsAdded] = useState([]);

  useEffect(() => {
    const getAvailableNotes = async () => {
      if (user && user.uid) {
        const q = query(
          collection(db, "notes"),
          where("hasAccess", "array-contains", user.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setAvailableNotes((prev) => [...prev, doc]);
        });
      }
    };

    getAvailableNotes();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [user]);

  const handleTitleChange = async (e) => {
    setTitle(e.target.value);
  };
  const editDescription = async (e) => {
    setDescription(e.target.value);
  };

  const createBook = async () => {
    await addDoc(collection(db, "books"), {
      alertsOn: false,
      title: title,
      description: description,
      book: [],
      dueDate: dueDate,
      isPrivate: isPrivate,
      hasAccess: [user.uid],
      createdAt: new Date(),
      lastModified: new Date(),
      lastModifiedBy: user.uid,
      notes: addedNotes.map((note) => note.id),
    }).then((docRef) => {
      setIsLoading(true);
      if (imageUpload == null) return;
      const imageRef = ref(
        storage,
        `bookBackgrounds/${imageUpload.name + v4()}`
      );
      uploadBytes(imageRef, imageUpload)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            await updateDoc(doc(db, "books", docRef.id), {
              backgroundImage: url,
            });
          });
        })
        .then(() => {
          setIsLoading(false);
          setIsDone(true);
        });
    });
  };

  let content;
  switch (location.pathname) {
    case "/welcome":
      content = <h1>Landing Page</h1>;
      break;
    case "/":
      content = (
        <div
          style={{
            width: windowWidth > 600 ? 300 : 200,
            height: 55,
            borderRadius: 8,
            lineHeight: "55px",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
          onClick={toggleHomeViewButton}
          className="toggleHomeViewButton"
        >
          <div
            style={{
              height: "100%",
              backgroundColor: "#3692d9",
              width: windowWidth > 600 ? 150 : 100,
              borderRadius: 7,
              position: "absolute",
              left: isBooksViewActive ? 0 : windowWidth > 600 ? 150 : 100,
              transition: "left 0.5s",
            }}
            className="toggleHomeViewButtonHandle"
          >
            {isBooksViewActive ? "Notes" : "Books"}
          </div>
          <div
            style={{
              height: "100%",
              width: windowWidth > 600 ? 150 : 100,
              borderRadius: 7,
            }}
          >
            Notes
          </div>
          <div
            style={{
              height: "100%",
              width: windowWidth > 600 ? 150 : 100,
              borderRadius: 7,
            }}
          >
            Books
          </div>
        </div>
      );
      break;
    case "/cn":
      content = <h1>Creating Note</h1>;
      break;
    default:
      content = "Default content";
  }

  const addExistingNotes = async () => {
    setIsModal2Visible(true);
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal2Visible, setIsModal2Visible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
    console.log("modal is visible");
  };

  const showModal2 = () => {
    setIsModal2Visible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    console.log("modal is closed");
  };

  const handleOk2 = () => {
    setIsModal2Visible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCancel2 = () => {
    setIsModal2Visible(false);
  };

  const handlePrivacy = () => {
    setIsPrivate(!isPrivate);
  };

  const onChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };
  const onOk = (value) => {
    console.log("onOk: ", value);
    setDueDate(value.toDate());
  };

  const items = [
    {
      label: <NavLink to="/cn">Create Note</NavLink>,
      icon: <FileOutlined />,
      key: "0",
    },
    {
      label: <ul onClick={showModal}>Create Book</ul>,
      icon: (
        <ul onClick={showModal}>
          <BookOutlined />
        </ul>
      ),
      key: "1",
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
        <Col
          span={20}
          style={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          {content}
        </Col>
        <Col span={2} style={{ marginLeft: -40 }}>
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
      <Modal
        title="Create Book"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <button
            onClick={handleCancel}
            style={{
              color: "black",
              background: "none",
              border: "1px solid lightgray",
              marginRight: "1em",
            }}
          >
            Return
          </button>,
          <button
            onClick={createBook}
            style={{
              color: "green",
              background: "none",
              border: "1px solid green",
            }}
          >
            Create
          </button>,
        ]}
        style={{
          display: "block",
          textAlign: "center",
        }}
      >
        <div
          style={{
            margin: "2em auto 0",
          }}
        >
          <label>
            <b>Title</b>
          </label>
          <br />
          <input
            type="text"
            style={{
              width: 300,
              padding: 10,
              fontSize: 20,
              color: "rgba(100,100,100,.8)",
            }}
            onChange={handleTitleChange}
            id="noteTitle"
          />
        </div>

        <div
          style={{
            margin: "2em auto 0",
          }}
        >
          <label>
            <b>Description</b>
          </label>
          <br />
          <textarea
            type="text"
            id="description"
            onChange={editDescription}
            style={{
              width: 300,
              height: "100%",
              resize: "none",
              fontFamily: "inherit",
              fontSize: "inherit",
              padding: "0.5em",
              margin: "0em auto 1em",
            }}
          />
        </div>

        <div>
          <label>
            <b>Background Image</b>
          </label>
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
              setBookBackground(URL.createObjectURL(event.target.files[0]));
            }}
            style={{
              paddingLeft: "20%",
              display: "flex",
              textAlign: "center",
              margin: "1em auto",
            }}
            id="imageUpload"
          />
          <img
            src={bookBackground}
            alt=""
            height={bookBackground ? 150 : 0}
            style={{ margin: "1em auto", display: "block" }}
          />
          {bookBackground ? (
            <button
              onClick={() => {
                setBookBackground(null);
                setImageUpload(null);
                const imageUpload = document.getElementById("imageUpload");
                imageUpload.value = null;
              }}
              style={{
                margin: "0 auto",
                display: "flex",
                background: "none",
                color: "red",
                border: "1px solid red",
              }}
            >
              Remove Image
            </button>
          ) : null}
        </div>

        <div>
          <button onClick={addExistingNotes}>
            Add Notes to {title == "" ? "Book" : title}
          </button>
        </div>
        <div>
          {addedNotes.map((note) => {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "1em 0",
                  border: "1px solid lightgray",
                  borderRadius: 5,
                }}
              >
                <div>
                  <h3>{note.data().title}</h3>
                  <p>{note.data().description}</p>
                </div>
                <button
                  onClick={() => {
                    setAddedNotes((prev) =>
                      prev.filter((existingNote) => existingNote.id !== note.id)
                    );
                    isAdded[availableNotes.indexOf(note)] = false;
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ margin: "1em auto" }}>
          <label>
            <b>Private</b>{" "}
          </label>
          <Switch
            defaultChecked
            style={{ backgroundColor: isPrivate ? "#3692d9" : "gray" }}
            onChange={handlePrivacy}
          />
        </div>

        <div style={{ margin: "1em auto" }}>
          <DatePicker showTime onChange={onChange} onOk={onOk} />
        </div>

        {/* <div>{isPrivate ? null : null}</div> */}

        {
          // choice to add users to hasAccess array
        }
      </Modal>
      <Modal
        title="Available Notes"
        open={isModal2Visible}
        onOk={handleOk2}
        onCancel={handleCancel2}
        width={325}
      >
        {availableNotes.map((note, i) => {
          return (
            <div
              key={note.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "1em 0",
                border: "1px solid lightgray",
                borderRadius: 5,
              }}
            >
              <div>
                <h3>{note.data().title}</h3>
                <p>{note.data().description}</p>
              </div>
              <button
                style={{
                  background: isAdded[i] ? "green" : "#3692d9",
                  color: "white",
                }}
                onClick={() => {
                  const newAdded = [...isAdded];
                  newAdded[i] = !newAdded[i];
                  setIsAdded(newAdded);
                  isAdded[i]
                    ? setAddedNotes((prev) =>
                        prev.filter(
                          (existingNote) => existingNote.id !== note.id
                        )
                      )
                    : setAddedNotes((prev) => [...prev, note]);
                  console.log(isAdded);
                }}
              >
                {isAdded[i] ? <CheckCircleOutlined /> : "Add"}
              </button>
            </div>
          );
        })}
      </Modal>
    </Header>
  );
};

export default HeaderComponent;
