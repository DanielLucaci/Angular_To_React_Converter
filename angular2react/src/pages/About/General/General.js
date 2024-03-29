import "./General.css";

export default function General() {
  return (
    <div className="general">
      Angular<span className="two">2</span>React is an online application that converts Angular applications
      to React. It provides support for a full range of Angular features, such
      as components, property binding, event emitters and more (you can find more about
      this under the 'Support' section).
      <br />
      <span style={{ color: 'red'}}>Please note that the application is still under development therefore you
      may encounter bugs or conversion errors!</span>
    </div>
  );
}
