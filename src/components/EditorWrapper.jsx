import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import { updateDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { renderToString } from "react-dom/server";
import ReactDOM from "react-dom/client";
import React, { useEffect, useState } from "react";
import { db } from "../data/firebase.js";
import { getAuth } from "firebase/auth";
import { set } from "firebase/database";

const EditorWrapper = ({ onEditorReady }) => {
  const location = useParams();
  const auth = getAuth();

  // const [userId, setUserId] = useState(null);
  // console.log(user);
  const [note, setNote] = useState(null);
  const [fireData, setFireData] = useState(null);

  const handleTitleChange = async (e) => {
    const userId = auth.currentUser.uid;
    if (!location.id) {
      console.log("no location id");
    } else {
      await updateDoc(doc(db, "notes", location.id), {
        title: e.target.value,
        lastModified: new Date(),
        lastModifiedBy: userId,
      });
    }
  };

  useEffect(() => {
    async function getNote() {
      if (!location.id) {
        const editor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: Header,
            list: {
              class: NestedList,
              inlineToolbar: true,
              config: {
                defaultStyle: "unordered",
              },
            },
            checklist: {
              class: Checklist,
              inlineToolbar: true,
            },
          },
          placeholder: "Let's get optimal! 🚀",

          data: {
            blocks: [],
          },
          onReady: () => {
            onEditorReady(editor);

            const NewDivComponent = () => (
              <div
                style={{
                  padding: "1em ",
                  textAlign: "center",
                  width: "100%",
                  justifyContent: "space-around",
                  display: "block",
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                  backgroundColor: "lightgray",
                }}
              >
                <input
                  type="text"
                  placeholder={fireData ? fireData.data().title : "Enter Title"}
                  style={{
                    background: "none",
                    border: "none",
                    textAlign: "center",
                    fontSize: 20,
                    color: "rgba(100,100,100,.8)",
                  }}
                  onChange={handleTitleChange}
                  id="noteTitle"
                />
                <span
                  style={{ color: "rgba(100,100,100,.8)", display: "block" }}
                >
                  {fireData && fireData.data().lastModified
                    ? "Last Modified " +
                      fireData.data().lastModified.toDate().toDateString()
                    : new Date().toDateString()}
                </span>
              </div>
            );

            const editorjs = document.getElementById("editorjs");

            // Create a new div element
            const newDiv = document.createElement("div");

            // Insert the new div before editorjs
            editorjs.prepend(newDiv);

            const root = ReactDOM.createRoot(newDiv);
            root.render(<NewDivComponent />);
          },
          onChange: () => {},
        });
        return;
      }
      const docRef = doc(db, "notes", location.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNote(docSnap);
        setFireData(docSnap);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    getNote();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (note !== null) {
      // setTitle(document.getElementById("noteTitle").value);
      // console.log(note);

      const editor = new EditorJS({
        holder: "editorjs",

        tools: {
          header: Header,
          list: {
            class: NestedList,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
        },
        placeholder: "Let's get optimal! 🚀",
        data: {
          blocks: note.blocks || note.data().data,
        },
        onReady: async () => {
          onEditorReady(editor);

          const NewDivComponent = () => (
            <div
              style={{
                padding: "1em ",
                textAlign: "center",
                width: "100%",
                justifyContent: "space-around",
                display: "block",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
                backgroundColor: "lightgray",
              }}
            >
              <input
                type="text"
                placeholder={fireData ? fireData.data().title : "Enter Title"}
                style={{
                  background: "none",
                  border: "none",
                  textAlign: "center",
                  fontSize: 20,
                  color: "rgba(100,100,100,.8)",
                  width: fireData
                    ? `${fireData.data().title.length * 15}px`
                    : "100%",
                }}
                onChange={handleTitleChange}
                id="noteTitle"
              />
              <span style={{ color: "rgba(100,100,100,.8)", display: "block" }}>
                {fireData && fireData.data().lastModified
                  ? "Last Modified " +
                    fireData.data().lastModified.toDate().toDateString()
                  : new Date().toDateString()}
              </span>
            </div>
          );

          const editorjs = document.getElementById("editorjs");

          // Create a new div element
          const newDiv = document.createElement("div");

          // Insert the new div before editorjs
          editorjs.prepend(newDiv);

          const root = ReactDOM.createRoot(newDiv);
          root.render(<NewDivComponent />);
        },
        onChange: (api, event) => {
          editor.save().then(async (outputData) => {
            const docRef = doc(db, "notes", location.id);
            const docSnap = await getDoc(docRef);
            const userId = auth.currentUser.uid;
            // console.log(outputData.blocks);

            // This is where we return the checked items to their original checklist
            const outputCompletedBlock = outputData.blocks.find(
              (block) => block.id === "completed"
            );

            if (outputCompletedBlock === undefined) {
              let checkedItems = [];
              outputData.blocks = outputData.blocks.map((block) => {
                if (block.type === "checklist" && block.id !== "completed") {
                  const checkedInBlock = block.data.items
                    .filter(
                      (item) => item.checked === true && !item.completedAt
                    )
                    .map((item) => ({
                      ...item,
                      originChecklistId: block.id,
                      completedAt: new Date(),
                    }));
                  checkedItems = [...checkedItems, ...checkedInBlock];
                  block.data.items = block.data.items.filter(
                    (item) => item.checked !== true || item.completedAt
                  );
                }
                return block;
              });
              if (checkedItems.length > 0) {
                // const completedBlockIndex = docSnap
                //   .data()
                //   .data.findIndex((block) => block.id === "completed");
                const completedBlock = docSnap
                  .data()
                  .data.find((block) => block.id === "completed");
                if (completedBlock === undefined) {
                  const otherChecklists = outputData.blocks.filter(
                    (block) => block.id !== "completed"
                  );
                  const newOutputData = [
                    ...otherChecklists,
                    {
                      id: "completed",
                      type: "checklist",
                      data: { items: checkedItems },
                    },
                  ];
                  await updateDoc(docRef, {
                    data: newOutputData,
                  });
                  setNote({ blocks: newOutputData });
                  outputData.blocks = newOutputData;
                  editor.destroy();
                } else {
                  const completedItems = completedBlock.data.items;
                  const newCompletedItems = [
                    ...completedItems,
                    ...checkedItems,
                  ];
                  const otherChecklists = outputData.blocks.filter(
                    (block) => block.id !== "completed"
                  );

                  const newOutputData = [
                    ...otherChecklists,
                    {
                      id: "completed",
                      type: "checklist",
                      data: { items: newCompletedItems },
                    },
                  ];
                  await updateDoc(docRef, {
                    data: newOutputData,
                  });
                  setNote({ blocks: newOutputData });
                  outputData.blocks = newOutputData;
                  editor.destroy();
                }
              }
            } else {
              const uncheckedItem = outputCompletedBlock.data.items.find(
                (item) => !item.checked
              );

              const data = docSnap.data().data;

              if (uncheckedItem) {
                let matchingItem;
                for (let block of data) {
                  if (block.data && block.data.items) {
                    matchingItem = block.data.items.find(
                      (item) => item.text === uncheckedItem.text
                    );
                    if (matchingItem) {
                      break;
                    }
                  }
                }

                const completedChecklist = data.find(
                  (block) => block.id === "completed"
                );

                completedChecklist.data.items =
                  completedChecklist.data.items.filter(
                    (item) => item.text !== matchingItem.text
                  );

                const originalChecklist = data.find(
                  (block) => block.id === matchingItem.originChecklistId
                );
                originalChecklist.data.items.push({
                  text: uncheckedItem.text,
                  checked: false,
                });
                await updateDoc(docRef, {
                  data: data,
                });

                setNote({ blocks: data });
                outputData.blocks = data;
                editor.destroy();
              }
            }

            // End of returning checked items to their original checklist

            // This is where we add the checked items to the completed block
            let checkedItems = [];
            outputData.blocks = outputData.blocks.map((block) => {
              if (block.type === "checklist" && block.id !== "completed") {
                const checkedInBlock = block.data.items
                  .filter((item) => item.checked === true && !item.completedAt)
                  .map((item) => ({
                    ...item,
                    originChecklistId: block.id,
                    completedAt: new Date(),
                  }));
                checkedItems = [...checkedItems, ...checkedInBlock];
                block.data.items = block.data.items.filter(
                  (item) => item.checked !== true || item.completedAt
                );
              }
              return block;
            });

            if (checkedItems.length > 0) {
              const completedBlockIndex = outputData.blocks.findIndex(
                (block) => block.id === "completed"
              );
              if (completedBlockIndex == -1) {
                outputData.blocks.push({
                  type: "checklist",
                  id: "completed",
                  data: {
                    items: checkedItems,
                  },
                });
                await updateDoc(docRef, {
                  data: outputData.blocks,
                });
              } else {
                const completedBlock = docSnap
                  .data()
                  .data.find((block) => block.id === "completed");
                const completedItems = completedBlock.data.items;
                const newCompletedItems = [...completedItems, ...checkedItems];
                const otherChecklists = outputData.blocks.filter(
                  (block) => block.id !== "completed"
                );

                const newOutputData = [
                  ...otherChecklists,
                  {
                    id: "completed",
                    type: "checklist",
                    data: { items: newCompletedItems },
                  },
                ];
                await updateDoc(docRef, {
                  data: newOutputData,
                });
                setNote({ blocks: newOutputData });
                outputData.blocks = newOutputData;
                editor.destroy();
              }
            }

            const unsubscribe = onSnapshot(
              doc(db, "notes", location.id),
              async (doc) => {
                let completedChecklist = doc
                  .data()
                  .data.find((block) => block.id === "completed");

                if (completedChecklist === undefined) {
                  completedChecklist = {
                    id: "completed",
                    type: "checklist",
                    data: { items: [] },
                  };
                }

                // Filter out the completed checklist from outputData.blocks
                let updatedOutputDataBlocks = outputData.blocks.filter(
                  (block) => block.id !== "completed"
                );

                // Push the completed checklist from doc.data().data into updatedOutputDataBlocks
                updatedOutputDataBlocks.push(completedChecklist);

                // Update outputData.blocks
                outputData.blocks = updatedOutputDataBlocks;

                // Update the Firestore document
                await updateDoc(docRef, {
                  data: outputData.blocks,
                  // lastModified: new Date(),
                  lastModifiedBy: userId,
                });

                unsubscribe();
                return;
              }
            );

            await updateDoc(docRef, {
              lastModified: new Date(),
              lastModifiedBy: userId,
            });
          });
        },
      });
      return;
    }
  }, [note]);

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
          width: "800px",
          maxWidth: "100%",
          maxHeight: "calc(100vh - 148px)",
        }}
      ></div>
    </div>
  );
};

export default EditorWrapper;
