import { useState, useEffect, Fragment } from "react";
import { Table, Pagination, Row, InputGroup, Button, FormControl, Col, Form, Alert, ToastContainer, Toast } from "react-bootstrap";
import { apiAccess } from "../models/endpoints";
import { useNavigate, useSearchParams } from "react-router-dom";

const BoxList = () => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const [boxes, setBoxes] = useState([]);
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "0"));
    const [pageCount, setPageCount] = useState(13334);
    const [validGoToPage, setValidGoToPage] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    const emptyBox = {
        _id: "",
        length: 0,
        width: 0,
        height: 0,
        material: "None",
        color: "None"
    };
    const [tempBox, setTempBox] = useState(emptyBox);

    useEffect(() => {
        // setBoxes();
        fetch(new apiAccess().boxes().page(page).url)
            .then(response => response.json())
            .then(data => {
                const fetchOwnerNamePromises = data.map((box: any) => {
                    return fetch(new apiAccess().userName(box.ownerid).url)
                        .then(response => response.json())
                        .then(data => {
                            box.ownername = data.username;
                        });
                });
                Promise.all(fetchOwnerNamePromises).then(() => {
                    setBoxes(data);
                    setSearchParams((oldParams) => {
                        oldParams.set("page", page.toString());
                        oldParams.set("type", "1");
                        return oldParams;
                    });
                });
            });
    }, [page, showAlert]);

    useEffect(() => {
        fetch(new apiAccess().boxes().pageCount().url)
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
        setTempBox(boxes.find((box: any) => box._id === id) as any);
    }

    function deleteBox() {
        const id = tempBox._id;

        setShowAlert(false)

        fetch(new apiAccess().boxes().id(id).url, {
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
            <Table striped bordered hover variant="dark" className="element-list" id="box-list" >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Dimensions (L x W x H)</th>
                        <th>Material</th>
                        <th>Color</th>
                        <th>Actions</th>
                        <th>By</th>
                    </tr>
                </thead>
                <tbody>
                    {boxes.map((box: any, index: number) => (
                        <tr key={box._id}>
                            <td>{page * 15 + index}</td>
                            <td>{box.length} x {box.width} x {box.height}</td>
                            <td>{box.material}</td>
                            <td>{box.color}</td>
                            <td>
                                <Button variant="info" onClick={() => navigate("/box?id=" + box._id)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteButton(box._id)}>Delete</Button>
                            </td>
                            <td> <a href={"/profile?id=" + box.ownerid}>{box.ownername}</a></td>
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
                    <Button variant="secondary" onClick={() => navigate("/box")}><strong>+</strong></Button>
                </Col>
            </Row>
            <ToastContainer position="middle-center" className="p-3">
                <Toast bg="light" show={showAlert} onClose={() => setShowAlert(false)} >
                    <Toast.Header>
                        <strong className="me-auto">Are you sure you want to delete this box?</strong>
                    </Toast.Header>
                    <Toast.Body>
                        Size: {tempBox.length} x {tempBox.width} x {tempBox.height} <br />
                        Material: {tempBox.material} <br />
                        Color: {tempBox.color}
                    </Toast.Body>
                    <Toast.Body>
                        <Button variant="danger" onClick={() => deleteBox()}>Yes</Button>
                        <Button variant="secondary" onClick={() => setShowAlert(false)}>No</Button>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </Fragment>
    );
};

export default BoxList;