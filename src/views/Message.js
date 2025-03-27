import React, { useEffect, useState, useRef } from "react";
import { Card, Container, Row, Col, Spinner, Modal, Button } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Message() {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const scrollRef = useRef(null); // 👈 Added

    const fetchConversations = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("chat/conversations");
            const data = (response.data || []).map((row, index) => ({
                ...row,
                "S NO.": index + 1,
            }));
            setConversations(data);
        } catch (error) {
            console.error("Error fetching conversation data:", error);
            toast.error("Failed to fetch conversations.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    const handleChatClick = async (conversationId) => {
        try {
            setModalLoading(true);
            setShowModal(true);
            const response = await axios.get(`chat/conversations/messages/${conversationId}`);
            setMessages(response.data || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to fetch messages.");
        } finally {
            setModalLoading(false);
        }
    };

    // ✅ Scroll to bottom when messages load
    useEffect(() => {
        if (showModal && !modalLoading && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, modalLoading, showModal]);

    const columns = [
        {
            dataField: "serialNo",
            text: "Sr. NO.",
            headerClasses: "border-0",
            classes: "border-0",
            headerStyle: { width: "150px" },
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: "conversation_name",
            text: "Conversation Name",
            sort: true,
            headerClasses: "border-0",
            classes: "border-0",
            formatter: (cell) => cell || "N/A",
        },
        {
            dataField: "last_message",
            text: "Last Message",
            sort: true,
            headerClasses: "border-0",
            classes: "border-0",
            formatter: (cell) => cell || "N/A",
        },
        {
            dataField: "last_message_time",
            text: "Last Message Received",
            sort: true,
            headerClasses: "border-0",
            classes: "border-0",
            formatter: (cell) => cell || "N/A",
        },
        {
            dataField: "conversation_id",
            text: "View Messages",
            headerClasses: "border-0 text-center",
            classes: "border-0 text-center",
            headerStyle: { width: "120px" },
            formatter: (cell) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <i
                        className="nc-icon nc-single-copy-04"
                        style={{ cursor: "pointer", color: "#007bff", fontSize: "18px" }}
                        onClick={() => handleChatClick(cell)}
                        title="View Messages"
                    />
                </div>
            ),
        },
    ];
    return (
        <>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <Card className="stripped-table-with-hover">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title as="h4">Employee Conversations</Card.Title>
                                </div>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                {isLoading ? (
                                    <div style={{ textAlign: "center" }}>
                                        <Spinner animation="border" role="status" />
                                    </div>
                                ) : (
                                    <BootstrapTable
                                        keyField="conversation_id"
                                        data={conversations}
                                        columns={columns}
                                        pagination={paginationFactory()}
                                        noDataIndication="No Data Found"
                                        striped
                                        hover
                                    />
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modal for Messages */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header>
                    <Modal.Title>Messages</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    ref={scrollRef}
                    style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        backgroundColor: "#f5f5f5",
                        padding: "10px",
                    }}
                >
                    {modalLoading ? (
                        <div style={{ textAlign: "center" }}>
                            <Spinner animation="border" role="status" />
                        </div>
                    ) : messages.length > 0 ? (
                        <div>
                            {messages.map((msg, index) => {
                                const isOwnMessage = msg.sender_id === 240; // Replace with logged-in user id
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: isOwnMessage ? "flex-end" : "flex-start",
                                            marginBottom: "15px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                background: isOwnMessage ? "#007bff" : "#e0e0e0",
                                                color: isOwnMessage ? "#fff" : "#000",
                                                padding: "10px 15px",
                                                borderRadius: "20px",
                                                maxWidth: "80%",
                                                wordWrap: "break-word",
                                            }}
                                        >
                                            {msg.message}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "10px",
                                                marginTop: "5px",
                                                color: "#555",
                                                marginRight: isOwnMessage ? "10px" : "0",
                                                marginLeft: isOwnMessage ? "0" : "10px",
                                            }}
                                        >
                                            {new Date(msg.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>No messages found.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        </>
    );
}

export default Message;
