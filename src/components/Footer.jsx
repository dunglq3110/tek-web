import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-3">
              <img
                src="/logo.png"
                alt="Laser Tek Logo"
                width="50"
                height="50"
              />
              <h4
                className="ml-2 mb-0"
                style={{
                  marginLeft: '10px',
                  background: 'linear-gradient(135deg, #D0021B 0%, #4A90E2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                Laser Tek
              </h4>
            </div>
            <p>Next-level outdoor experiences!</p>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i> Email: lasertek@gmail.com
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i> Phone: 0967746277
              </li>
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i> Location: Tech Park, Innovation Street
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h5 className="mb-3">About Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none">Our Story</Link>
              </li>
              <li className="mb-2">
                <Link to="/about#team" className="text-light text-decoration-none">Our Team</Link>
              </li>
              <li className="mb-2">
                <Link to="/about#mission" className="text-light text-decoration-none">Our Mission</Link>
              </li>
              <li className="mb-2">
                <Link to="/careers" className="text-light text-decoration-none">Careers</Link>
              </li>
            </ul>
          </Col>
        </Row>

        <Row className="border-top pt-3">
          <Col md={6} className="mb-3 mb-md-0">
            <p className="mb-0">© 2025 Laser Tek. All rights reserved.</p>
          </Col>

          <Col md={6}>
            <div className="d-flex justify-content-md-end">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <i className="bi bi-tiktok fs-5"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-light">
                <i className="bi bi-youtube fs-5"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;