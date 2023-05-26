import Calendar from "react-calendar";
import React, { useState } from "react";
import { Card, List } from "antd";

const Desktop = () => {
  const [value, onChange] = useState(new Date());
  const data = [
    {
      title: "Title 1",
    },
  ];

  return (
    <>
      <section style={{ flex: 1 }}>
        <Calendar onChange={onChange} value={value} />
        <section>
          <div className="event-tab">
            <button>Create Event</button>
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    style={{ width: "100%", margin: 16 }}
                    title={item.title}
                  >
                    Card content
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </section>
      </section>
      <section style={{ flex: 1 }}>Hello World</section>
    </>
  );
};

export default Desktop;
