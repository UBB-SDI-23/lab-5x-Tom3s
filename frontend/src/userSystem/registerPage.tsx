import { Fragment, useEffect, useRef, useState } from "react";
import { Form, Col, Row, InputGroup, Button, Container } from "react-bootstrap";
import { apiAccess } from "../models/endpoints";
import { useNavigate } from "react-router-dom";


const RegisterPage = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [token, setToken] = useState("");

    const onChangeUsername = (event: any) => { setUsername(event.target.value); };
    const onChangePassword = (event: any) => { setPassword(event.target.value); };

    function validatePassword(): boolean {
        // one uppercase, one lowercase, and one special character
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(password);
    }

    function validateUsername(): boolean {
        const regex = /^[a-zA-Z0-9-_.]+$/;
        return regex.test(username);
    }

    useEffect(() => {
        setValidPassword(password == "" || validatePassword());
    }, [password]);

    useEffect(() => {
        setValidUsername(username == "" || validateUsername());
    }, [username]);

    function handleSubmit(event: any) {
        event.preventDefault();

        const data = {
            "username": username,
            "password": password
        }

        fetch(new apiAccess().register().url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.text())
            .then(data => {
                setToken(data);
            });

        setUsername("");
        setPassword("");
    }

    return (
        <Fragment>
            <Container>
                <h1>Register</h1>
                <Form onSubmit={handleSubmit}>
                    <Col sm={6}>
                        <Form.Group as={Row} controlId="formUsername">
                            <Form.Label column sm={2}>Username</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control type="text" placeholder="Enter username" required onChange={onChangeUsername} value={username} isInvalid={!validUsername} isValid={username != "" && validUsername} />
                                <Form.Control.Feedback type="invalid">
                                    Username must be at least 1 character long and contain only letters, numbers, and the following characters: -_.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPassword">
                            <Form.Label column sm={2}>Password</Form.Label>
                            <InputGroup hasValidation>
                                <Form.Control type="password" placeholder="Enter password" required onChange={onChangePassword} value={password} isInvalid={!validPassword} isValid={password != "" && validPassword} />
                                <Form.Control.Feedback type="invalid">
                                    Password must be at least 8 characters long and contain at least one uppercase, one lowercase, and one special character.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={(password == "" || !validPassword) || (username == "" || !validUsername)}>
                            Register
                        </Button>
                    </Col>
                </Form>

                {
                    token != "" &&
                    (<div>
                        <h2>Registration initiated</h2>
                        <p>
                            <Button variant="primary" onClick={() => navigate("/confirm?token=" + token)}>Click here </Button>
                            to confirm registration (valid for 10 minues)</p>
                    </div>)
                }
            </Container>
        </Fragment>
    );
}

export default RegisterPage;

