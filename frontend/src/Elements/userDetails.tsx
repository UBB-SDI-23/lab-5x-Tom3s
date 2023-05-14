import { useState, Fragment } from "react";
import { Offcanvas, ListGroup, Button, Row, Col } from "react-bootstrap";
import { destroyLocalSessionDetails } from "../models/entities";
import { useNavigate } from "react-router-dom";

const UserDetailsOffCanvas = () => {

    const navigate = useNavigate();

    const [showOffCanvas, setShowOffCanvas] = useState(false);

    const handleCloseOffCanvas = () => setShowOffCanvas(false);
    const handleShowOffCanvas = () => setShowOffCanvas(true);

    return (
        <Fragment>
            <Button variant="primary" onClick={handleShowOffCanvas}>
                Details
            </Button>
            <Offcanvas show={showOffCanvas} onHide={handleCloseOffCanvas}>
                {
                    localStorage.getItem('sessiontoken') !== null ?
                        <Fragment>
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>User Details</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><strong>Username:</strong> {localStorage.getItem('username')}<span style={{ opacity: 0.5 }}>#{localStorage.getItem('userid')}</span> </ListGroup.Item>
                                    <ListGroup.Item><strong>Role:</strong> {localStorage.getItem('role')} </ListGroup.Item>
                                    <ListGroup.Item><strong>Token:</strong> {localStorage.getItem('sessiontoken')} </ListGroup.Item>
                                </ListGroup>
                                <Row className="justify-content-md-center">
                                    {
                                        window.location.pathname !== "/profile" &&
                                        <Col md="auto">
                                            <Button variant="primary" onClick={() => { navigate("/profile?id=" + localStorage.getItem('userid')); }}>Profile Page</Button>
                                        </Col>
                                    }
                                    {
                                        window.location.pathname !== "/editProfile" &&
                                        <Col md="auto">
                                            <Button variant="primary" onClick={() => { navigate("/editProfile?id=" + localStorage.getItem('userid')); }}>Edit Profile</Button>
                                        </Col>
                                    }
                                    <Col md="auto">
                                        <Button variant="primary" onClick={() => { destroyLocalSessionDetails(); navigate("/home"); }}>Logout</Button>
                                    </Col>
                                </Row>
                            </Offcanvas.Body>
                        </Fragment>
                        :
                        <Fragment>
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>Not logged in</Offcanvas.Title>
                            </Offcanvas.Header>
                        </Fragment>
                }
            </Offcanvas>
        </Fragment>
    );
}

export default UserDetailsOffCanvas;