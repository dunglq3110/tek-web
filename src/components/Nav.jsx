
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { getPlayerIconSrc } from '../utils/helper';
import React, { useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Image, Button } from 'react-bootstrap';
import '../App.css'; // Import your CSS file for custom styles
const CustomNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  // Custom gradient button style
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

  return (
    <Navbar
      bg="white"
      expand="lg"
      fixed="top"
      className="shadow-sm"
      style={{ height: '70px' }}
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        {/* Logo and brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center" onClick={() => setExpanded(false)}>
          <Image
            src="/logo.png"
            alt="Laser Tek Logo"
            width="40"
            height="40"
          />
          <span style={{
            marginLeft: '8px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #D0021B 0%, #4A90E2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.5rem'
          }}>
            Laser Tek
          </span>
        </Link>

        <Navbar.Toggle aria-controls="navbarSupportedContent" />

        <Navbar.Collapse id="navbarSupportedContent">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center w-100">
            {/* Left side with divider */}
            <div className="d-flex flex-column flex-lg-row align-items-center">
              {/* Vertical divider - visible only on larger screens */}
              <div className="d-none d-lg-block mx-3">
                <div className="vr" style={{ height: '30px' }}></div>
              </div>

              {/* Main navigation links */}
              <Nav className="me-auto">
                <Nav.Item className="d-flex align-items-center">
                  <Link
                    to="/"
                    className="nav-link px-3 fw-medium"
                    onClick={() => setExpanded(false)}
                  >
                    Home
                  </Link>
                </Nav.Item>
                <Nav.Item className="d-flex align-items-center">
                  <Link
                    to="/service"
                    className="nav-link px-3 fw-medium"
                    onClick={() => setExpanded(false)}
                  >
                    Our Service
                  </Link>
                </Nav.Item>
                <Nav.Item className="d-flex align-items-center">
                  <Link
                    to="/about"
                    className="nav-link px-3 fw-medium"
                    onClick={() => setExpanded(false)}
                  >
                    About Us
                  </Link>
                </Nav.Item>

                <Nav.Item className="ms-lg-2">
                  <Link
                    to="/become-hoster"
                    className="nav-link"
                    onClick={() => setExpanded(false)}
                  >
                    <Button style={gradientButtonStyle} className="hover-shadow">
                      Become Our Hoster!
                    </Button>
                  </Link>
                </Nav.Item>
              </Nav>
            </div>

            {/* Authentication section */}
            <Nav className="ms-lg-auto mt-3 mt-lg-0">
              {isAuthenticated && user ? (
                <NavDropdown
                  title={
                    <div className="d-inline-flex align-items-center ">
                      <Image
                        src={getPlayerIconSrc(user.iconId)}
                        roundedCircle
                        width="36"
                        height="36"
                        className="me-2 border"
                        alt="User Icon"
                      />
                      <span className="ms-2 fw-medium d-flex flex-column">
                        {user.nickname}
                        <small className="text-muted">#{user.userName}</small>
                      </span>


                    </div>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item onClick={() => { navigate('/profile'); setExpanded(false); }}>
                    <i className="bi bi-person me-2"></i> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <div className="d-flex">
                  <Link
                    to="/login"
                    className="nav-link px-3"
                    onClick={() => setExpanded(false)}
                  >
                    <Button variant="outline-primary" className="fw-medium px-3">
                      Login
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    className="nav-link px-3"
                    onClick={() => setExpanded(false)}
                  >
                    <Button style={gradientButtonStyle}>
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNav;