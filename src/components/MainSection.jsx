/* eslint-disable no-unused-vars */
// components/MainSection.js
import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import PlayerSearch from './PlayerSearch';

const MainSection = () => {
    return (
        <div
            className="main-section d-flex align-items-start"
            style={{
                height: 'calc(100vh - 70px)',
                paddingTop: '100px', // Increased padding to move content upward
                backgroundImage: 'url(https://laserwar.us/images/lasertag/What-is-Outdoor-laser-tag-Equipment.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}
        >
            {/* Overlay to make text more readable */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
            />

            <Container className="position-relative">
                <Row className="justify-content-center">
                    <Col md={10} style={{ width: '700px' }} className="text-center">
                        <div className="branding-section p-4 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                            <Row className="align-items-center mb-4">
                                <Col xs={12} md={3} className="text-center text-md-start">
                                    <Image
                                        src="/logo.png"
                                        alt="Laser Tek Logo"
                                        style={{ width: '120px' }}
                                    />
                                </Col>
                                <Col xs={12} md={9} className="text-center text-md-start mt-3 mt-md-0">
                                    <h1
                                        className="mb-2"
                                        style={{
                                            background: 'linear-gradient(135deg, #D0021B 0%, #4A90E2 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: 'bold',
                                            fontSize: '3.5rem'
                                        }}
                                    >
                                        Laser Tek
                                    </h1>
                                    <p className="text-white mb-0" style={{ fontSize: '1.2rem' }}>Next-level outdoor experiences!</p>
                                </Col>
                            </Row>

                            <PlayerSearch />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MainSection;