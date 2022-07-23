import styles from "./HTMLSupport.module.css";
import html from "./html";
import HTMLSection from "./HTMLSection/HTMLSection";

const HTMLSupport = () => {
  return (
    <>
      <div className={styles.box}>
        {html.map((section, index) => (
          <HTMLSection key={section.name} {...section} />
        ))}
      </div>
    </>
  );
};

export default HTMLSupport;
