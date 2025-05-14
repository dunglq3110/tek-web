

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';

function Team() {
  return (
    <>
      <section id="team" className="team section-padding">
        <Container>
          <Row>
            <Col md={12}>
              <div className="section-header text-center pb-5">
                <h2>Our Team</h2>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={3} className="mb-4 mx-2">
              <Card className="text-center" style={{ background: 'linear-gradient(135deg, rgba(208,2,27,0.1) 0%, rgba(74,144,226,0.1) 100%)' }}>
                <Card.Body>
                  <img
                    src="/images/about/dung.jpg"
                    alt="Le Quang Dung"
                    className="img-fluid rounded-circle"
                    style={{ width: '150px', height: '150px' }}
                  />
                  <h3 className="card-title py-2">Le Quang Dung</h3>
                  <p className="card-text">21110761 - HCMUTE</p>
                  <p className="socials">
                    <span className="social-icon-circle"><FaTwitter className="mx-1" /></span>
                    <span className="social-icon-circle"><FaFacebook className="mx-1" /></span>
                    <span className="social-icon-circle"><FaLinkedin className="mx-1" /></span>
                    <span className="social-icon-circle"><FaInstagram className="mx-1" /></span>
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={3} className="mb-4 mx-2">
              <Card className="text-center" style={{ background: 'linear-gradient(135deg, rgba(208,2,27,0.1) 0%, rgba(74,144,226,0.1) 100%)' }}>
                <Card.Body>
                  <img
                    src="/images/about/dung.jpg"
                    alt="Pham Quang Duy"
                    className="img-fluid rounded-circle"
                    style={{ width: '150px', height: '150px' }}
                  />
                  <h3 className="card-title py-2">Pham Quang Duy</h3>
                  <p className="card-text">21110760 - HCMUTE</p>
                  <p className="socials">
                    <span className="social-icon-circle"><FaTwitter className="mx-1" /></span>
                    <span className="social-icon-circle"><FaFacebook className="mx-1" /></span>
                    <span className="social-icon-circle"><FaLinkedin className="mx-1" /></span>
                    <span className="social-icon-circle"><FaInstagram className="mx-1" /></span>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

        </Container>
      </section>

      <style jsx>{`
        .social-icon-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid black;
          margin: 0 5px;
        }
      `}</style>
    </>
  );
}

export default Team;