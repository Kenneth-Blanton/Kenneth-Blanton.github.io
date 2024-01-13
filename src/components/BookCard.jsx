import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  EditOutlined,
  EllipsisOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { db } from "../data/firebase";
import { UserAuth } from "../data/AuthContext";
import { Col, Row, Modal, Avatar, Card, Tooltip } from "antd";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { get, set } from "firebase/database";
const { Meta } = Card;

const BookCard = ({ book }) => {
  const { user } = UserAuth();
  const [description, setDescription] = useState(book.description);
  const [title, setTitle] = useState(book.title);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);
  const [notes, setNotes] = useState([]);
  // Each book has a book.notes data field that is an array of note ids
  // With every note in books.notes I want to make a new listing when the book is clicked
  // Each listing is a link to the note ex: /n/dxzfgbszuifbs
  // The note will only be accessible if the user's uid is in the hasAccess array in the notes document

  useEffect(() => {
    async function getNotes() {
      if (!book.notes) {
        console.log("no notes");
      } else {
        book.notes.forEach(async (note) => {
          const docRef = doc(db, "notes", note);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().hasAccess.includes(user.uid)) {
            const userRef = doc(db, "users", docSnap.data().lastModifiedBy);
            const userSnap = await getDoc(userRef);
            setNotes((notes) => [...notes, [docSnap, userSnap]]);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }

          // function getDueDate() {
          // const currentDate = new Date();
          // if (docSnap.data().dueDate) {
          //   const dueDate = new Date(docSnap.data().seconds * 1000);
          //   const diffTime = Math.abs(
          //     dueDate.getTime() - currentDate.getTime()
          //   );
          //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          //   return diffDays;
          // } else {
          //   return null;
          // }
          // }
        });
      }
    }

    getNotes();
  }, []);

  console.log(notes);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModal2 = () => {
    setIsModal2Open(true);
  };

  const showModal3 = () => {
    setIsModal3Open(true);
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

  const handleTitleChange = async (e) => {
    if (!book.id) {
      console.log("no location id");
    } else {
      await updateDoc(doc(db, "books", book.id), {
        title: e.target.value,
        lastModified: new Date(),
        lastModifiedBy: user.uid,
      });
      setTitle(e.target.value);
    }
  };

  const editDescription = async (e) => {
    await updateDoc(doc(db, "books", book.id), {
      description: e.target.value,
    });
    setDescription(e.target.value);
  };

  return (
    <div className="cascading-card">
      <div className="cascading-card-inner">
        <Card
          style={{
            width: "100%",
            aspectRatio: "16/9",
          }}
          cover={
            <button
              style={{
                backgroundImage: `url(${book.backgroundImage})`,
                border: "1px solid black",
              }}
              className={"antCardCoverPhoto"}
              onClick={showModal3}
            >
              {book.backgroundImage ? null : (
                <span className="antCardCoverPhoto">{book.title}</span>
              )}
            </button>
          }
          actions={[
            <EditOutlined key="edit" onClick={showModal} />,

            <span>{null}</span>,
            <EllipsisOutlined key="ellipsis" onClick={showModal2} />,
          ]}
        >
          <Meta
            avatar={<Avatar src={user.photoURL} />}
            title={title}
            description={description}
          />
          <Modal
            title="Editing Book"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            style={{ padding: 32 }}
          >
            <label>
              <b>Title</b>
            </label>
            <br />
            <input
              type="text"
              placeholder={book.title}
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
              placeholder={book.description ? book.description : "Description"}
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
          <Modal
            title={"Notes in " + book.title}
            open={isModal3Open}
            onOk={handleOk}
            onCancel={handleCancel}
            style={{ padding: 32, minWidth: "375px" }}
            className="notesListingModal"
          >
            {notes.map((note) => {
              let dueDateOutput;
              const currentDate = new Date();
              if (note[0].data().dueDate) {
                const dueDate = new Date(note[0].data().dueDate.seconds * 1000);
                const diffTime = dueDate.getTime() - currentDate.getTime();

                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                console.log(diffDays);

                if (diffDays < 0) {
                  dueDateOutput = "Past Due";
                } else if (
                  diffDays < 1 &&
                  note[0].data().dueDate.toDate().getDay() ==
                    new Date().getDay()
                ) {
                  dueDateOutput = "Due Today";
                } else if (diffDays < 1) {
                  dueDateOutput = "Due Tomorrow";
                } else if (diffDays > 1) {
                  dueDateOutput = `${Math.ceil(diffDays)} Days Remaining!`;
                }
              }
              return (
                <NavLink
                  to={`/n/${note[0].id}`}
                  key={note[0].id}
                  style={{
                    display: "block",
                    border: "1px solid black",
                    textDecoration: "none",
                    padding: "1em",
                    alignItems: "center",
                    display: "flex",
                    height: 50,
                    justifyContent: "space-between",
                    margin: "1em 0",
                    borderRadius: 8,
                    backgroundColor: "none",
                  }}
                >
                  <div style={{ alignItems: "center", display: "flex" }}>
                    {note[0].data().backgroundImage ? (
                      <img
                        src={note[0].data().backgroundImage}
                        alt=""
                        width={60}
                        style={{ marginRight: 16 }}
                      />
                    ) : null}

                    <span style={{ color: "black", fontSize: 16 }}>
                      {note[0].data().title}
                    </span>
                    {note[0].data().dueDate ? (
                      <Tooltip
                        title={
                          <div style={{ textAlign: "center" }}>
                            <div>
                              Due Date:{" "}
                              {new Date(
                                note[0].data().dueDate.seconds * 1000
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div>{dueDateOutput}</div>
                          </div>
                        }
                      >
                        <ClockCircleOutlined
                          style={{ padding: 4, color: "black" }}
                        />
                      </Tooltip>
                    ) : null}
                  </div>

                  <div style={{ alignItems: "center", display: "flex" }}>
                    <Tooltip title="Last Modified">
                      <span style={{ color: "black" }}>
                        {new Date(
                          note[0].data().lastModified.seconds * 1000
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </Tooltip>

                    <Tooltip
                      title={"Last Modified By " + note[1].data().username}
                    >
                      <img
                        src={note[1].data().profilePicture}
                        alt=""
                        width={40}
                        style={{ marginLeft: 8, borderRadius: 8 }}
                      />
                    </Tooltip>
                  </div>
                </NavLink>
              );
            })}
          </Modal>
        </Card>
      </div>
    </div>
  );
};

export default BookCard;
