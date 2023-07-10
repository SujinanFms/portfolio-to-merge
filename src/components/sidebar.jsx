import React, { useState } from "react";
import "../css/style-component.css"
import {
  FaTh,
  FaBars,
  FaUserAlt,
  FaCalendar,
  FaCommentAlt,
  FaCog,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "./images/Techwave-logo.jpeg";
import NavApp from "./navbar";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    {
      path: "/",
      name: "Dashboard",
      icon: <FaTh />,
    },
    {
      path: "/Calendar",
      name: "Calendar",
      icon: <FaCalendar />,
    },
    {
      path: "/Employee",
      name: "Employee",
      icon: <FaUserAlt />,
    },
    {
      path: "/Report",
      name: "Report",
      icon: <FaCommentAlt />,
    },
    {
      path: "/Setting",
      name: "Setting",
      icon: <FaCog />,
    },
  ];
  return (
    <div className="contain">
      <div
        style={{width: isOpen ? "200px" : "50px", overflow: "scroll initial", minHeight: "100vh",  boxShadow: "1px 2px 9px #d8d4dd" ,
        margin: "1em", borderRadius: "15px"}}
        className="sidebar"
      >
        <div className="top_section">
          <div style={{ display: isOpen ? "block" : "none" }} className="logo">
            <img
              alt=""
              src={logo}
              width="50"
            //   height="100"
              className="d-inline-block align-center"
            />
          </div>
          <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink to={item.path} key={index} className="link">
            <div
              className="icon"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {item.icon}
            </div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className="link_text"
            >
              {item.name}
            </div>
          </NavLink>
        ))}
      </div>

      <main>
        <NavApp />
        <div className='content'>
        {children}
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
