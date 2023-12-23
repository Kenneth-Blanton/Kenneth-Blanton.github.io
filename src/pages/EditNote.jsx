import { Layout, Modal, Button } from "antd";
import React, { useEffect, useState } from "react";
import EditorWrapper from "../components/EditorWrapper";
import {
  SaveOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import UserCheck from "../router/UserCheck";
import { getAuth } from "firebase/auth";
import { UserAuth } from "../data/AuthContext.js";
import { deleteDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../data/firebase.js";

const { Header, Content } = Layout;

function EditNote() {
  UserCheck();
  const { user } = UserAuth();
  const auth = getAuth();
  const location = useParams();
  const navigate = useNavigate();

  const [editorInstance, setEditorInstance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedVisible, setCompletedVisible] = useState(true);

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

  const goBack = () => {
    navigate("/");
  };

  // console.log(document.querySelector('div[data-id="completed"]'));
  const completedElement = document.querySelector(
    'div.ce-block[data-id="completed"]'
  );

  if (completedElement) {
    const completedVisElements = document.querySelectorAll(".completedVis");
    completedVisElements.forEach((element) => {
      element.style.display = "block";
    });
    console.log(completedElement);
    const nestedElement = completedElement.querySelector(".cdx-checklist");

    if (nestedElement.children.length === 0) {
      nestedElement.style.pointerEvents = "none";
      nestedElement.style.opacity = "0.5";
      nestedElement.innerHTML = `<span>No completed items</span>`;
    } else {
    }
  } else if (completedElement === null) {
    console.log(completedElement);
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

        <button>
          <MoreOutlined />
        </button>
        <Modal
          open={isModalOpen}
          onOk={handleOk}
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
      </Header>
      <EditorWrapper onEditorReady={handleEditorReady} />
    </Content>
  );
}

export default EditNote;
