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
    name: "Compatibility",
    path: "/compatibility",
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
        <ul className="links">
          {links.map((link, index) => {
            return (
              <li key={`about-link${index}`}>
                <NavLink
                  to={`/about${link.path}`}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {link.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <Outlet />
      </div>
    </>
  );
}
