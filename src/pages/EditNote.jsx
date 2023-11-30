import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import EditorWrapper from "../components/EditorWrapper";
import { SaveOutlined } from "@ant-design/icons";
import UserCheck from "../router/UserCheck";
import { UserAuth } from "../data/AuthContext.js";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../data/firebase.js";

const { Header, Content, Footer, Sider } = Layout;

function EditNote() {
  UserCheck();
  const { user } = UserAuth();
  const location = useParams();

  const [editorInstance, setEditorInstance] = useState(null);

  const handleEditorReady = (editor) => {
    setEditorInstance(editor);
  };

  const handleSave = () => {
    if (editorInstance) {
      editorInstance
        .save()
        .then((outputData) => {
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
            notesMade.push(docRef.id);
            await updateDoc(doc(db, "users", user.uid), {
              notesMade,
            });
          }
          editNote();
        })
        .catch((error) => {
          console.log("Saving failed: ", error);
        });
    }
  };

  return (
    <Content style={{ padding: 0 }}>
      <Header className="main-header" editorinstance={editorInstance}>
        <button onClick={handleSave}>
          Save Note <SaveOutlined />
        </button>
      </Header>
      <EditorWrapper onEditorReady={handleEditorReady} />
    </Content>
  );
}

export default EditNote;
