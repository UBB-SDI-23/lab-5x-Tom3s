import { Fragment, useEffect, useState } from "react"
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { apiAccess } from "../models/endpoints";
import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { loadavg } from "os";

const ProfilePage = () => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [redirect, setRedirect] = useState(<Fragment />);
    const [user, setUser] = useState({} as any);

    const userId: number = parseInt(searchParams.get("id") || "-1");

    useEffect(() => {
        if (userId === -1) {
            setTimeout(() => {
                setRedirect(<Navigate to="/home" />);
            }, 3000);
        }
    }, []);

    useEffect(() => {
        if (userId !== -1) {
            fetch(new apiAccess().userWithDetails(userId).url)
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                });
        }
    }, [userId]);

    useEffect(() => {
        console.log(user);
    }, [user]);

    console.log(userId);

    return (
        <Fragment>
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
                    <h1>Profile Page</h1>

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
                            <strong>Birthday:</strong> {Date.parse(user.birthday).toLocaleString()}
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
            

        </Fragment>
    );
}

export default ProfilePage;