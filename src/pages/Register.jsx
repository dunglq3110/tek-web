
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearErrors, clearSuccess } from '../redux/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, registerSuccess, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear any previous errors and success flags
    dispatch(clearErrors());
    dispatch(clearSuccess());

    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }

    // Redirect to login on successful registration
    if (registerSuccess) {
      navigate('/login');
    }
  }, [dispatch, registerSuccess, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Check password strength if password field changed
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    let message = '';

    if (password.length < 8) {
      message = 'Password must be at least 8 characters';
    } else {
      // Add strength for length
      strength += 1;

      // Add strength for containing lowercase
      if (/[a-z]/.test(password)) strength += 1;

      // Add strength for containing uppercase
      if (/[A-Z]/.test(password)) strength += 1;

      // Add strength for containing numbers
      if (/[0-9]/.test(password)) strength += 1;

      // Add strength for containing special characters
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;

      // Set message based on strength
      if (strength < 3) {
        message = 'Weak password';
      } else if (strength < 5) {
        message = 'Moderate password';
      } else {
        message = 'Strong password';
      }
    }

    setPasswordStrength(strength);
    setPasswordMessage(message);
  };

  const getProgressBarVariant = () => {
    if (passwordStrength < 3) return 'danger';
    if (passwordStrength < 5) return 'warning';
    return 'success';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || formData.password !== formData.confirmPassword) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = formData;
    dispatch(registerUser(registerData));
  };

  // Gradient styles for consistency with navbar
  const gradientStyle = {
    background: 'linear-gradient(135deg, #D0021B 0%, #4A90E2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const gradientButtonStyle = {
    background: 'linear-gradient(135deg, #D0021B 0%, #4A90E2 100%)',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  };

  return (
    <Container className="py-5 mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={gradientStyle}>Create an Account</h2>
                <p className="text-muted">Join the Laser Tek community today</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="userName"
                        placeholder="Choose a username"
                        value={formData.userName}
                        onChange={handleChange}
                        required
                        minLength="3"
                      />
                      <Form.Control.Feedback type="invalid">
                        Username must be at least 3 characters.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Nickname (Display Name)</Form.Label>
                  <Form.Control
                    type="text"
                    name="nickname"
                    placeholder="Choose a display name"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a display name.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="8"
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ zIndex: 10 }}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                  </Form.Control.Feedback>

                  {formData.password && (
                    <>
                      <div className="mt-2">
                        <div className="progress" style={{ height: '5px' }}>
                          <div
                            className={`progress-bar bg-${getProgressBarVariant()}`}
                            role="progressbar"
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            aria-valuenow={passwordStrength}
                            aria-valuemin="0"
                            aria-valuemax="5">
                          </div>
                        </div>
                        <small className={`text-${getProgressBarVariant()} d-block mt-1`}>
                          {passwordMessage}
                        </small>
                      </div>
                      <div className="small text-muted mt-1">
                        Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.
                      </div>
                    </>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    isInvalid={validated && formData.password !== formData.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    Passwords do not match.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 py-2 mb-3"
                  style={gradientButtonStyle}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Registering...</span>
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none fw-bold" style={gradientStyle}>
                    Login Here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;