import { createPortal } from "react-dom";
import "./Modal.css";

const Modal = ({ onDragOver, onDrop }) => {
  return createPortal(
    <div className="modal" onDragOver={onDragOver} onDrop={onDrop}>
      Drop your archive
    </div>,
    document.getElementById("modal")
  );
};

export default Modal;
