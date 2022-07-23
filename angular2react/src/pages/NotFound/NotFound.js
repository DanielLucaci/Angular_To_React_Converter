import styles from "./NotFound.module.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const btnClickHandler = () => {
    navigate("/");
  };

  return (
    <>
      <div className={styles.background}>
        <div className={styles.main}>
          <div className={styles["number"]}>404</div>
          <div className={styles.description}>Page Not Found</div>
          <button className={styles.btn} onClick={btnClickHandler}>
            Back to home
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
