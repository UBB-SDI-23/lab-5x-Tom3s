import { Fragment, useEffect, useRef, useState } from "react";
import { Form, Col, Row, InputGroup, Button } from "react-bootstrap";
import { apiAccess } from "../models/endpoints";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validUsername, setValidUsername] = useState(false); 
    const [token, setToken] = useState("");
    const [successfulLogin, setSuccessfulLogin] = useState(false);
    const [responseError, setResponseError] = useState("");

    const onChangeUsername = (event: any) => { setUsername(event.target.value); };
    const onChangePassword = (event: any) => { setPassword(event.target.value); };

    function handleSubmit(event: any) {
        event.preventDefault();
        
        const data = {
            "username": username,
            "password": password
        }

        fetch(new apiAccess().login().url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.status === 200) {
                    setSuccessfulLogin(true);
                }
                return res.text();
            })
            .then(data => {
                    setResponseError(data);
                    setToken(data);
            });

        setPassword("");
    }

    return (
        <Fragment>
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
                <Col sm={6}>
                    <Form.Group as={Row} controlId="formUsername">
                        <Form.Label column sm={2}>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" required onChange={onChangeUsername} value={username} />
                    </Form.Group>
                    
                    <Form.Group as={Row} controlId="formPassword">
                        <Form.Label column sm={2}>Password</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control type="password" placeholder="Enter password" required onChange={onChangePassword} value={password} />
                            <Form.Control.Feedback type="invalid">
                                Password must be at least 8 characters long and contain at least one uppercase, one lowercase, and one special character.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Col>
            </Form>

            {
                successfulLogin ?
                (<div>
                    <p>Successful login!</p>
                    <p>Token: {token}</p>
                    {/* <Button variant="primary" onClick={() => navigate("/user")}>Go to user page</Button> */}
                </div>) :
                ( responseError != "" &&
                <div>
                    <p>Failed login!</p>
                    <p>Error: {responseError}</p>
                </div>)
            }
        </Fragment>
    );
}

export default LoginPage;

    