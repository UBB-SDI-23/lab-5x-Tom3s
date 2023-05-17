import { useState, Fragment, useRef } from "react";
import { Offcanvas, ListGroup, Button, Row, Col, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap";
import { destroyLocalSessionDetails } from "../models/entities";
import { useNavigate } from "react-router-dom";

const UserDetailsOffCanvas = () => {

    const navigate = useNavigate();

    const [showOffCanvas, setShowOffCanvas] = useState(false);

    const handleCloseOffCanvas = () => setShowOffCanvas(false);
    const handleShowOffCanvas = () => setShowOffCanvas(true);

    const [showCopyOverlay, setShowCopyOverlay] = useState(false);
    const copyTarget = useRef(null);

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
                                    {/* <ListGroup.Item><strong>Token:</strong> {localStorage.getItem('sessiontoken')} </ListGroup.Item> */}
                                    <ListGroup.Item><strong>Token</strong> 
                                        <Button ref={copyTarget} variant="outline-primary" onClick={() => { navigator.clipboard.writeText(localStorage.getItem('sessiontoken') || ""); setShowCopyOverlay(true); }}>
                                            Copy
                                        </Button>
                                        <Overlay target={copyTarget.current} show={showCopyOverlay} placement="right">
                                            {(props) => {
                                                setTimeout(() => { setShowCopyOverlay(false); }, 3000);
                                                return (
                                                <Tooltip id="overlay-example" {...props}>
                                                    Copied!
                                                </Tooltip>
                                            )}
                                            }
                                        </Overlay>
                                    </ListGroup.Item>
                                </ListGroup>
                                <Row className="justify-content-md-center">
                                    {
                                        window.location.pathname !== "/profile" &&
                                        <Col md="auto">
                                            <Button variant="primary" onClick={() => { navigate("/profile?id=" + localStorage.getItem('userid')); }}>Profile Page</Button>
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