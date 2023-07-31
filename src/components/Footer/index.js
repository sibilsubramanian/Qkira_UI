import { TfiEmail } from "react-icons/tfi";
import { FaPhoneAlt } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { useNavigate } from "react-router-dom";

import ULogo from "../../images/ULogo.png";

import "./footer.scss";

const Footer = () => {
    const navigate = useNavigate();

    return <>
    <div className="footer-content">
        <div className="grid">
            <img src={ULogo} onClick={() => navigate('/home')}/>
        </div>
        <div className="grid">
            <h6>Contacts</h6>
            <div className="location"><GoLocation/>Oxnard st., Edmond, Oklahoma</div>
            <div className="phone"><FaPhoneAlt/>+1 517-881-0348</div>
            <div className="email"><TfiEmail/>admin@qkira.com</div>
        </div>
        <div className="grid">
            <h6>About the Application</h6>
            <div className="app-description">Our vision is to create a global community where researchers, scholars, and knowledge seekers thrive. We envision a world where scientific discoveries are easily accessible, understandable, and shared in a captivating video format, fostering collaboration, inspiring curiosity, and empowering individuals to make a positive impact on society. Together, we are shaping the future of research communication and democratizing the pursuit of knowledge for the betterment of humanity.</div>
            <h8>Mission</h8>
            <div className="app-description">To empower researchers, scholars, and knowledge seekers worldwide by revolutionizing the way scientific knowledge is accessed, understood, and shared.</div>
            <h8>Purpose</h8>
            <div className="app-description">To unlock the power of scientific knowledge through engaging videos</div>
        </div>
    </div>
    </>
};

export default Footer;
