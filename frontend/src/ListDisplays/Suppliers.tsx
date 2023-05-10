import { useState, useEffect, Fragment } from "react";
import { Table, Pagination, Row, InputGroup, Button, FormControl, Col, Form, Toast, ToastContainer } from "react-bootstrap";
import { apiAccess } from "../models/endpoints";
import { useNavigate, useSearchParams } from "react-router-dom";

const SupplierList = () => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const [suppliers, setSuppliers] = useState([]);
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "0"));
    const [pageCount, setPageCount] = useState(13334);
    const [validGoToPage, setValidGoToPage] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    const emptySupplier = {
        _id: "",
        name: "",
        address: "",
        phone: "",
        email: "",
        wrappers: []
    };
    const [tempSupplier, setTempSupplier] = useState(emptySupplier);

    useEffect(() => {
        fetch(new apiAccess().suppliers().page(page).url)
            .then(response => response.json())
            .then(data => {
                setSuppliers(data)
                setSearchParams((oldParams) => {
                    oldParams.set("page", page.toString());
                    oldParams.set("type", "3");
                    return oldParams;
                });
            });
    }, [page, showAlert]);

    useEffect(() => {
        fetch(new apiAccess().suppliers().pageCount().url)
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
        setTempSupplier(suppliers.find((supplier: any) => supplier._id === id) as any);
    }

    function deleteSupplier() {
        const id = tempSupplier._id;

        console.log(id);

        setShowAlert(false)

        fetch(new apiAccess().suppliers().id(id).url, {
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
            <Table striped bordered hover variant="dark" className="element-list" id="supplier-list" >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Phone Number</th>
                        <th>E-mail</th>
                        <th>Nr. of Wrappers</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier: any, index: number) => (
                        <tr key={supplier._id}>
                            <td>{page * 15 + index}</td>
                            <td>{supplier.name}</td>
                            <td>{supplier.address}</td>
                            <td>{supplier.phone}</td>
                            <td>{supplier.email}</td>
                            <td>{supplier.wrappers.length}</td>
                            <td>
                                <Button variant="info" onClick={() => navigate("/supplier?id=" + supplier._id)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteButton(supplier._id)}>Delete</Button>
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
                    <Button variant="secondary" onClick={() => navigate("/supplier")}><strong>+</strong></Button>
                </Col>
            </Row>
            <ToastContainer position="middle-center" className="p-3">
                <Toast bg="light" show={showAlert} onClose={() => setShowAlert(false)} >
                    <Toast.Header>
                        <strong className="me-auto">Are you sure you want to delete this supplier?</strong>
                    </Toast.Header>
                    <Toast.Body>
                        <p><strong>Name:</strong> {tempSupplier.name}</p>
                        <p><strong>Address:</strong> {tempSupplier.address}</p>
                        <p><strong>Phone Number:</strong> {tempSupplier.phone}</p>
                        <p><strong>E-mail:</strong> {tempSupplier.email}</p>
                    </Toast.Body>
                    <Toast.Body>
                        <Button variant="danger" onClick={() => deleteSupplier()}>Yes</Button>
                        <Button variant="secondary" onClick={() => setShowAlert(false)}>No</Button>
                    </Toast.Body>
                </Toast>
            </ToastContainer>

        </Fragment>
    );
};

export default SupplierList;