import { Fragment, useEffect, useMemo, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { apiAccess } from "../models/endpoints";

const ConfirmPage = () => {

    const navigate = useNavigate();

    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState("");
    const [accepted, setAccepted] = useState(false);
    const token = params.get("token") || "";

    useEffect(() => {
        if (token) {
            fetch(new apiAccess().confirm(token).url)
                .then(res => {
                    if (res.status == 200) {
                        setAccepted(true);
                    }
                    return res.text();
                })
                .then(data => {
                    setResponse(data);
                    console.log(data);
                    setLoading(false);
                }
                );
        }
    }, [token]);

    return (
        <Fragment>
            <Container>
                {
                    loading ?
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        :
                        (
                            accepted ?
                                <div>
                                    <h1>Account confirmed!</h1>
                                    <Button onClick={() => navigate("/login")}>Go to login</Button>
                                </div>
                                :
                                <div>
                                    <h1>Account not confirmed!</h1>
                                    <br />
                                    <p>{response}</p>
                                    <Button onClick={() => navigate("/register")}>Go to register</Button>
                                </div>
                        )

                }
            </Container>
        </Fragment>
    )
}

export default ConfirmPage;