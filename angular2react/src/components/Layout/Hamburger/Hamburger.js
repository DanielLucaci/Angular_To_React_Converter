import './Hamburger.css'

export default function Hamburger(props) {
  return (
    <div className={`menu-btn ${props.isOpen && 'open'}`} onClick={props.onClick}>
      <div className="menu-btn__burger"></div>
    </div>
  );
}
