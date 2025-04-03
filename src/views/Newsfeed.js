import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { FaRegThumbsUp, FaRegComment, FaRegUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Newsfeeds() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get("newsfeed/post");
            const formattedPosts = response.data.feeds.map(post => ({
                id: post.id,
                username: post.username,
                timestamp: new Date(post.created_at).toLocaleString(),
                content: post.content,
                likes: post.total_likes,
                comments: [],
                totalComments: post.total_comments,
                showComments: false
            }));
            setPosts(formattedPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`newsfeed/post/comment/${postId}`);
            const comments = response.data.comments.map(comment => ({
                id: comment.id,
                user: comment.commented_by,
                text: comment.comment,
                timestamp: new Date(comment.created_at).toLocaleString(),
            }));

            setPosts(posts.map(post =>
                post.id === postId ? { ...post, comments, showComments: !post.showComments } : post
            ));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    return (
        <Container fluid>
            <Row className="justify-content-center mx-0">
                <Col className="px-0">
                    {posts.map(post => (
                        <Card key={post.id} className="mb-3 w-100">
                            <Card.Header className="d-flex align-items-center p-3">
                                <div className="profile-icon rounded-circle d-flex align-items-center justify-content-center">
                                    <FaRegUser size={24} />
                                </div>
                                <div className="mx-3">
                                    <strong>{post.username}</strong>
                                    <div style={{ fontSize: "12px", color: "gray" }}>{post.timestamp}</div>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-3">
                                <Card.Text className="mb-3">{post.content}</Card.Text>
                                <div className="d-flex align-items-center">
                                    <FaRegThumbsUp className="icon-hover mx-1" />
                                    <span className="mx-1">{post.likes}</span>
                                    <FaRegComment className="icon-hover mx-1" 
                                        onClick={() => post.totalComments > 0 && fetchComments(post.id)}
                                    />
                                    <span>{post.totalComments}</span>
                                </div>
                                {post.showComments && (
                                    <div className="comment-section expanded">
                                        <div className="comment-container">
                                            {post.comments.map(comment => (
                                                <div key={comment.id} className="comment-item p-2">
                                                    <FaRegUser className="comment-icon" />
                                                    <div className="comment-content">
                                                        <strong>{comment.user}</strong>
                                                        <div style={{ fontSize: "12px", color: "gray" }}>{comment.timestamp}</div>
                                                        <div className="mt-2">{comment.text}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>

            <style>
                {`
                    .profile-icon {
                        width: 40px;
                        height: 40px;
                        background-color: #ddd;
                        border-radius: 50%;
                    }
                    .icon-hover {
                        cursor: pointer;
                        transition: transform 0.2s, color 0.2s;
                    }
                    .icon-hover:hover {
                        transform: scale(1.2);
                        color: #007bff;
                    }
                    .comment-section {
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out;
                        opacity: 0;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        margin-top: 10px;
                        background: #fff;
                        padding: 2px;
                    }
                    .comment-section.expanded {
                        max-height: 500px;
                        opacity: 1;
                    }
                    .comment-container {
                        max-height: 500px;
                        overflow-y: auto;
                        padding: 10px;
                    }
                    .comment-item {
                        display: flex;
                        align-items: center;
                        padding: 10px;
                        background: #fff;
                        border-radius: 8px;
                        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
                        margin-bottom: 5px;
                    }
                    .comment-icon {
                        font-size: 18px;
                        color: #6c757d;
                        margin-right: 8px;
                    }
                `}
            </style>
        </Container>
    );
}

export default Newsfeeds;
