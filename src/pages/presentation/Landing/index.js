import React from "react";
import AppBar from "./home/Appbar";
import "./css/style.css";
import Footer from "./home/Footer";
import * as MUI from "./css/style";

function Presentation({ page }) {
  const [color, setColor] = React.useState(false);
  const changeColor = () => {
    if (window.scrollY >= 90) {
      setColor(true);
    } else {
      setColor(false);
    }
  };
  window.addEventListener("scroll", changeColor);
  return (
    <React.Fragment>
      <AppBar color={color} />
      <MUI.BoxHomepage>{page}</MUI.BoxHomepage>
      <Footer />
    </React.Fragment>
  );
}

export default Presentation;
