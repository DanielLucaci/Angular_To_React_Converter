import { NavLink, Outlet } from "react-router-dom";
import Background from "../../components/Layout/Background";
import "./About.css";

const links = [
  {
    name: "General",
    path: "/general",
  },
  {
    name: "How to use?",
    path: "/how-to-use",
  },
  {
    name: "Support",
    path: "/support",
  },
  {
    name: "FAQ",
    path: "/FAQ",
  },
];

export default function About() {
  return (
    <>
      <Background page="general"></Background>
      <div className="about">
        <div className="links">
          {links.map((link, index) => {
            return (
              <NavLink
                key={`about-link${index}`}
                to={`/about${link.path}`}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {link.name}
              </NavLink>
            );
          })}
        </div>
        <Outlet />
      </div>
    </>
  );
}
