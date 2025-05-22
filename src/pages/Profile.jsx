import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Card, Container, Row, Col, Image, Badge, Button, Form } from 'react-bootstrap';
import { COLORS, gradientStyle } from '../utils/constant';
import { FaPencilAlt, FaCheck, FaKey, FaCamera, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { changeNickname } from '../redux/slices/authSlice';
import { BASE_URL } from '../utils/constant';
import { getPlayerIconSrc } from '../utils/helper';
import IconModal from '../modals/IconModal';
import PasswordModal from '../modals/PasswordModal';

const Profile = () => {
    const { id } = useParams();
    const { token, user: currentUser } = useSelector(state => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editingNickname, setEditingNickname] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [showIconModal, setShowIconModal] = useState(false);
    const [iconHover, setIconHover] = useState(false);
    const navigate = useNavigate();

    const handleMatchDetail = (matchId) => {
        navigate(`/match/${matchId}`);
    };
    // Password change states
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();

    const handleSaveNickname = async () => {
        if (!newNickname.trim() || newNickname === currentUser.nickname) {
            toast.warning("Please enter a new nickname.");
            return;
        }
        if (newNickname.length < 3 || newNickname.length > 15) {
            toast.warning("Nickname must be between 3 and 15 characters.");
            return;
        }
        try {
            await dispatch(changeNickname(newNickname)).unwrap();
            toast.success("Nickname updated successfully!");
            const response = await axios.get(`${BASE_URL}/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfile(response.data.data);
            setNewNickname(response.data.data.nickname);
            setEditingNickname(false);
        } catch (err) {
            console.error('Error updating nickname:', err);
            toast.error(err?.message || "Error updating nickname");
        }
    };

    const isOwnProfile = !id || (currentUser && currentUser.id === parseInt(id));

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                let url = `${BASE_URL}/user/profile`;
                if (id) {
                    url = `${url}/${id}`;
                }
                const config = id ? {} : {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get(url, config);
                setProfile(response.data.data);
                setNewNickname(response.data.data.nickname);
                setLoading(false);
            } catch (err) {
                setError('Failed to load profile');
                setLoading(false);
                console.error('Error fetching profile:', err);
            }
        };
        fetchProfile();
    }, [id, token]);

    const formatTimeSpan = (startTime) => {
        const start = new Date(startTime);
        const now = new Date();
        const diffMs = now - start;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays < 1) {
            return `Today at ${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else if (diffDays < 3650) {
            const years = Math.floor(diffDays / 365);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        } else {
            const decades = Math.floor(diffDays / 3650);
            return `${decades} decade${decades > 1 ? 's' : ''} ago`;
        }
    };

    const getMatchDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffMs = end - start;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours > 0 ? `${diffHours} hour${diffHours > 1 ? 's' : ''} ` : ''}${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    };


    const handleShowPasswordModal = () => setShowPasswordModal(true);
    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleEditNickname = () => {
        setEditingNickname(true);
    };

    const isCurrentProfilePlayer = (playerId) => {
        return playerId === profile.id;
    };

    const handleShowIconModal = () => {
        if (isOwnProfile) {
            setShowIconModal(true);
        }
    };

    if (loading) return <div className="text-center mt-5"><h3>Loading profile...</h3></div>;
    if (error) return <div className="text-center mt-5 text-danger"><h3>{error}</h3></div>;
    if (!profile) return <div className="text-center mt-5"><h3>No profile found</h3></div>;

    return (
        <Container className="py-4">
            <Row >
                {/* User Icon - Left Column */}
                <Col md={4}>
                    <Row>
                        <Card className="h-100 shadow">
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                                <div
                                    className="position-relative"
                                    onMouseEnter={() => isOwnProfile && setIconHover(true)}
                                    onMouseLeave={() => setIconHover(false)}
                                    onClick={handleShowIconModal}
                                    style={{ cursor: isOwnProfile ? 'pointer' : 'default' }}
                                >
                                    <Image
                                        src={getPlayerIconSrc(profile.iconId)}
                                        roundedCircle
                                        className="mb-3"
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            border: '2px solid black',
                                            filter: isOwnProfile && iconHover ? 'brightness(70%)' : 'none',
                                            transition: 'filter 0.3s ease'
                                        }}
                                    />
                                    {isOwnProfile && iconHover && (
                                        <div
                                            className="position-absolute"
                                            style={{
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                color: 'white',
                                                fontSize: '2rem'
                                            }}
                                        >
                                            <FaCamera />
                                        </div>
                                    )}
                                </div>
                                <h4 className="mb-0">
                                    <span className="fw-bold">{profile.nickname}</span>
                                    <span className="text-muted"> #{profile.userName}</span>
                                </h4>
                            </Card.Body>
                        </Card>
                    </Row>
                    <Row className="mt-3">
                        <Card className="h-100 shadow">
                            <Card.Header as="h5">User Information</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <Row className="mb-2">
                                            <Col md={4}><strong>User ID:</strong></Col>
                                            <Col md={8}>{profile.id}</Col>
                                        </Row>

                                        <Row className="mb-2">
                                            <Col md={4}><strong>Nickname:</strong></Col>
                                            <Col md={8}>
                                                {editingNickname ? (
                                                    <span className="d-inline-flex align-items-center">
                                                        <Form.Control
                                                            size="sm"
                                                            value={newNickname}
                                                            onChange={(e) => setNewNickname(e.target.value)}
                                                            className="me-2"
                                                            style={{ width: '150px' }}
                                                            maxLength={15}
                                                        />
                                                        <Button variant="success" size="sm" onClick={handleSaveNickname} className="me-1">
                                                            <FaCheck />
                                                        </Button>
                                                        <Button variant="danger" size="sm" onClick={() => {
                                                            setEditingNickname(false);
                                                            setNewNickname(profile.nickname);
                                                        }}>
                                                            <FaTimes />
                                                        </Button>
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {profile.nickname}
                                                        {isOwnProfile && (
                                                            <Button
                                                                variant="link"
                                                                size="sm"
                                                                className="p-0 ms-2"
                                                                onClick={handleEditNickname}
                                                            >
                                                                <FaPencilAlt />
                                                            </Button>
                                                        )}
                                                    </span>
                                                )}
                                            </Col>
                                        </Row>

                                        <Row className="mb-2">
                                            <Col md={4}><strong>Username:</strong></Col>
                                            <Col md={8}>{profile.userName}</Col>
                                        </Row>

                                        <Row className="mb-2">
                                            <Col md={4}><strong>Email:</strong></Col>
                                            <Col md={8}>{profile.email || 'Not provided'}</Col>
                                        </Row>

                                        {profile.phoneNumber && (
                                            <Row className="mb-2">
                                                <Col md={4}><strong>Phone:</strong></Col>
                                                <Col md={8}>{profile.phoneNumber}</Col>
                                            </Row>
                                        )}

                                        {isOwnProfile && (
                                            <Row className="mt-3">
                                                <Col md={12}>
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={handleShowPasswordModal}
                                                        className="d-flex align-items-center"
                                                    >
                                                        <FaKey className="me-2" /> Change Password
                                                    </Button>
                                                </Col>
                                            </Row>
                                        )}
                                    </Col>
                                </Row>

                            </Card.Body>
                        </Card>
                    </Row>
                </Col>

                {/* User Information - Right Column */}
                <Col md={8}>
                    <Card className="shadow mb-4">
                        <Card.Header as="h5">Match History</Card.Header>
                        <Card.Body>
                            {profile.matches && profile.matches.length > 0 ? (
                                profile.matches.map((match, index) => (
                                    <Card key={index} className="mb-3 shadow">
                                        <Card.Header style={gradientStyle}>
                                            <Row className="align-items-center">
                                                <Col xs={4}>
                                                    <h6 className="mb-0">Match #{match.matchCode}</h6>
                                                    <small className="text-white">
                                                        {formatTimeSpan(match.startTime)} - {getMatchDuration(match.startTime, match.endTime)}
                                                    </small>
                                                </Col>
                                                <Col xs={4} className="text-center">
                                                    {match.winnerTeamId === 0 ? (
                                                        <h6 className="mb-0 fw-bold text-white">DRAW</h6>
                                                    ) : match.winnerTeamId === 1 ? (
                                                        <h6 className="mb-0 fw-bold" style={{ color: COLORS.attackerBase }}>ATTACKERS WIN</h6>
                                                    ) : (
                                                        <h6 className="mb-0 fw-bold" style={{ color: COLORS.defenderBase }}>DEFENDERS WIN</h6>
                                                    )}
                                                </Col>
                                                <Col xs={4} className="text-end">
                                                    <Button variant="light" size="sm" onClick={() => handleMatchDetail(match.matchId)}>
                                                        Match Details
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                {/* Attackers Team */}
                                                <Col xs={6} className="border-end" style={{ background: 'rgba(255, 102, 102, 0.05)' }}>
                                                    <h6 className="text-center mb-3" style={{ color: COLORS.attackerBase }}>
                                                        Attackers
                                                        {match.winnerTeamId === 1 && <Badge bg="danger" className="ms-2">WINNER</Badge>}
                                                    </h6>
                                                    {match.teams[0]?.players?.map((player, pidx) => (
                                                        <Row
                                                            key={pidx}
                                                            className={`mb-2 align-items-center ${isCurrentProfilePlayer(player.id) ? 'bg-light p-1 rounded' : ''}`}
                                                            style={isCurrentProfilePlayer(player.id) ? { border: `1px solid ${COLORS.attackerBase}` } : {}}
                                                        >
                                                            <Col xs={2} className="ps-3 pe-0">
                                                                <Image
                                                                    src={getPlayerIconSrc(player.iconId)}
                                                                    roundedCircle
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        objectFit: 'cover',
                                                                        border: `1px solid ${isCurrentProfilePlayer(player.id) ? COLORS.attackerBase : 'black'}`
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col xs={10} className="ps-0 text-start">
                                                                <div className="fw-bold">{player.nickname}</div>
                                                                <small className="text-muted">#{player.id}</small>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </Col>

                                                {/* Defenders Team */}
                                                <Col xs={6} style={{ background: 'rgba(102, 102, 255, 0.05)' }}>
                                                    <h6 className="text-center mb-3" style={{ color: COLORS.defenderBase }}>
                                                        Defenders
                                                        {match.winnerTeamId === 2 && <Badge bg="primary" className="ms-2">WINNER</Badge>}
                                                    </h6>
                                                    {match.teams[1]?.players?.map((player, pidx) => (
                                                        <Row
                                                            key={pidx}
                                                            className={`mb-2 align-items-center ${isCurrentProfilePlayer(player.id) ? 'bg-light p-1 rounded' : ''}`}
                                                            style={isCurrentProfilePlayer(player.id) ? { border: `1px solid ${COLORS.defenderBase}` } : {}}
                                                        >
                                                            <Col xs={10} className="pe-0 text-end">
                                                                <div className="fw-bold">{player.nickname}</div>
                                                                <small className="text-muted">#{player.id}</small>
                                                            </Col>
                                                            <Col xs={2} className="ps-0 pe-3 text-end">
                                                                <Image
                                                                    src={getPlayerIconSrc(player.iconId)}
                                                                    roundedCircle
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        objectFit: 'cover',
                                                                        border: `1px solid ${isCurrentProfilePlayer(player.id) ? COLORS.defenderBase : 'black'}`
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-center">No match history available</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            <IconModal
                show={showIconModal}
                onHide={() => setShowIconModal(false)}
                profile={profile}
                setProfile={setProfile}
                token={token}
                dispatch={dispatch}
            />
            <PasswordModal
                show={showPasswordModal}
                onHide={handleClosePasswordModal}
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                dispatch={dispatch}
            />
        </Container>
    );
};

export default Profile;