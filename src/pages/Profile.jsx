import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Card, Container, Row, Col, Image, Badge, Modal, Button, Form, Pagination } from 'react-bootstrap';
import { isValidBase64 } from '../utils/helper';
import { COLORS, gradientStyle } from '../utils/constant';
import { FaPencilAlt, FaCheck, FaKey, FaCamera, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { changeNickname, changePassword, updateUserIcon } from '../redux/slices/authSlice';
import { BASE_URL } from '../utils/constant';
import { getPlayerIconSrc } from '../utils/helper';
const Profile = () => {
    const { id } = useParams();
    const { token, user: currentUser } = useSelector(state => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editingNickname, setEditingNickname] = useState(false);
    const [newNickname, setNewNickname] = useState('');

    // Password change states
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Icon change states
    const [showIconModal, setShowIconModal] = useState(false);
    const [iconHover, setIconHover] = useState(false);
    const [availableIcons, setAvailableIcons] = useState([]);
    const [selectedIconId, setSelectedIconId] = useState('');
    const [iconLoading, setIconLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const iconsPerPage = 16; // 4 icons per row, 4 rows

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

            // 🔁 Refetch profile to get updated nickname
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



    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match!");
            return;
        }

        try {
            await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
            handleClosePasswordModal();
            toast.success("Password changed successfully!");
        } catch (err) {
            console.error('Error changing password:', err);
            toast.error(err?.message || "Error changing password");
        }
    };


    // Check if viewing own profile
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
        //const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        //const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

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

    const handleShowMatchModal = () => setShowMatchModal(true);
    const handleCloseMatchModal = () => setShowMatchModal(false);

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



    // Check if a player is the current profile owner
    const isCurrentProfilePlayer = (playerId) => {
        return playerId === profile.id;
    };
    // Fetch available icons
    const fetchIcons = async () => {
        try {
            setIconLoading(true);
            const response = await axios.get(`${BASE_URL}/icon`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAvailableIcons(response.data.data);
            setIconLoading(false);
        } catch (err) {
            console.error('Error fetching icons:', err);
            setIconLoading(false);
        }
    };

    // Handle icon modal open
    const handleShowIconModal = () => {
        if (isOwnProfile) {
            fetchIcons();
            setShowIconModal(true);
            setSelectedIconId(profile.iconId);
        }
    };

    // Handle icon selection
    const handleSelectIcon = (iconId) => {
        setSelectedIconId(iconId);
    };

    const handleUpdateIcon = () => {
        const selectedIcon = availableIcons.find(icon => icon.id === selectedIconId);
        if (!selectedIcon) return;

        dispatch(updateUserIcon({
            iconId: selectedIconId,
            iconData: selectedIcon.iconData
        }))
            .unwrap()
            .then(() => {
                // Optionally update UI if Redux doesn't store full iconData
                if (selectedIcon) {
                    setProfile(prev => ({
                        ...prev,
                        iconId: selectedIconId

                    }));
                }
                setShowIconModal(false);
                toast.success("Icon changed successfully!");
            })
            .catch((err) => {
                console.error('Error updating icon:', err);
                toast.error("Failed to update icon. Please try again.");
            });
    };
    // Pagination logic
    const indexOfLastIcon = currentPage * iconsPerPage;
    const indexOfFirstIcon = indexOfLastIcon - iconsPerPage;
    const currentIcons = availableIcons.slice(indexOfFirstIcon, indexOfLastIcon);
    const totalPages = Math.ceil(availableIcons.length / iconsPerPage);

    // Generate pagination items
    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

    if (loading) return <div className="text-center mt-5"><h3>Loading profile...</h3></div>;
    if (error) return <div className="text-center mt-5 text-danger"><h3>{error}</h3></div>;
    if (!profile) return <div className="text-center mt-5"><h3>No profile found</h3></div>;

    return (
        <Container className="py-4">
            <Row className="mb-4">
                {/* User Icon - Left Column */}
                <Col md={4}>
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
                </Col>

                {/* User Information - Right Column */}
                <Col md={8}>
                    <Card className="h-100 shadow">
                        <Card.Header as="h5">User Information</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <p><strong>User ID:</strong> {profile.id}</p>
                                    <p>
                                        <strong>Nickname:</strong>
                                        {editingNickname ? (
                                            <span className="d-inline-flex align-items-center ms-2">
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
                                                {' '}{profile.nickname}
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
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p><strong>Username:</strong> {profile.userName}</p>
                                    <p><strong>Email:</strong> {profile.email || 'Not provided'}</p>
                                </Col>
                                {profile.phoneNumber && (
                                    <Col md={12}>
                                        <p><strong>Phone:</strong> {profile.phoneNumber}</p>
                                    </Col>
                                )}
                                {isOwnProfile && (
                                    <Col md={12} className="mt-3">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={handleShowPasswordModal}
                                            className="d-flex align-items-center"
                                        >
                                            <FaKey className="me-2" /> Change Password
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal
                show={showIconModal}
                onHide={() => setShowIconModal(false)}
                size="lg"
                centered
            >

                <Modal.Header closeButton>
                    <Modal.Title>Change Profile Icon</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        {/* Left side - Current Profile */}
                        <Col md={4} className="text-center">
                            <h5 className="mb-3">Your Profile</h5>
                            <div className="mb-3">
                                <Image
                                    src={selectedIconId
                                        ? `data:image/png;base64,${availableIcons.find(icon => icon.id === selectedIconId)?.iconData}`
                                        : (profile.iconData && isValidBase64(profile.iconData)
                                            ? `data:image/png;base64,${profile.iconData}`
                                            : '/logo.png')}
                                    roundedCircle
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        objectFit: 'cover',
                                        border: '2px solid black'
                                    }}
                                />
                            </div>
                            <h5>
                                <span className="fw-bold">{profile.nickname}</span>
                                <span className="text-muted"> #{profile.userName}</span>
                            </h5>

                            {selectedIconId && (
                                <Button
                                    variant="primary"
                                    className="mt-4"
                                    onClick={handleUpdateIcon}
                                    disabled={iconLoading}
                                >
                                    {iconLoading ? 'Updating...' : 'Change Icon'}
                                </Button>
                            )}
                        </Col>

                        {/* Right side - Icon Selection */}
                        <Col md={8}>
                            <h5 className="mb-3">Select an Icon</h5>
                            {iconLoading ? (
                                <div className="text-center py-5">
                                    <h6>Loading available icons...</h6>
                                </div>
                            ) : (
                                <>
                                    <Row style={{ height: '400px', overflowY: 'hidden' }}>
                                        {currentIcons.map(icon => (
                                            <Col xs={3} key={icon.id} className="mb-4">
                                                <div
                                                    className="position-relative"
                                                    onClick={() => handleSelectIcon(icon.id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <Image
                                                        src={`data:image/png;base64,${icon.iconData}`}
                                                        roundedCircle
                                                        style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            objectFit: 'cover',
                                                            border: selectedIconId === icon.id ? '3px solid #0d6efd' : '1px solid #dee2e6',
                                                            padding: '2px'
                                                        }}
                                                    />
                                                    {selectedIconId === icon.id && (
                                                        <div
                                                            className="position-absolute bg-success rounded-circle d-flex align-items-center justify-content-center"
                                                            style={{
                                                                bottom: '0',
                                                                right: '0',
                                                                width: '24px',
                                                                height: '24px',
                                                                color: 'white'
                                                            }}
                                                        >
                                                            <FaCheck size={12} />
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-center mt-3">
                                            <Pagination>
                                                <Pagination.Prev
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                />
                                                {paginationItems}
                                                <Pagination.Next
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                />
                                            </Pagination>
                                        </div>
                                    )}
                                </>
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowIconModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Match History Section */}
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
                                            <Button variant="light" size="sm" onClick={handleShowMatchModal}>
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
                                                    <Col xs={2}>
                                                        <Image
                                                            src={getPlayerIconSrc(player.iconId)}
                                                            roundedCircle
                                                            className="me-2 ms-4"
                                                            style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                objectFit: 'cover',
                                                                border: `1px solid ${isCurrentProfilePlayer(player.id) ? COLORS.attackerBase : 'black'}`
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col xs={10} className="text-start">
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
                                                    <Col xs={10} className="text-end">
                                                        <div className="fw-bold">{player.nickname}</div>
                                                        <small className="text-muted">#{player.id}</small>
                                                    </Col>
                                                    <Col xs={2}>
                                                        <Image
                                                            src={getPlayerIconSrc(player.iconId)}
                                                            roundedCircle
                                                            className="ms-2"
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

            {/* Modal for Match Details */}
            <Modal show={showMatchModal} onHide={handleCloseMatchModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Match Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>Match detail feature has not been implemented yet!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseMatchModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Password Change */}
            <Modal show={showPasswordModal} onHide={handleClosePasswordModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleChangePassword}>
                        <Form.Group className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={handleClosePasswordModal}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Change Password
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Profile;