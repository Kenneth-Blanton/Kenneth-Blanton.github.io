import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../data/firebase.js";
import { set } from "firebase/database";

const EditorWrapper = ({ onEditorReady }) => {
  const location = useParams();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    async function getNote() {
      if (!location.id) {
        const editor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: Header,
          },
          placeholder: "Let's get optimal! 🚀",

          data: {
            blocks: [],
          },
          onReady: () => {
            console.log("Editor.js is ready to work!");
            onEditorReady(editor);
          },
        });
        return;
      }
      const docRef = doc(db, "notes", location.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setNote(docSnap);
        setTitle(docSnap.data().title);
        console.log(docSnap.data());
        const editor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: Header,
          },
          placeholder: "Let's get optimal! 🚀",

          data: {
            blocks: docSnap.data().data,
          },
          onReady: () => {
            console.log("Editor.js is ready to work!");
            onEditorReady(editor);
          },
        });
        return;
      }
    }
    getNote();
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    setTitle(e.target.value);
  };

  // editor.isReady
  //   .then(() => {
  //     console.log("Editor.js is ready to work!");
  //     /** Do anything you need after editor initialization */
  //   })
  //   .catch((reason) => {
  //     console.log(`Editor.js initialization failed because of ${reason}`);
  //   });

  return (
    <div
      className="editor-wrapper"
      style={{
        padding: 0,
        margin: 0,
        backgroundColor: "#282828",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "calc(100vh - 128px)",
        overflow: "auto",
      }}
    >
      <div
        id="editorjs"
        style={{
          padding: "0 2%",
          margin: 0,
          height: "100%",
          width: "800px",
          maxWidth: "100%",
          maxHeight: "calc(100vh - 148px)",
          backgroundColor: "lightgray",
          border: "1px solid black",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            padding: "1em ",
            textAlign: "center",
            width: "100%",
            justifyContent: "space-around",
            display: "block",
          }}
        >
          <input
            type="text"
            placeholder={note ? note.data().title : "Enter Title"}
            style={{
              background: "none",
              border: "none",
              textAlign: "center",
              fontSize: 20,
              color: "rgba(100,100,100,.8)",
            }}
            value={title}
            onChange={handleChange}
            id="noteTitle"
          />

          <span style={{ color: "rgba(100,100,100,.8)", display: "block" }}>
            {note && note.data().lastModified
              ? "Last Modified " +
                note.data().lastModified.toDate().toDateString()
              : new Date().toDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditorWrapper;
