import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaFacebookF, FaTiktok, FaYoutube, FaEnvelope, FaPhone } from 'react-icons/fa';

const gradientButtonStyle = {
  background: 'linear-gradient(135deg, #D0021B 0%, #4A90E2 100%)',
  border: 'none',
  color: 'white',
  fontWeight: 'bold',
  padding: '8px 16px',
  borderRadius: '4px',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const gradientCardStyle = {
  background: 'linear-gradient(135deg, rgba(208,2,27,0.1) 0%, rgba(74,144,226,0.1) 100%)',
  padding: '20px',
  borderRadius: '8px',
};

const socialIconStyle = {
  fontSize: '24px',
  margin: '0 10px',
  color: '#4A90E2',
  cursor: 'pointer',
  transition: 'color 0.3s ease',
};

function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    details: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log('Form submitted:', formData);
    alert('Message sent! We will get back to you soon.');
    setFormData({ fullName: '', email: '', details: '' });
  };

  return (
    <Container className="py-5">
      <Row>
        {/* Left Column */}
        <Col lg={5} className="mb-4 mb-lg-0">
          <div style={gradientCardStyle} className="h-100 d-flex flex-column justify-content-between">

            {/* Logo & Branding - Centered and slightly upwards */}
            <div className="text-center mb-5 mt-2">
              <img
                src="/logo.png"
                alt="Laser Tek Logo"
                style={{ height: '80px' }}
                className="mb-3"
              />
              <h1 className="fw-bold mb-1" style={{ fontSize: '2rem' }}>Laser Tek</h1>
              <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                Next-level outdoor experiences!
              </p>
            </div>

            {/* Bottom Contact & Social */}
            <Row>
              <Col>
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <FaEnvelope className="me-3 text-primary" />
                    <span>lasertek@gmail.com</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaPhone className="me-3 text-primary" />
                    <span>0967746277</span>
                  </div>
                </div>
              </Col>
              <Col>
                <div>
                  <h5 className="mb-3">Connect with us</h5>
                  <div>
                    <FaFacebookF style={socialIconStyle} />
                    <FaTiktok style={socialIconStyle} />
                    <FaYoutube style={socialIconStyle} />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        {/* Right Column */}
        <Col lg={7}>
          <Card style={gradientCardStyle}>
            <Card.Body>
              <h3 className="mb-4">Get in Touch</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows={5}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    style={gradientButtonStyle}
                    className="text-white"
                  >
                    Send Message
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;