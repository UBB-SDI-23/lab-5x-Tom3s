import { Fragment } from "react"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import UserDetailsOffCanvas from "./userDetails"
import { destroyLocalSessionDetails } from "../models/entities"
import { useNavigate } from "react-router-dom"

const NavigationBar = () => {

    const navigate = useNavigate();

    return (
        <Fragment>
            <Navbar bg="dark" variant="dark" sticky="top">
                <Container>
                    <UserDetailsOffCanvas />
                    <Navbar.Brand href="/home">Box App</Navbar.Brand>
                    <Navbar.Toggle />
                    {
                        localStorage.getItem('sessiontoken') !== null &&
                        <Navbar.Text>
                            Signed in as: <a href={"/profile?id=" + localStorage.getItem('userid')}>{localStorage.getItem('username')}</a>
                        </Navbar.Text>
                    }
                    {
                        localStorage.getItem('sessiontoken') === null ?
                            <Fragment>
                                <Button variant="primary" onClick={() => navigate("/register")}>Register</Button>
                                <Button variant="primary" onClick={() => navigate("/login")}>Login</Button>
                            </Fragment>
                            :
                            <Button variant="primary" onClick={() => { destroyLocalSessionDetails(); navigate("/"); }}>Logout</Button>

                    }
                </Container>
            </Navbar>
        </Fragment>
    )
}

export default NavigationBar