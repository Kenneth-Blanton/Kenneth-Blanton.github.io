import { Layout, Modal, Button, Dropdown, Spin, Alert } from "antd";
import React, { useEffect, useState } from "react";
import EditorWrapper from "../components/EditorWrapper";
import {
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  MoreOutlined,
  PictureOutlined,
  BookOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import UserCheck from "../router/UserCheck";
import { getAuth } from "firebase/auth";
import { UserAuth } from "../data/AuthContext.js";
import { deleteDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { db, storage } from "../data/firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { set } from "firebase/database";

const { Header, Content } = Layout;

function EditNote() {
  UserCheck();
  const { user } = UserAuth();
  const auth = getAuth();
  const location = useParams();
  const navigate = useNavigate();

  const [editorInstance, setEditorInstance] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);
  const [completedVisible, setCompletedVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  async function checkUser() {
    const docRef = doc(db, "notes", location.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.data().hasAccess.includes(auth.currentUser.uid)) {
    } else {
      navigate("/");
    }
  }
  checkUser();

  const handleEditorReady = (editor) => {
    setEditorInstance(editor);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModal2 = () => {
    setIsModal2Open(true);
  };

  const showModal3 = () => {
    setIsModal3Open(true);
  };

  const goBack = () => {
    navigate("/");
  };

  const changeCoverImage = () => {
    setIsLoading(true);
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          await updateDoc(doc(db, "notes", location.id), {
            backgroundImage: url,
          });
        });
      })
      .then(() => {
        setIsLoading(false);
        setIsDone(true);
      });
  };

  const editDescription = async (e) => {
    await updateDoc(doc(db, "notes", location.id), {
      description: e.target.value,
    });
  };

  const addToBook = () => {
    console.log("object2");
  };

  const items = [
    {
      label: <ul onClick={showModal2}>Change Cover Image</ul>,
      icon: <PictureOutlined />,
      key: "0",
    },
    {
      label: <ul onClick={showModal3}>Add Description</ul>,
      icon: <EditOutlined />,
      key: "1",
    },
    {
      label: <ul onClick={addToBook}>Add To Book</ul>,
      icon: <BookOutlined />,
      key: "2",
      disabled: true,
    },
  ];

  // console.log(document.querySelector('div[data-id="completed"]'));
  const completedElement = document.querySelector(
    'div.ce-block[data-id="completed"]'
  );

  if (completedElement) {
    const completedVisElements = document.querySelectorAll(".completedVis");
    completedVisElements.forEach((element) => {
      element.style.display = "block";
    });
    const nestedElement = completedElement.querySelector(".cdx-checklist");

    if (nestedElement.children.length === 0) {
      nestedElement.style.pointerEvents = "none";
      nestedElement.style.opacity = "0.5";
      nestedElement.innerHTML = `<span>No completed items</span>`;
    } else {
    }
  } else if (completedElement === null) {
  }

  const showCompleted = () => {
    const completedChecklist = document.querySelector(
      'div[data-id="completed"]'
    );

    if (completedChecklist.style.display === "none") {
      completedChecklist.style.display = "block";
      setCompletedVisible(true);
    } else {
      completedChecklist.style.display = "none";
      setCompletedVisible(false);
    }
  };

  const handleDelete = () => {
    setIsModalOpen(false);
    async function deleteNote() {
      await deleteDoc(doc(db, "notes", location.id));
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const notesMade = userDocSnap.data().notesMade;
      const updatedNotesMade = notesMade.filter(
        (noteId) => noteId !== location.id
      );
      await updateDoc(userDocRef, {
        notesMade: updatedNotesMade,
      });
    }
    deleteNote();
    navigate("/");
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsModal2Open(false);
    setIsModal3Open(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModal2Open(false);
    setIsModal3Open(false);
  };

  const deleteCurrentImage = () => {
    updateDoc(doc(db, "notes", location.id), {
      backgroundImage: null,
    });
    setIsModal2Open(false);
  };

  return (
    <Content style={{ padding: 0 }}>
      <Header className="note-header" editorinstance={editorInstance}>
        <button onClick={goBack}>
          Save and Exit <SaveOutlined />
        </button>
        <button onClick={showModal} className="handleDeleteButton">
          Delete Note <DeleteOutlined />
        </button>
        {completedVisible ? (
          <button onClick={showCompleted} className="completedVis">
            Hide Completed <EyeInvisibleOutlined />
          </button>
        ) : (
          <button onClick={showCompleted} className="completedVis">
            Show Completed <EyeOutlined />
          </button>
        )}

        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
          className="creationButton"
          placement="bottomRight"
        >
          <Button style={{ backgroundColor: "#3692d9", border: "none" }}>
            <MoreOutlined style={{ color: "white" }} />
          </Button>
        </Dropdown>
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button onClick={handleOk}>Return</Button>,
            <Button onClick={handleDelete} danger>
              Delete
            </Button>,
          ]}
        >
          <p style={{ textAlign: "center" }}>
            Are you sure you want to delete this note?
          </p>
        </Modal>
        <Modal
          open={isModal2Open}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            // <Button onClick={handleOk}>Return</Button>,
            <Button onClick={deleteCurrentImage} danger>
              Delete Current Picture
            </Button>,
          ]}
        >
          <div style={{ display: "block", textAlign: "center" }}>
            <input
              type="file"
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
              style={{
                paddingLeft: "20%",
                display: "flex",
                textAlign: "center",
                margin: "1em auto",
              }}
            />
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
            ) : isDone ? (
              <Alert
                message="Image has been uploaded!"
                type="success"
                showIcon
                action={
                  <Button size="small" type="text" onClick={handleCancel}>
                    Close
                  </Button>
                }
              />
            ) : (
              <button onClick={changeCoverImage}>Upload Image</button>
            )}
          </div>
        </Modal>
        <Modal
          open={isModal3Open}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[<Button onClick={handleOk}>Close</Button>]}
        >
          <textarea
            type="text"
            placeholder="Enter a description"
            id="description"
            onChange={editDescription}
            style={{
              width: "100%",
              height: "100%",
              resize: "none",
              fontFamily: "inherit",
              fontSize: "inherit",
              padding: "0.5em",
              margin: "2em auto 1em",
            }}
          />
        </Modal>
      </Header>
      <EditorWrapper onEditorReady={handleEditorReady} />
    </Content>
  );
}

export default EditNote;
