import { useState } from "react";
import Background from "../../components/Layout/Background";
import Spinner from "../../components/Layout/Spinner";
import "./Converter.css";

export default function Converter() {
  const [percentage] = useState(0);
  const [message, ] = useState("No Message");

  return (
    <>
      <Background page="converter" />
      <Spinner />
      {message !== "" && <div className="message">{message}</div>}
      <div className="bar">
        <div
          className="loading"
          style={{
            width: `${percentage}%`,
          }}
        ></div>
        <p className="percentage">{percentage}%</p>
      </div>
    </>
  );
}
