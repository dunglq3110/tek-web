import React from 'react';
import { Carousel, Container, Row, Col } from 'react-bootstrap';

function Activities() {
    const activities = [
        {
            image: "/images/about/ute2025.JPG",
            description: "First Prize of UTE Junior Startup 2025 competition"
        },
        {
            image: "/images/about/ute2023.JPG",
            description: "Second Prize of UTE Junior Startup 2023 competition"
        },
        {
            image: "/images/about/inofest.jpg",
            description: "Trial launch at Innovation Fest Thủ Đức 2024"
        },
        {
            image: "/images/about/inofest2.jpg",
            description: "Trial launch at Innovation Fest Thủ Đức 2024"
        },
        {
            image: "/images/about/dtoi.jpg",
            description: "Third prize of Design Thinking Open Innovation Thủ Đức 2024 competition"
        }
    ];

    return (
        <div className="activities-container py-5">
            <Container>
                <Row className="mb-5">
                    <Col className="text-center">
                        <h2 className="section-title mb-2">Our Achievements</h2>
                    </Col>
                </Row>
                <Carousel className="shadow-lg rounded overflow-hidden">
                    {activities.map((activity, index) => (
                        <Carousel.Item key={index}>
                            <div className="d-flex justify-content-center align-items-center bg-dark" style={{ height: '70vh' }}>
                                <img
                                    className="d-block mx-auto"
                                    src={activity.image}
                                    alt={`Activity ${index + 1}`}
                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                />
                            </div>
                            <Carousel.Caption className="bg-dark bg-opacity-75 rounded p-2">
                                <p className="text-white fw-medium">{activity.description}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </div>
    );
}

export default Activities;
