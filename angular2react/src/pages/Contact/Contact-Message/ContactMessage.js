//import { useState } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import "./ContactMessage.css";

const ContactMessage = ({ status, close }) => {
  useEffect(() => {
    const identifier = setTimeout(() => {
      close();
    }, 6000);

    return () => {
      clearTimeout(identifier);
    };
  });

  return createPortal(
    <div
      className="message-status"
      style={{
        backgroundColor: status.color,
      }}
    >
      <div className="x" onClick={close}>
        <AiOutlineClose />
      </div>
      <p>{status.status}</p>
    </div>,
    document.getElementById("message-status")
  );
};

export default ContactMessage;
