import ContactAddress from './Contact Address/ContactAddress';
import ContactGeneral from './Contact General/ContactGeneral';
import ContactSocialMedia from './Contact Social Media/ContactSocialMedia';
import './ContactFooter.css'

export default function ContactFooter() { 
    return (
        <footer className="contact-footer">
            <ContactGeneral />
            <ContactSocialMedia />
            <ContactAddress />
        </footer>
    );
}