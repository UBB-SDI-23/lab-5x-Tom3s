import { Fragment, useEffect, useState } from "react"
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { apiAccess } from "../models/endpoints";
import { Button, ButtonGroup, Col, Container, Fade, Form, InputGroup, ListGroup, Offcanvas, Row } from "react-bootstrap";
import { loadavg } from "os";
import { destroyLocalSessionDetails } from "../models/entities";
import UserDetailsOffCanvas from "../Elements/userDetails";

const ProfilePage = () => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [redirect, setRedirect] = useState(<Fragment />);
    const [user, setUser] = useState({} as any);
    const [loading, setLoading] = useState(true);
    const [roleUpdateResponse, setRoleUpdateResponse] = useState("");
    // const [validPageLength, setValidPageLength] = useState(true);
    const [pageLengthResponse, setPageLengthResponse] = useState("");

    // const userId: number = parseInt(searchParams.get("id") || "-1");
    const [userId, setUserId] = useState(parseInt(searchParams.get("id") || "-1"));

    useEffect(() => {
        if (userId === -1) {
            setTimeout(() => {
                setRedirect(<Navigate to="/home" />);
            }, 3000);
        }
    }, []);

    useEffect(() => {
        if (userId !== -1) {
            fetch(new apiAccess().userWithLists(userId).url)
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                    setLoading(false);
                });
        }
    }, [userId]);

    // useEffect(() => {
    //     console.log(user);
    // }, [user]);

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const ordinalIndicator = getOrdinalIndicator(day);
        return `${year}, ${month} ${day}${ordinalIndicator}`;
    }

    function getOrdinalIndicator(day: number) {
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    function handleRoleChange(newRole: string) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'sessiontoken': localStorage.getItem("sessiontoken") || ""
            },
            body: JSON.stringify({ "role": newRole })
        };
        fetch(new apiAccess().updateRole(userId).url, requestOptions)
            .then(response => response.text())
            .then(data => {
                // console.log(data);
                // setUser(data);
                setRoleUpdateResponse(data);
                setTimeout(() => {
                    setRoleUpdateResponse("");
                }, 3000);
                setUserId(-1);
                setTimeout(() => {
                    setUserId(user.userid);
                }, 0);
            });
    }

    function fetchNewPageLength() {
        if (localStorage.getItem("role") === "admin") {
            fetch(new apiAccess().userWithoutLists(parseInt(localStorage.getItem("userid") || "")).url,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    localStorage.setItem("pagelength", data.pagelength);
                });
        }
    }

    function putDefaultPageLength(pageLength: number) {
        console.log(pageLength);
        fetch(new apiAccess().updatePageLength(pageLength).url,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'sessiontoken': localStorage.getItem("sessiontoken") || ""
                }
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                setPageLengthResponse(data);
                setTimeout(() => {
                    setPageLengthResponse("");
                }, 3000);

                fetchNewPageLength();
            });
    }

    function handleSetDefaultPageLength(event: any) {
        event.preventDefault();
        const pageLength = event.target.elements[0].value;
        // if (pageLength > 0 && pageLength <= 50) {
        //     setValidPageLength(true);
        putDefaultPageLength(pageLength);

        // } else {
        //     setValidPageLength(false);
        // }
    }

    return (
        <Fragment>
            <Container>
                {
                    loading ?
                        (
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) :
                        <Fragment>
                            <h1>Profile Page</h1>

                            {redirect}
                            {
                                userId === -1 &&
                                <div className="container">
                                    <div className="row">
                                        <div className="col">
                                            <h1>Profile not found!</h1>
                                            <br />
                                            <p>Redirecting to home page...</p>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                userId !== -1 &&
                                <Fragment>


                                    <ListGroup>
                                        <ListGroup.Item>
                                            <h2>{user.nickname} <span style={{ opacity: 0.5 }}>#{user.userid}</span></h2>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Username:</strong> {user.username}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Email:</strong> {user.email}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Birthday:</strong> {formatDate(user.birthday)}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Gender:</strong> {user.gender}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Eye Color</strong>: {user.eyecolor}
                                        </ListGroup.Item>
                                    </ListGroup>

                                    {
                                        user.boxes &&
                                        <ListGroup>
                                            <ListGroup.Item>
                                                <h2>Statistics</h2>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong># Boxes:</strong> {user.boxes.length}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong># Wrappers:</strong> {user.wrappers.length}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong># Suppliers:</strong> {user.suppliers.length}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <strong># Combos:</strong> {user.combos.length}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    }
                                </Fragment>
                            }

                            <Row className="justify-content-md-center">
                                <Col md="auto">
                                    <Button onClick={() => navigate("/home")}>Go to home</Button>
                                </Col>
                            </Row>

                            <Row>

                                {
                                    localStorage.getItem("role") === "admin" &&
                                    <Col>
                                        <ButtonGroup aria-label="Basic example">
                                            <Button variant="secondary" disabled={true}>Set Role: </Button>
                                            <Button variant="secondary" onClick={() => handleRoleChange("user")} active={user.role === "user"}>User</Button>
                                            <Button variant="secondary" onClick={() => handleRoleChange("moderator")} active={user.role === "moderator"}>Moderator</Button>
                                            <Button variant="secondary" onClick={() => handleRoleChange("admin")} active={user.role === "admin"}>Admin</Button>
                                        </ButtonGroup>
                                        <Fade in={roleUpdateResponse !== ""}>
                                            <label>{roleUpdateResponse}</label>
                                        </Fade>
                                    </Col>
                                }
                                {
                                    localStorage.getItem("role") === "admin" &&
                                    user.role === "admin" &&
                                    <Col>
                                        <Form noValidate onSubmit={handleSetDefaultPageLength} >
                                            <InputGroup className="mb-3" >
                                                <Form.Control type="number" placeholder="Default Page Length" />
                                                <Button variant="primary" type="submit">Set</Button>
                                            </InputGroup>
                                            <Form.Text className="text-muted">
                                                {pageLengthResponse}
                                            </Form.Text>
                                        </Form>
                                    </Col>
                                }
                            </Row>

                        </Fragment>
                }
            </Container>
        </Fragment>
    );
}

export default ProfilePage;