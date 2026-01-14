import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Column */}
          <div className="footer-section">
            <h3>SkalAdventure</h3>
            <p className="footer-description">
              Premium outdoor equipment for camping, hiking, climbing, and survival. 
              Trusted by adventurers worldwide.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <FiFacebook />
              </a>
              <a href="#" className="social-link">
                <FiTwitter />
              </a>
              <a href="#" className="social-link">
                <FiInstagram />
              </a>
              <a href="#" className="social-link">
                <FiYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/camping">Camping Gear</Link></li>
              <li><Link to="/hiking">Hiking Equipment</Link></li>
              <li><Link to="/sale">Hot Deals</Link></li>
            </ul>
          </div>
        
          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FiPhone />
                <span>+62 895 2957 5502</span>
              </div>
              <div className="contact-item">
                <FiMail />
                <span>support@skaladventure.com</span>
              </div>
              <div className="contact-item">
                <FiMapPin />
                <span>Tangerang, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} SkalAdventure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;