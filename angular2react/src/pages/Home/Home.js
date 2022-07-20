import "./Home.css";
import { Link } from "react-router-dom";
import Background from "../../components/Layout/Background";

export default function Home() {
  return (
    <>
      <Background page="home" />
      <div className="home center">
        <h1 className="title">
          Angular<span className="two">2</span>React
        </h1>
        <p className="description">
          Have you ever considered converting your Angular app to React ? <br />
          <span className="bold">Try now for free!</span>
        </p>
        <Link to="/about" className="cta">
          Get started
        </Link>
      </div>
    </>
  );
}
