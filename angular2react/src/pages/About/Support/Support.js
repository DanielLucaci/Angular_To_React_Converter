import styles from "./Support.module.css";
import { NavLink, Routes, Route, useLocation } from "react-router-dom";
import AngularSupport from "./Angular/AngularSupport";
import HTMLSupport from "./HTML/HTMLSupport";
import AngularIcon from "./angular_logo_icon.png";
import HTMLIcon from "./html_logo_icon.png";
import JavascriptIcon from "./javascript_logo_icon.png";
import JavaScriptSupport from "./JavaScript/JavaScriptSupport";

export default function Support() {
  const location = useLocation();
  const path = location.pathname.split("/").slice(-1)[0];

  return (
    <>
      <div className={styles.nav}>
        <div
          className={`${styles["nav-item"]} ${
            path === "angular" ? styles["active"] : ""
          }`}
        >
          <NavLink
            to="angular"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <img src={AngularIcon} alt="angular logo" />
          </NavLink>
        </div>
        <div
          className={`${styles["nav-item"]} ${
            path === "html" ? styles["active"] : ""
          }`}
        >
          <NavLink
            to="html"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <img src={HTMLIcon} alt="html logo" />
          </NavLink>
        </div>
        <div
          className={`${styles["nav-item"]} ${
            path === "javascript" ? styles["active"] : ""
          }`}
        >
          <NavLink
            to="javascript"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <img src={JavascriptIcon} alt="javascript logo" />
          </NavLink>
        </div>
      </div>

      <Routes>
        <Route path="angular" element={<AngularSupport />}></Route>
        <Route path="html" element={<HTMLSupport />}></Route>
        <Route path="javascript" element={<JavaScriptSupport />}></Route>
      </Routes>
    </>
  );
}
