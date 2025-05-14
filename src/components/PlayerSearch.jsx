// components/PlayerSearch.js
import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, ListGroup, Image, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, filterUsers, clearFilteredUsers } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { getPlayerIconSrc } from '../utils/helper';
const PlayerSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { filteredUsers, status } = useSelector(state => state.user);
    const searchRef = useRef(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        // Handle click outside to close dropdown
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                dispatch(clearFilteredUsers());
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dispatch]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        dispatch(filterUsers(value));
    };

    const handlePlayerClick = (id) => {
        navigate(`/profile/${id}`);
        //setSearchTerm('');
        dispatch(clearFilteredUsers());
    };

    return (
        <div ref={searchRef} className="position-relative">
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Find a player..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        height: '50px',
                        fontSize: '1.2rem',
                        borderRadius: '25px',
                        paddingLeft: '20px'
                    }}
                />
            </InputGroup>

            {filteredUsers.length > 0 && (
                <ListGroup
                    className="position-absolute w-100 shadow-lg"
                    style={{
                        zIndex: 1000,
                        maxHeight: '400px',
                        overflowY: 'auto',
                        borderRadius: '15px'
                    }}
                >
                    {filteredUsers.map(user => (
                        <ListGroup.Item
                            key={user.id}
                            action
                            onClick={() => handlePlayerClick(user.id)}
                            className="p-3"
                        >
                            <Row className="align-items-center">
                                <Col xs={3} className="text-center">
                                    <Image
                                        src={getPlayerIconSrc(user.iconId)}
                                        roundedCircle
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            border: '2px solid black'
                                        }}
                                    />
                                </Col>
                                <Col xs={9}>
                                    <h5 className="mb-1">{user.nickname}</h5>
                                    <p className="text-muted mb-0">#{user.userName}</p>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

        </div>
    );
};

export default PlayerSearch;