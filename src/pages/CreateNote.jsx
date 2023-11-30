import { Layout } from "antd";
import React, { useState } from "react";
import EditorWrapper from "../components/EditorWrapper";
import { SaveOutlined } from "@ant-design/icons";
import UserCheck from "../router/UserCheck";
import { UserAuth } from "../data/AuthContext.js";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../data/firebase.js";

const { Header, Content, Footer, Sider } = Layout;

function CreateNote() {
  UserCheck();
  const { user } = UserAuth();

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
          async function createNote() {
            const docRef = await addDoc(collection(db, "notes"), {
              madeBy: user.uid,
              createdAt: new Date(),
              dueDate: null, // Set this to the actual due date
              title: noteTitle,
              book: null, // Set this to the actual book ID
              backgroundImage: null, // Set this to the actual background image URL
              data: dataWithNoteTitle.blocks,
              isPrivate: false, // Set this to the actual privacy status
              hasAccess: [user.uid], // Set this to the actual list of user IDs
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
          createNote();
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

export default CreateNote;
