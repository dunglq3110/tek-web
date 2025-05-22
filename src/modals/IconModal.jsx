import { useEffect, useState } from 'react';
import axios from 'axios';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Row, Col, Image, Modal, Button, Pagination } from 'react-bootstrap';
import { FaCheck } from 'react-icons/fa';
import { updateUserIcon } from '../redux/slices/authSlice';
import { BASE_URL } from '../utils/constant';

const IconModal = ({ show, onHide, profile, setProfile, token, dispatch }) => {
    const [availableIcons, setAvailableIcons] = useState([]);
    const [selectedIconId, setSelectedIconId] = useState(profile?.iconId || '');
    const [iconLoading, setIconLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const iconsPerPage = 16;

    useEffect(() => {
        if (show) {
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
                    toast.error("Failed to load icons");
                }
            };
            fetchIcons();
        }
    }, [show, token]);

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
                if (selectedIcon) {
                    setProfile(prev => ({
                        ...prev,
                        iconId: selectedIconId
                    }));
                }
                onHide();
                toast.success("Icon changed successfully!");
            })
            .catch((err) => {
                console.error('Error updating icon:', err);
                toast.error("Failed to update icon. Please try again.");
            });
    };

    const indexOfLastIcon = currentPage * iconsPerPage;
    const indexOfFirstIcon = indexOfLastIcon - iconsPerPage;
    const currentIcons = availableIcons.slice(indexOfFirstIcon, indexOfLastIcon);
    const totalPages = Math.ceil(availableIcons.length / iconsPerPage);

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

    const isValidBase64 = (str) => {
        try {
            return btoa(atob(str)) === str;
        } catch (err) {
            return false;
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Change Profile Icon</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
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
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default IconModal;