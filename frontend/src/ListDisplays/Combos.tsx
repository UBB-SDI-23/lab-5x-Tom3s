import { useState, useEffect, Fragment } from "react";
import { Table, Pagination, Row, InputGroup, Button, FormControl, Col, Form, Toast, ToastContainer } from "react-bootstrap";
import { apiAccess } from "../models/endpoints";
import { useNavigate, useSearchParams } from "react-router-dom";

const ComboList = () => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const [combos, setCombos] = useState([]);
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "0"));
    const [pageCount, setPageCount] = useState(13334);
    const [validGoToPage, setValidGoToPage] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    const emptyCombo = {
        _id: "",
        wrapperid: 0,
        boxid: 0,
        name: "None",
        price: 0
    };

    const [tempCombo, setTempCombo] = useState(emptyCombo);

    useEffect(() => {
        // setBoxes();
        fetch(new apiAccess().combos().page(page).url)
            .then(response => response.json())
            .then(data => {
                const fetchOwnerNamePromises = data.map((combo: any) => {
                    return fetch(new apiAccess().userName(combo.ownerid).url)
                        .then(response => response.json())
                        .then(data => {
                            combo.ownername = data.username;
                            console.log(data);
                        });
                });
                Promise.all(fetchOwnerNamePromises).then(() => {
                    setCombos(data);
                    setSearchParams((oldParams) => {
                        oldParams.set("page", page.toString());
                        oldParams.set("type", "4");
                        return oldParams;
                    });
                });
            });
    }, [page, showAlert]);

    useEffect(() => {
        fetch(new apiAccess().wrapperBoxCombos().pageCount().url)
            .then(response => response.json())
            .then(data => setPageCount(parseInt(data) - 1));
    }, []);

    function handleGoToPage(event: any) {
        event.preventDefault();
        const page = event.target.elements[0].value;
        if (page > 0 && page <= pageCount) {
            setPage(page - 1);
            setValidGoToPage(true);
        } else {
            setValidGoToPage(false);
        }
    }

    function handleDeleteButton(id: string) {
        setShowAlert(true);
        setTempCombo(combos.find((box: any) => box._id === id) as any);
    }

    function deleteCombo() {
        const id = tempCombo._id;

        console.log(id);

        setShowAlert(false)

        fetch(new apiAccess().combos().id(id).url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => { });
    }

    return (
        <Fragment>
            <Table striped bordered hover variant="dark" className="element-list" id="combo-list" >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Wrapper ID</th>
                        <th>Box ID</th>
                        <th>Combo Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                        <th>By</th>
                    </tr>
                </thead>
                <tbody>
                    {combos.map((combo: any, index: number) => (
                        <tr key={combo._id}>
                            <td>{page * 15 + index}</td>
                            <td>{combo.wrapperid}</td>
                            <td>{combo.boxid}</td>
                            <td>{combo.name}</td>
                            <td>{combo.price}$</td>
                            <td>
                                <Button variant="info" onClick={() => navigate("/combo?id=" + combo._id)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteButton(combo._id)}>Delete</Button>
                            </td>
                            <td> <a href={"/profile?id=" + combo.ownerid}>{combo.ownername}</a></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Row>
                <Col xs={3}>
                    <Pagination>
                        <Pagination.First onClick={() => setPage(0)} disabled={page <= 0} />
                        <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page <= 0} />
                        <Pagination.Ellipsis />
                        <Pagination.Item onClick={() => setPage(page - 1)} disabled={page <= 0}>{page}</Pagination.Item>
                        <Pagination.Item active>{page + 1}</Pagination.Item>
                        <Pagination.Item onClick={() => setPage(page + 1)} disabled={page + 1 > pageCount}>{page + 2}</Pagination.Item>
                        <Pagination.Ellipsis />
                        <Pagination.Next onClick={() => setPage(page + 1)} disabled={page + 1 > pageCount} />
                        <Pagination.Last onClick={() => setPage(pageCount)} disabled={page === pageCount} />
                    </Pagination>
                </Col>
                <Col xs={2}>
                    <Form noValidate onSubmit={handleGoToPage} >
                        <InputGroup className="mb-3">
                            <Form.Control type="number" placeholder="Go to page" min={1} max={pageCount - 1} />
                            <Button variant="primary" type="submit">Go</Button>
                        </InputGroup>
                        <Form.Text className="text-muted">
                            {validGoToPage ? "" : "Invalid page number"}
                        </Form.Text>

                    </Form>
                </Col>
                <Col xs={1}>
                    <Button variant="secondary" onClick={() => navigate("/combo")}><strong>+</strong></Button>
                </Col>
            </Row>
            <ToastContainer position="middle-center" className="p-3">
                <Toast bg="light" show={showAlert} onClose={() => setShowAlert(false)} >
                    <Toast.Header>
                        <strong className="me-auto">Are you sure you want to delete this box?</strong>
                    </Toast.Header>
                    <Toast.Body>
                        BoxID: {tempCombo.boxid} <br />
                        WrapperID: {tempCombo.wrapperid} <br />
                        Combo Name: {tempCombo.name} <br />
                        Price: {tempCombo.price}$ <br />
                    </Toast.Body>
                    <Toast.Body>
                        <Button variant="danger" onClick={() => deleteCombo()}>Yes</Button>
                        <Button variant="secondary" onClick={() => setShowAlert(false)}>No</Button>
                    </Toast.Body>
                </Toast>
            </ToastContainer>

        </Fragment>
    );
};

export default ComboList;