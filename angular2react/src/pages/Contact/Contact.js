import "./Contact.css";
import ContactForm from "./Contact-Form/ContactForm";
import ContactFooter from "./Contact-Footer/ContactFooter";
import Background from "../../components/Layout/Background";

export default function Contact() {

  return (
    <>
      <Background page="contact" />
      <div className="contact">
        <h1>Contact</h1>
        <ContactForm />
      </div>
      <ContactFooter />
    </>
  );
}
