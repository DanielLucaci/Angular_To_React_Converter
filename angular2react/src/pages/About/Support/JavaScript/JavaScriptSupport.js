import styles from "./JavaScriptSupport.module.css";
import events from "./javascript";
import EventBox from "./EventBox/EventBox";
import { useState } from "react";

const JavaScriptSupport = () => {
  const [indexList, setIndexList] = useState([]);

  const clickHandler = (index) => {
    if (indexList.includes(index)) {
      setIndexList((prevIndexList) =>
        prevIndexList.filter((number) => number !== index)
      );
    } else {
      setIndexList((prevIndexList) => [...prevIndexList, index]);
    }
  };

  return (
    <>
      <div className={styles.box}>
        {events.map((event, index) => {
          return (
            <EventBox
              toggle={!indexList.includes(index)}
              key={event.title}
              {...event}
              onClick={() => clickHandler(index)}
            />
          );
        })}
      </div>
    </>
  );
};

export default JavaScriptSupport;
