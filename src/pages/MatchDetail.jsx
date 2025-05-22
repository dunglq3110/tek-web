import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';

import { Card, Container, Row, Col, Image, Badge, Button, Tabs, Tab, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { COLORS, gradientStyle } from '../utils/constant';
import { getPlayerIconSrc } from '../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constant';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FaCamera, FaCopy } from 'react-icons/fa';

const MatchDetail = () => {
    const { id } = useParams();
    const { token, user: currentUser } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [iconHover, setIconHover] = useState(false);
    const [comparisonMetric, setComparisonMetric] = useState('totalKill');

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                setLoading(true);
                const url = `${BASE_URL}/match/${id}`;
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get(url, config);
                setMatch(response.data.data);
                // Select first player by default
                if (response.data.data?.teams?.[0]?.players?.[0]) {
                    setSelectedPlayer(response.data.data.teams[0].players[0]);
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to load match details');
                setLoading(false);
                console.error('Error fetching match:', err);
            }
        };
        fetchMatch();
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

    const isCurrentProfilePlayer = (playerId) => {
        return currentUser?.id === playerId;
    };

    const handlePlayerSelect = (player) => {
        setSelectedPlayer(player);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Optionally add a toast notification here
    };

    // Prepare data for Team Analysis pie charts
    const getTeamStats = () => {
        if (!match || !match.teams || match.teams.length < 2) {
            return [];
        }

        const attackerStats = {
            totalDamage: 0,
            totalHealing: 0,
            totalSSketch: 0,
            totalDebuff: 0
        };
        const defenderStats = {
            totalDamage: 0,
            totalHealing: 0,
            totalSSketch: 0,
            totalDebuff: 0
        };

        match.teams[0]?.players?.forEach(player => {
            attackerStats.totalDamage += player.totalDamage || 0;
            attackerStats.totalHealing += player.totalHealing || 0;
            attackerStats.totalSSketch += player.totalSSketch || 0;
            attackerStats.totalDebuff += player.totalDebuff || 0;
        });

        match.teams[1]?.players?.forEach(player => {
            defenderStats.totalDamage += player.totalDamage || 0;
            defenderStats.totalHealing += player.totalHealing || 0;
            defenderStats.totalSSketch += player.totalSSketch || 0;
            defenderStats.totalDebuff += player.totalDebuff || 0;
        });

        return [
            {
                name: 'Total Damage',
                data: [
                    { name: 'Attackers', value: attackerStats.totalDamage, color: COLORS.attackerBase },
                    { name: 'Defenders', value: defenderStats.totalDamage, color: COLORS.defenderBase }
                ]
            },
            {
                name: 'Total Healing',
                data: [
                    { name: 'Attackers', value: attackerStats.totalHealing, color: COLORS.attackerBase },
                    { name: 'Defenders', value: defenderStats.totalHealing, color: COLORS.defenderBase }
                ]
            },
            {
                name: 'Total SSketch',
                data: [
                    { name: 'Attackers', value: attackerStats.totalSSketch, color: COLORS.attackerBase },
                    { name: 'Defenders', value: defenderStats.totalSSketch, color: COLORS.defenderBase }
                ]
            },
            {
                name: 'Total Debuff',
                data: [
                    { name: 'Attackers', value: attackerStats.totalDebuff, color: COLORS.attackerBase },
                    { name: 'Defenders', value: defenderStats.totalDebuff, color: COLORS.defenderBase }
                ]
            }
        ];
    };


    // Prepare data for Player Comparison bar chart
    const getPlayerComparisonData = () => {
        if (!match || !match.teams || match.teams.length < 2) {
            return [];
        }

        const attackers = match.teams[0]?.players?.map((p, idx) => ({
            ...p,
            team: 'Attackers',
            color: COLORS.attackerShades[idx % COLORS.attackerShades.length]
        })) || [];

        const defenders = match.teams[1]?.players?.map((p, idx) => ({
            ...p,
            team: 'Defenders',
            color: COLORS.defenderShades[idx % COLORS.defenderShades.length]
        })) || [];

        const allPlayers = [...attackers, ...defenders];

        const metricMap = {
            totalKill: 'totalKill',
            accuracy: 'hitCount',
            totalDamage: 'totalDamage',
            totalHealing: 'totalHealing',
            ssketch: 'totalSSketch',
            debuff: 'totalDebuff'
        };

        const metricKey = metricMap[comparisonMetric] || 'totalKill';

        return allPlayers
            .map(player => ({
                name: player.nickname,
                value: player[metricKey] || 0,
                color: player.color
            }))
            .sort((a, b) => b.value - a.value);
    };


    const teamStats = getTeamStats();
    const playerComparisonData = getPlayerComparisonData();
    const totalPlayers = Array.isArray(match?.teams)
        ? match.teams.reduce((sum, team) => sum + (Array.isArray(team.players) ? team.players.length : 0), 0)
        : 0;

    if (loading) return <div className="text-center mt-5"><h3>Loading Match...</h3></div>;
    if (error) return <div className="text-center mt-5 text-danger"><h3>{error}</h3></div>;
    if (!match) return <div className="text-center mt-5"><h3>No Match found</h3></div>;

    return (
        <Container className="py-4">
            <Row>
                {/* Left Column - Selected Player Details */}
                <Col md={3}>
                    <Row>
                        <Card className="h-100 shadow">
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                                <div
                                    className="position-relative"
                                >
                                    <Image
                                        src={getPlayerIconSrc(selectedPlayer?.iconId)}
                                        roundedCircle
                                        className="mb-3"
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            border: '2px solid black',
                                            transition: 'filter 0.3s ease'
                                        }}
                                    />

                                </div>
                                <h4 className="mb-0">
                                    <span className="fw-bold">{selectedPlayer?.nickname}</span>
                                    <span className="text-muted"> #{selectedPlayer?.id}</span>
                                </h4>
                            </Card.Body>
                        </Card>
                    </Row>
                    <Row className="mt-3">
                        <Card className="h-100 shadow">
                            <Card.Header as="h5">Player Statistics</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={12}>
                                        <Row className="mb-2">
                                            <Col md={6}><strong>Total Kills:</strong></Col>
                                            <Col md={6}>{selectedPlayer?.totalKill}</Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={6}><strong>Hit Count:</strong></Col>
                                            <Col md={6}>{selectedPlayer?.hitCount}</Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={6}><strong>Shoot Count:</strong></Col>
                                            <Col md={6}>{selectedPlayer?.shootCount}</Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={6}><strong>Total Damage:</strong></Col>
                                            <Col md={6}>{selectedPlayer?.totalDamage}</Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={6}><strong>Total Healing:</strong></Col>
                                            <Col md={6}>{selectedPlayer?.totalHealing}</Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={6}><strong>Total SSketch:</strong></Col>
                                            <Col md={6}>{selectedPlayer?.totalSSketch}</Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={6}><strong>Total Debuff:</strong></Col>
                                            <Col md={6}>{selectedPlayer?.totalDebuff}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Row>
                </Col>

                {/* Right Column - Match Details */}
                <Col md={8}>
                    <Card className="mb-3 shadow">
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
                                            style={isCurrentProfilePlayer(player.id) ? { border: `1px solid ${COLORS.attackerBase}`, cursor: 'pointer' } : { cursor: 'pointer' }}
                                            onClick={() => handlePlayerSelect(player)}
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
                                            style={isCurrentProfilePlayer(player.id) ? { border: `1px solid ${COLORS.defenderBase}`, cursor: 'pointer' } : { cursor: 'pointer' }}
                                            onClick={() => handlePlayerSelect(player)}
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
                    <Card className="shadow">
                        <Tabs defaultActiveKey="general" id="match-tabs" className="mb-3">
                            <Tab eventKey="general" title="General">
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Row className="mb-2">
                                                <Col md={4}><strong>Match ID:</strong></Col>
                                                <Col md={8}>
                                                    {match.matchId}
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="p-0 ms-2"
                                                        onClick={() => copyToClipboard(match.matchId)}
                                                    >
                                                        <FaCopy />
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col md={4}><strong>Match Code:</strong></Col>
                                                <Col md={8}>{match.matchCode}</Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col md={4}><strong>Hoster:</strong></Col>
                                                <Col md={8}>
                                                    {match.hoster.nickname} #{match.hoster.id}
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col md={4}><strong>Phone:</strong></Col>
                                                <Col md={8}>{match.hoster.phoneNumber || 'Unknown'}</Col>
                                            </Row>
                                        </Col>
                                        <Col md={6}>
                                            <Row className="mb-2">
                                                <Col md={4}><strong>Start Time:</strong></Col>
                                                <Col md={8}>{new Date(match.startTime).toLocaleString()}</Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col md={4}><strong>End Time:</strong></Col>
                                                <Col md={8}>{new Date(match.endTime).toLocaleString()}</Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col md={4}><strong>Duration:</strong></Col>
                                                <Col md={8}>{getMatchDuration(match.startTime, match.endTime)}</Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col md={4}><strong>Winner:</strong></Col>
                                                <Col md={8}>
                                                    {match.winnerTeamId === 0 ? 'Draw' : match.winnerTeamId === 1 ? 'Attackers' : 'Defenders'}
                                                </Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col md={4}><strong>Teams count:</strong></Col>
                                                <Col md={8}>2</Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col md={4}><strong>Rounds count:</strong></Col>
                                                <Col md={8}>3</Col>
                                            </Row>
                                            <Row className="mb-2">
                                                <Col md={4}><strong>Players count:</strong></Col>
                                                <Col md={8}>{totalPlayers}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Tab>
                            <Tab eventKey="player" title="Player">
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <h6>Upgrades</h6>
                                            <div className="d-flex flex-wrap">
                                                {selectedPlayer?.upgrades?.map((upgrade, idx) => (
                                                    <OverlayTrigger
                                                        key={idx}
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip>
                                                                <strong>{upgrade.upgradeName}</strong><br />
                                                                {upgrade.description}<br />
                                                                Price: {upgrade.price}
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Image
                                                            src={getPlayerIconSrc(upgrade.iconId)}
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                margin: '5px',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '5px'
                                                            }}
                                                        />
                                                    </OverlayTrigger>
                                                ))}
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <h6>Equipment</h6>
                                            {selectedPlayer?.watch && (
                                                <Card className="mb-2 shadow-sm">
                                                    <Card.Body>
                                                        <strong>Watch:</strong> {selectedPlayer.watch.equipmentName}<br />
                                                        <small>MAC: {selectedPlayer.watch.macAddress}</small>
                                                    </Card.Body>
                                                </Card>
                                            )}
                                            {selectedPlayer?.gun && (
                                                <Card className="mb-2 shadow-sm">
                                                    <Card.Body>
                                                        <strong>Gun:</strong> {selectedPlayer.gun.equipmentName}<br />
                                                        <small>MAC: {selectedPlayer.gun.macAddress}</small>
                                                    </Card.Body>
                                                </Card>
                                            )}
                                            {selectedPlayer?.vest && (
                                                <Card className="mb-2 shadow-sm">
                                                    <Card.Body>
                                                        <strong>Vest:</strong> {selectedPlayer.vest.equipmentName}<br />
                                                        <small>MAC: {selectedPlayer.vest.macAddress}</small>
                                                    </Card.Body>
                                                </Card>
                                            )}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Tab>
                            <Tab eventKey="timeline" title="Timeline" disabled>
                                <Card.Body>
                                    <p>Timeline not implemented</p>
                                </Card.Body>
                            </Tab>
                            <Tab eventKey="teamAnalysis" title="Team Analysis">
                                <Card.Body>
                                    <Row>
                                        {teamStats.map((stat, idx) => (
                                            <Col md={6} key={idx} className="mb-4">
                                                <h6>{stat.name}</h6>
                                                <ResponsiveContainer width="100%" height={200}>
                                                    <PieChart>
                                                        <Pie
                                                            data={stat.data}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={80}
                                                            label
                                                        >
                                                            {stat.data.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Tab>
                            <Tab eventKey="playerComparison" title="Player Comparison">
                                <Card.Body>
                                    <Row className="mb-3">
                                        <Col md={4}>
                                            <Form.Select
                                                value={comparisonMetric}
                                                onChange={(e) => setComparisonMetric(e.target.value)}
                                            >
                                                <option value="totalKill">Total Kills</option>
                                                <option value="accuracy">Accuracy</option>
                                                <option value="totalDamage">Total Damage</option>
                                                <option value="totalHealing">Total Healing</option>
                                                <option value="ssketch">SSketch</option>
                                                <option value="debuff">Debuff</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart
                                            data={playerComparisonData}
                                            layout="vertical"
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={100} />
                                            <Bar dataKey="value" barSize={20}>
                                                {playerComparisonData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Tab>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MatchDetail;