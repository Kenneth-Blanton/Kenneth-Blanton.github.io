import { Layout, Modal, Button } from "antd";
import React, { useEffect, useState } from "react";
import EditorWrapper from "../components/EditorWrapper";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import UserCheck from "../router/UserCheck";
import { UserAuth } from "../data/AuthContext.js";
import {
  collection,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../data/firebase.js";

const { Header, Content, Footer, Sider } = Layout;

function EditNote() {
  UserCheck();
  const { user } = UserAuth();
  const location = useParams();
  const navigate = useNavigate();

  const [editorInstance, setEditorInstance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditorReady = (editor) => {
    setEditorInstance(editor);
  };

  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (editorInstance) {
      editorInstance.on("change", () => {
        ((outputData) => {
          console.log(outputData);
        }).catch((error) => {
          console.error("Saving failed: ", error);
        });
      });
    }
  }, [editorInstance]);

  const handleSave = () => {
    if (editorInstance) {
      editorInstance
        .save()
        .then((outputData) => {
          console.log(outputData);
          const noteTitle = document.getElementById("noteTitle").value;
          const dataWithNoteTitle = {
            title: noteTitle,
            blocks: outputData.blocks,
          };
          async function editNote() {
            const docRef = doc(db, "notes", location.id);
            await updateDoc(docRef, {
              dueDate: null, // Set this to the actual due date
              title: noteTitle,
              book: null, // Set this to the actual book ID
              backgroundImage: null, // Set this to the actual background image URL
              data: dataWithNoteTitle.blocks,
              isPrivate: false, // Set this to the actual privacy status
              lastModified: new Date(),
              lastModifiedBy: user.uid,
              alertsOn: false, // Set this to the actual alerts status
            });
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            const notesMade = userDocSnap.data().notesMade;
            if (!notesMade.includes(docRef.id)) {
              notesMade.push(docRef.id);
              await updateDoc(doc(db, "users", user.uid), {
                notesMade,
              });
            }
          }
          editNote();
        })
        .catch((error) => {
          console.log("Saving failed: ", error);
        });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
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
        <button onClick={handleSave}>
          Save Note <SaveOutlined />
        </button>
        {/* <button>
          Save and Exit <SaveOutlined />
        </button> */}
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
