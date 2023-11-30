import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Col, Row, Modal } from "antd";
import { ClockCircleOutlined, MoreOutlined } from "@ant-design/icons";

const NoteCard = ({ note }) => {
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
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="card"
      style={{
        border: "1px solid black",
        borderRadius: 5,
        width: "100%",
        paddingTop: "56.25%",
        position: "relative",
      }}
    >
      <div
        style={{
          padding: 10,
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <NavLink
          to={`/n/${note.id}`}
          style={{
            height: "100%",
            display: "flex",
          }}
        >
          <span
            className="card-title"
            style={{
              fontSize: 48,
              fontWeight: 700,
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              backgroundColor: "rgba(100,100,100,.1)",
              color: "black",
            }}
          >
            {note.title || "Untitled"}
          </span>
        </NavLink>
        <div
          style={{
            position: "absolute",
            padding: 10,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(100,100,100,.1)",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Row
            style={
              {
                // padding: "0 2em",
              }
            }
          >
            <Col span={8} style={{ textAlign: "left" }}>
              <span>
                {note.createdAt
                  ? new Date(note.createdAt.seconds * 1000).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )
                  : null}
              </span>
            </Col>
            <Col span={8} style={{ fontSize: 20 }}>
              {getDueDate() ? (
                <span>
                  {getDueDate()} <ClockCircleOutlined />
                </span>
              ) : null}
            </Col>

            <Col span={8} style={{ textAlign: "right", fontSize: 20 }}>
              <span
                onClick={showModal}
                style={{
                  border: "1px solid lightgrey",
                  borderRadius: 4,
                  padding: 2,
                  cursor: "pointer",
                  color: "lightgrey",
                }}
              >
                <MoreOutlined />
              </span>
            </Col>
            <Modal
              title="Basic Modal"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Modal>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
