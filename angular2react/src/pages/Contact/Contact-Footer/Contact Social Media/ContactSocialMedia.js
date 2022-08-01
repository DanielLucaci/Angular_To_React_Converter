import { useEffect, useState } from "react";
import {
  AiFillGithub,
  AiFillTwitterCircle,
  AiFillLinkedin,
  AiFillInstagram,
} from "react-icons/ai";
import "./ContactSocialMedia.css";

export default function ContactSocialMedia() {
  const [size, setSize] = useState(30);

  useEffect(() => {
    const resizeWindowHandler = () => {
      setSize(window.innerWidth < 650 ? 20 : 30);
    };

    window.addEventListener("resize", resizeWindowHandler);

    return () => {
      window.removeEventListener("resize", resizeWindowHandler);
    };
  }, []);

  return (
    <div className="social-media">
      <h4>Social Media</h4>
      <ul className="links">
        <li>
          <a href="https://github.com/DanielLucaci/">
            <AiFillGithub size={size} />
          </a>
        </li>
        <li>
          <a href="https://twitter.com">
            <AiFillTwitterCircle size={size} />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/daniel-lucaci-324481212/">
            <AiFillLinkedin size={size} />
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com">
            <AiFillInstagram size={size} />
          </a>
        </li>
      </ul>
    </div>
  );
}
