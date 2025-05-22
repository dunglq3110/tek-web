import React, { useState } from 'react';
import { Container, Row, Col, Nav, Tab, Card, Button, Ratio } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Service() {
  const [activeTab, setActiveTab] = useState('desktop');

  // Gradient button style from your requirements
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

  const specialCardStyle = {
    background: 'linear-gradient(135deg, rgba(208,2,27,0.1) 0%, rgba(74,144,226,0.1) 100%)',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '30px',
  };

  const serviceCardStyle = {
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    height: '100%',
    transition: 'transform 0.3s ease',
    border: '1px solid #e0e0e0',
  };

  const imageStyle = {
    objectFit: 'cover',
    width: '100%',
    height: '100%'
  };

  const tabStyle = {
    color: '#4A90E2',
    fontWeight: '600',
    padding: '12px 20px',
    borderRadius: '4px 4px 0 0',
  };

  const activeTabStyle = {
    ...tabStyle,
    background: 'linear-gradient(135deg, rgba(208,2,27,0.1) 0%, rgba(74,144,226,0.1) 100%)',
    borderBottom: '2px solid #4A90E2',
  };

  const sectionStyle = {
    padding: '80px 0',
  };

  return (
    <section id="services" style={sectionStyle}>
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="section-title mb-2">Our Services</h2>
            <p className="text-muted">Explore our comprehensive suite of products designed for the ultimate gaming experience</p>
          </Col>
        </Row>

        {/* YouTube Demo Video */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <div className="video-container">
              <Ratio aspectRatio="16x9">
                <iframe
                  src="https://www.youtube.com/embed/WPcHLqjiu08?si=6a73mFK19dCmRSOe"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </Ratio>
            </div>
          </Col>
        </Row>

        <Tab.Container id="service-tabs" defaultActiveKey="desktop">
          <Nav className="justify-content-center mb-5">
            <Nav.Item>
              <Nav.Link
                eventKey="laser"
                style={activeTab === 'laser' ? activeTabStyle : tabStyle}
                onClick={() => setActiveTab('laser')}
              >
                Laser Gun
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="vest"
                style={activeTab === 'vest' ? activeTabStyle : tabStyle}
                onClick={() => setActiveTab('vest')}
              >
                Sensor Vest
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="watch"
                style={activeTab === 'watch' ? activeTabStyle : tabStyle}
                onClick={() => setActiveTab('watch')}
              >
                Hand Watch
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="desktop"
                style={activeTab === 'desktop' ? activeTabStyle : tabStyle}
                onClick={() => setActiveTab('desktop')}
              >
                Desktop App
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="mobile"
                style={activeTab === 'mobile' ? activeTabStyle : tabStyle}
                onClick={() => setActiveTab('mobile')}
              >
                Mobile App
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="laser">
              <Row>
                <Col>
                  <p className="text-center">Laser Gun content coming soon...</p>
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="vest">
              <Row>
                <Col>
                  <p className="text-center">Sensor Vest content coming soon...</p>
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="watch">
              <Row>
                <Col>
                  <p className="text-center">Hand Watch content coming soon...</p>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Desktop App Tab */}
            <Tab.Pane eventKey="desktop">
              {/* Special Card */}
              <div style={specialCardStyle} className="mb-5">
                <Row className="align-items-center">
                  <Col md={7}>
                    <div className="desktop-image-container">
                      <img
                        src="/images/services/desktop/match.png"
                        alt="Desktop Match Interface"
                        className="img-fluid rounded shadow"
                        style={{
                          maxHeight: '400px',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={5} className="text-center text-md-start">
                    <h3 className="mb-4">Elevate Your Gaming Experience</h3>
                    <p className="mb-4">Our desktop application provides comprehensive match management, player tracking, and performance analytics all in one place.</p>
                    <a
                      href="/downloads/TekHubSetup4.6.0.exe"
                      style={gradientButtonStyle}
                      download
                    >
                      Download
                    </a>

                  </Col>
                </Row>
              </div>

              {/* Information Cards */}
              <Row>
                <Col md={4} className="mb-4">
                  <Card style={serviceCardStyle} className="h-100">
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      <Card.Img
                        variant="top"
                        src="/images/services/desktop/match.png"
                        style={imageStyle}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="fw-bold">Match Management</Card.Title>
                      <Card.Text>
                        Seamlessly organize and track matches in real-time with our intuitive interface. Monitor scores, player statistics, and match progress from one central dashboard.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-4">
                  <Card style={serviceCardStyle} className="h-100">
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      <Card.Img
                        variant="top"
                        src="/images/services/desktop/player.png"
                        style={imageStyle}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="fw-bold">Player Profiles</Card.Title>
                      <Card.Text>
                        Create and manage detailed player profiles with performance history, skill ratings, and customizable stats tracking for comprehensive player development.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-4">
                  <Card style={serviceCardStyle} className="h-100">
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      <Card.Img
                        variant="top"
                        src="/images/services/desktop/equipment.png"
                        style={imageStyle}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="fw-bold">Equipment Tracking</Card.Title>
                      <Card.Text>
                        Monitor all your equipment status, battery levels, and maintenance schedules. Receive alerts for equipment that needs attention or replacement.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-4">
                  <Card style={serviceCardStyle} className="h-100">
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      <Card.Img
                        variant="top"
                        src="/images/services/desktop/analyze.png"
                        style={imageStyle}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="fw-bold">Advanced Analytics</Card.Title>
                      <Card.Text>
                        Dive deep into performance metrics with our comprehensive analytics suite. Visualize trends, identify strengths and weaknesses, and develop strategies based on data-driven insights.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-4">
                  <Card style={serviceCardStyle} className="h-100">
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      <Card.Img
                        variant="top"
                        src="/images/services/desktop/chat.png"
                        style={imageStyle}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="fw-bold">Team Communication</Card.Title>
                      <Card.Text>
                        Keep your team connected with our integrated chat system. Share strategies, coordinate events, and build community with secure, real-time messaging.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Mobile App Tab */}
            <Tab.Pane eventKey="mobile">
              {/* Special Card */}
              <div style={specialCardStyle} className="mb-5">
                <Row className="align-items-center">
                  <Col md={3}>
                    <div className="mobile-image-container text-center">
                      <img
                        src="/images/services/mobile/match.png"
                        alt="Mobile Match Interface"
                        className="img-fluid rounded shadow"
                        style={{
                          maxHeight: '500px',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mobile-image-container text-center">
                      <img
                        src="/images/services/mobile/team.png"
                        alt="Mobile Match Interface"
                        className="img-fluid rounded shadow"
                        style={{
                          maxHeight: '500px',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={5} className="text-center text-md-start">
                    <h3 className="mb-4">Gaming On The Go</h3>
                    <p className="mb-4">Take control of your gaming experience anywhere with our powerful mobile companion app.</p>
                    <Button style={gradientButtonStyle} href='https://expo.dev/artifacts/eas/eaCGH48FTAzKsmfJnJHsJ7.apk'>
                      Download
                    </Button>
                  </Col>
                </Row>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </section>
  );
}

export default Service;