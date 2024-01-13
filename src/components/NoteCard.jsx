import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Col, Row, Modal, Avatar, Card } from "antd";
import {
  ClockCircleOutlined,
  MoreOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { db } from "../data/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import UserCheck from "../router/UserCheck.jsx";

const NoteCard = ({ note }) => {
  const [lastModifiedBy, setLastModifiedBy] = useState(null);
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const userId = UserCheck().uid;

  useEffect(() => {
    async function getLastModifiedBy() {
      if (note.lastModifiedBy) {
        const userRef = await doc(db, "users", note.lastModifiedBy);
        const userSnap = await getDoc(userRef);
        const username = userSnap.data().username;
        setLastModifiedBy(username);
      }
    }

    getLastModifiedBy();
    console.log(note.createdAt);
  }, []);

  const { Meta } = Card;

  function getDueDate() {
    const currentDate = new Date();
    if (note.dueDate) {
      const dueDate = new Date(note.dueDate.seconds * 1000);
      const diffTime = Math.abs(dueDate.getTime() - currentDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } else {
      return null;
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModal2 = () => {
    setIsModal2Open(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsModal2Open(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModal2Open(false);
  };

  const handleTitleChange = async (e) => {
    if (!note.id) {
      console.log("no location id");
    } else {
      await updateDoc(doc(db, "notes", note.id), {
        title: e.target.value,
        lastModified: new Date(),
        lastModifiedBy: userId,
      });
      setTitle(e.target.value);
    }
  };

  const editDescription = async (e) => {
    await updateDoc(doc(db, "notes", note.id), {
      description: e.target.value,
    });
    setDescription(e.target.value);
  };

  return (
    <Card
      style={{
        width: "100%",
        aspectRatio: "16/9",
      }}
      cover={
        <NavLink
          to={`/n/${note.id}`}
          style={{
            backgroundImage: `url(${note.backgroundImage})`,
            border: "1px solid black",
          }}
          className={"antCardCoverPhoto"}
        >
          {note.backgroundImage ? null : (
            // <img src={note.backgroundImage} style={{ height: "100%" }} />
            <span className="antCardCoverPhoto">{note.title}</span>
          )}
        </NavLink>
      }
      actions={[
        <EditOutlined key="edit" onClick={showModal} />,

        <span>{null}</span>,
        <EllipsisOutlined key="ellipsis" onClick={showModal2} />,
      ]}
    >
      <Meta
        style={{ textAlign: "center" }}
        title={note.backgroundImage ? title : null}
        description={description}
      />
      <Modal
        title="Editing Note"
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
          placeholder={note.title}
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
          placeholder={note.description ? note.description : "Description"}
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
        title={note.title}
        open={isModal2Open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          <b>Note created</b>:{" "}
          {note.createdAt
            ? new Date(note.createdAt.seconds * 1000).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              )
            : null}
        </p>
        <p>
          <b>Last Modified</b>:{" "}
          {note.lastModified
            ? new Date(note.lastModified.seconds * 1000).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              )
            : null}
        </p>
        <p>
          <b>Last Modified By</b>:{" "}
          {lastModifiedBy
            ? lastModifiedBy
            : "No one has modified this note yet"}
        </p>
      </Modal>
    </Card>
  );
};

export default NoteCard;
