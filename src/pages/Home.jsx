import Desktop from "../components/Desktop";
import Mobile from "../components/Mobile";
import { useState, useEffect } from "react";

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  let width = window.innerWidth;
  useEffect(() => {
    setIsMobile(width < 750);
  }, [width]);

  return <div className="home">{isMobile ? <Mobile /> : <Desktop />}</div>;
};

export default Home;
