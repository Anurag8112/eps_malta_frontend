import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Modal, Button } from "react-bootstrap";
import { FaRegUser, FaEye } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
    const [announcedUsers, setAnnouncedUsers] = useState([]);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get("announcement");
            const formattedAnnouncements = response.data.map(announcement => ({
                id: announcement.id,
                title: announcement.title,
                content: announcement.content,
                ownerName: announcement.owner_name,
                timestamp: new Date(announcement.created_at).toLocaleString(),
                totalAnnouncedUsers: announcement.total_announced_users,
                readCount: announcement.read_count || 0, // Assuming API returns read count
            }));
            setAnnouncements(formattedAnnouncements);
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    const fetchAnnouncedUsers = async (announcementId) => {
        try {
            const response = await axios.get(`announcement/${announcementId}/announced-users`);
            setAnnouncedUsers(response.data);
            setSelectedAnnouncementId(announcementId);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching announced users:", error);
        }
    };

    return (
        <Container fluid>
            <Row className="justify-content-center mx-0">
                <Col className="px-0">
                    {announcements.map(announcement => (
                        <Card key={announcement.id} className="mb-3 w-100">
                            <Card.Header className="d-flex align-items-center justify-content-between p-3">
                                {/* Left Side: Profile and Owner Name */}
                                <div className="d-flex align-items-center">
                                    <div className="profile-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <FaRegUser size={24} />
                                    </div>
                                    <div className="mx-2"> {/* Reduced spacing from mx-3 to mx-2 */}
                                        <strong>{announcement.ownerName}</strong>
                                        <div style={{ fontSize: "12px", color: "gray" }}>{announcement.timestamp}</div>
                                    </div>
                                </div>

                                {/* Right Side: Eye Icon with Read Count */}
                                <Button variant="light" className="eye-button">
                                    <FaEye className="eye-icon" /> {announcement.readCount}/{announcement.totalAnnouncedUsers}
                                </Button>
                            </Card.Header>

                            <Card.Body className="p-3">
                                <Card.Title className="announcement-title">{announcement.title}</Card.Title>
                                <Card.Text>{announcement.content}</Card.Text>
                                <hr />
                                <div className="recipients-section">
                                    <div className="recipients-text">RECIPIENTS :</div>
                                    <Button 
                                        variant="primary" 
                                        className="recipients-button" 
                                        onClick={() => fetchAnnouncedUsers(announcement.id)}
                                    >
                                        {announcement.totalAnnouncedUsers} Employees Announced
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>

            {/* Modal for showing announced users */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>Announced Users</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-scroll">
                    {announcedUsers.length > 0 ? (
                        <ul className="list-group">
                            {announcedUsers.map(user => (
                                <li key={user.id} className="list-group-item">
                                    <strong>{user.username}</strong> <br />
                                    <span style={{ fontSize: "12px", color: "gray" }}>{user.email}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No announced users found.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            <style>
                {`
                    .profile-icon {
                        width: 40px;
                        height: 40px;
                        background-color: #ddd;
                        border-radius: 50%;
                    }
                    .announcement-title {
                        font-size: 24px; /* Increased size */
                        font-weight: bold; /* Bold */
                        color: blue !important; /* Blue color */
                    }
                    .recipients-section {
                        text-align: start;
                        margin-top: 10px;
                    }
                    .recipients-text {
                        font-size: 18px;
                        font-weight: bold;
                        text-transform: uppercase;
                        color: #6c757d; /* Gray color */
                        margin-bottom: 10px;
                    }
                    .recipients-button {
                        font-size: 16px;
                        padding: 8px 12px;
                    }
                    .eye-button {
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        color: #6c757d; /* Gray color */
                        border: none;
                        background: transparent;
                    }
                    .eye-icon {
                        margin-right: 5px;
                        color: #007bff; /* Blue color */
                    }
                    /* Scrollable modal body */
                    .modal-body-scroll {
                        max-height: 400px;
                        overflow-y: auto;
                    }
                `}
            </style>
        </Container>
    );
}

export default Announcements;
