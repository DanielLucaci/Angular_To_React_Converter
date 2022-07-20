import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Hamburger from "./Layout/Hamburger/Hamburger";

const links = [
  {
    name: "Home",
    to: "/",
  },
  {
    name: "About",
    to: "/about",
  },
  {
    name: "Upload",
    to: "/upload",
  },
  {
    name: "Contact",
    to: "/contact",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(true);

  const toggleHamburger = () => {
    setOpen((open) => !open);
  };

  useEffect(() => {
    const resizeWindowHandler = () => {
      setOpen(window.innerWidth < 600 ? false : true); 
    }

    window.addEventListener('resize', resizeWindowHandler);

    return () => { 
      window.removeEventListener('resize');
    }
  }, []);

  return (
    <div className="navbar">
      <div className="logo">
        Angular<span className="two">2</span>React
      </div>
      <Hamburger onClick={toggleHamburger} isOpen={open} />
      <ul className={`links ${open ? 'open' : 'closed'}`}>
          {links.map((link, index) => {
            return (
              <li key={`navbar-link${index}`}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {link.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
    </div>
  );
}
