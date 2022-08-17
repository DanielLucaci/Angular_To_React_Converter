import { MdDoubleArrow } from "react-icons/md";
import styles from "./EventBox.module.css";
import React from "react";

const EventBox = (props) => {
  return (
    <div className={styles.events}>
      <h1
        className={`${!props.toggle && styles.active}`}
        onClick={props.onClick}
      >
        {props.title}
      </h1>
      <div className={styles["event-list"]}>
        <ul className={`${props.toggle ? styles["toggle"] : ""}`}>
          {props.list.map((event) => {
            return (
              <li key={event}>
                <div className={styles.logo}>
                  <MdDoubleArrow />
                </div>
                <div className={styles.event}>
                  <a
                    href={`https://developer.mozilla.org/en-US/docs/Web/API/Element/${event}_event`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {event}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default React.memo(EventBox);
