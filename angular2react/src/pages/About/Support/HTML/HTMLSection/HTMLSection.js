import { useEffect, useState } from "react";
import "./HTMLSection.css";

const HTMLSection = (props) => {
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    switch (props.tags.length) {
      case 4:
        setRows(2);
        setColumns(2);
        break;
      case 6:
        setColumns(2);
        setRows(3);
        break;
      case 9:
        setColumns(3);
        setRows(3);
        break;
      case 12:
        setColumns(3);
        setRows(4);
        break;
      default:
        break;
    }
  }, [props.tags]);

  return (
    <>
      <div
        className="section"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`section-name ${isHovered ? "hover" : ""}`}>
          <p>{props.name}</p>
        </div>
        <div
          className="section-tags"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {props.tags.map((tag) => {
            return (
              <div key={`${tag}`} className="tag">
                <a
                  href={`https://www.w3schools.com/tags/tag_${tag}.asp`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {tag}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HTMLSection;
