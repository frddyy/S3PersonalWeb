import React from "react";
import "../../App.css";
import "./index.css";
import Sidebar from "../../components/personal/sidebar/Sidebar";
import Home from "../../components/personal/home/Home";
import Resume from "../../components/personal/resume/Resume";
import Portofolio from "../../components/personal/portofolio/Portofolio";
import About from "../../components/personal/about/About";
import Contact from "../../components/personal/contact/Contact";
// import Layout from "../layout";
import Topbar from "../../components/global/Topbar";

const Personal = () => {
  return (
    <>
      <Sidebar />
      <main className="main">
        <Topbar />
        <Home />
        <About />
        <Resume />
        <Portofolio />
      </main>
    </>
  );
};
export default Personal;
