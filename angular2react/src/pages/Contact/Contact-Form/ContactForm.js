import { useState } from "react";
import ContactMessage from "../Contact-Message/ContactMessage";
import "./ContactForm.css";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState(null);

  const nameChangeHandler = (e) => {
    setName(e.target.value);
  };

  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const textChangeHandler = (e) => {
    setText(e.target.value);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    setStatus({
      status: "Sending message",
      color: "blue",
    });
    const message = {
      name,
      email,
      text,
    };

    try {
      await fetch(
        "https://angular-converter-default-rtdb.firebaseio.com/messages.json",
        {
          method: "POST",
          body: JSON.stringify(message),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setStatus({
        status: "Message sent successfully",
        color: "green",
      });
    } catch (e) {
      setStatus({
        status: "Sending message failed",
        color: "red",
      });
    }
    setName("");
    setEmail("");
    setText("");
  };

  const closePopupHandler = () => {
    setStatus(null);
  };

  return (
    <>
      {status !== null && (
        <ContactMessage status={status} close={closePopupHandler} />
      )}
      <form className="contact-form" onSubmit={formSubmitHandler}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          spellCheck="false"
          onChange={nameChangeHandler}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          spellCheck="false"
          onChange={emailChangeHandler}
        />
        <h3>Leave your message here</h3>
        <textarea
          placeholder="Message"
          required
          value={text}
          spellCheck="false"
          onChange={textChangeHandler}
        ></textarea>
        <button type="submit" className="submit-form">
          SEND
        </button>
      </form>
    </>
  );
}
