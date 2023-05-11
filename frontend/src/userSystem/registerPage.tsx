import { Fragment, useEffect, useRef, useState } from "react";
import { Form, Col, Row, InputGroup, Button } from "react-bootstrap";


const RegisterPage = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validUsername, setValidUsername] = useState(false); 
    const [validPassword, setValidPassword] = useState(false); 

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
        setValidPassword(password == "" ||  validatePassword());
        if (validPassword) {
            console.log(password);
        }
    }, [password]);

    // useEffect(() => {
    //     if (validPassword) {
    //         console.log(password);
    //     }
    // }, [validPassword]);

    function handleSubmit(event: any) {
        event.preventDefault();
    }

    return (
        <Fragment>
            <h1>Register</h1>
            <Form onSubmit={handleSubmit}>
                <Col sm={6}>
                    <Form.Group as={Row} controlId="formUsername">
                        <Form.Label column sm={2}>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" required onChange={onChangeUsername} value={username} />
                    </Form.Group>
                    
                    <Form.Group as={Row} controlId="formPassword">
                        <Form.Label column sm={2}>Password</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control type="password" placeholder="Enter password" required onChange={onChangePassword} value={password} isInvalid={!validPassword} isValid={password != "" && validPassword}/>
                            <Form.Control.Feedback type="invalid">
                                Password must be at least 8 characters long and contain at least one uppercase, one lowercase, and one special character.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    {/* submit button */}

                    <Button variant="primary" type="submit" disabled={password == "" || !validPassword}  >
                        Register
                    </Button>



                </Col>
            </Form>
        </Fragment>
    );
}

export default RegisterPage;

    