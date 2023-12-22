import { Layout, Modal, Button } from "antd";
import React, { useEffect, useState } from "react";
import EditorWrapper from "../components/EditorWrapper";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";
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

  async function checkUser() {
    const docRef = doc(db, "notes", location.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.data().hasAccess.includes(auth.currentUser.uid)) {
      console.log("has access");
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
      <Header className="main-header" editorinstance={editorInstance}>
        {/* <button onClick={handleSave}>
          Save Note <SaveOutlined />
        </button> */}
        <button onClick={goBack}>
          Save and Exit <SaveOutlined />
        </button>
        <button onClick={showModal} className="handleDeleteButton">
          Delete Note <DeleteOutlined />
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
