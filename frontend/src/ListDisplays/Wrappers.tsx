import { useState, useEffect, Fragment } from "react";
import { Table, Pagination, Button, Col, Form, InputGroup, Row, Toast, ToastContainer } from "react-bootstrap";
import { apiAccess } from "../models/endpoints";
import { useNavigate } from "react-router-dom";

const WrapperList = () => {

    const navigate = useNavigate();

    const [wrapperes, setWrapperes] = useState([]);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(13334);
    const [validGoToPage, setValidGoToPage] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    const emptyWrapper = {
        _id: "",
        length: 0,
        width: 0,
        color: "None",
        complementarycolor: "None",
        pattern: "None"
    };
    const [tempWrapper, setTempWrapper] = useState(emptyWrapper);

    useEffect(() => {
        fetch(new apiAccess().wrappers().page(page).url)
            .then(response => response.json())
            .then(data => setWrapperes(data));
    }, [page, showAlert]);

    useEffect(() => {
        fetch(new apiAccess().wrappers().pageCount().url)
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
        setTempWrapper(wrapperes.find((wrapper: any) => wrapper._id === id) as any);
    }

    function deleteWrapper() {
        const id = tempWrapper._id;

        setShowAlert(false)


        fetch(new apiAccess().wrappers().id(id).url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => { });

        setTimeout(() => {
            fetch(new apiAccess().wrappers().page(page).url)
                .then(response => response.json())
                .then(data => setWrapperes(data));
        }, 1);
    }



    return (
        <Fragment>
            <Table striped bordered hover variant="dark" className="element-list" id="wrapper-list" >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Length x Width</th>
                        <th>Color</th>
                        <th>Complementary Color</th>
                        <th>Pattern</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {wrapperes.map((wrapper: any, index: number) => (
                        <tr key={wrapper._id}>
                            <td>{page * 15 + index}</td>
                            <td>{wrapper.length} x {wrapper.width}</td>
                            <td>{wrapper.color}</td>
                            <td>{wrapper.complementarycolor}</td>
                            <td>{wrapper.pattern}</td>
                            <td>
                                <Button variant="info" onClick={() => navigate("/wrapper?id=" + wrapper._id)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteButton(wrapper._id)}>Delete</Button>
                            </td>
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
                    <Button variant="secondary" onClick={() => navigate("/wrapper")}><strong>+</strong></Button>
                </Col>
            </Row>
            <ToastContainer position="middle-center" className="p-3">
                <Toast bg="light" show={showAlert} onClose={() => setShowAlert(false)} >
                    <Toast.Header>
                        <strong className="me-auto">Are you sure you want to delete this wrapper?</strong>
                    </Toast.Header>
                    <Toast.Body>
                        Size: {tempWrapper.length} x {tempWrapper.width} <br />
                        Color: {tempWrapper.color} / {tempWrapper.complementarycolor} <br />
                        Pattern: {tempWrapper.pattern}
                    </Toast.Body>
                    <Toast.Body>
                        <Button variant="danger" onClick={() => deleteWrapper()}>Yes</Button>
                        <Button variant="secondary" onClick={() => setShowAlert(false)}>No</Button>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </Fragment>
    );
};

export default WrapperList;