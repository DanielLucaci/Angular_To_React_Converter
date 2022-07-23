import { useState } from "react";
import Binding from "./Binding";
import Components from "./Components";
import Directives from "./Directives";
import "./AngularSupport.css";

const AngularSupport = () => {
  const [title, setTitle] = useState("");
  const [column, setColumn] = useState("");

  const clearTitle = () => {
    setTitle("");
  };

  const clearColumn = () => {
    setColumn("");
  };

  return (
    <>
      <div className="box">
        <div className="header">
          <div
            className="column"
            onMouseEnter={() => setTitle("components")}
            onMouseLeave={clearTitle}
          >
            <div className="column-title">
              <h2>Components</h2>
            </div>
            {(title === "components" || column === "components") && (
              <Components
                mouseEnter={() => setColumn("components")}
                mouseLeave={clearColumn}
              />
            )}
          </div>
          <div
            className="column"
            onMouseEnter={() => setTitle("binding")}
            onMouseLeave={clearTitle}
          >
            <div className="column-title">
              <h2>Binding</h2>
            </div>
            {(column === "binding" || title === "binding") && (
              <Binding
                mouseEnter={() => setColumn("binding")}
                mouseLeave={clearColumn}
              />
            )}
          </div>
          <div
            className="column"
            onMouseEnter={() => setTitle("directives")}
            onMouseLeave={clearTitle}
          >
            <div className="column-title">
              <h2>Directives</h2>
            </div>
            {(column === "directives" || title === "directives") && (
              <Directives
                mouseEnter={() => setColumn("directives")}
                mouseLeave={clearColumn}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AngularSupport;
