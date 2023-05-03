import { useState, useEffect, Fragment } from "react";
import { Table, Pagination, Row, InputGroup, Button, FormControl, Col, Form } from "react-bootstrap";
import { apiAccess } from "../models/endpoints";

const BoxList = () => {
    
    const [boxes, setBoxes] = useState([]);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(13334);
    const [validGoToPage, setValidGoToPage] = useState(true);

    useEffect(() => {
        fetch(new apiAccess().boxes().page(page).url)
            .then(response => response.json())
            .then(data => setBoxes(data));
    }, [page]);

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

    return (
        <Fragment>
            <Table striped bordered hover variant="dark" className="element-list" id="box-list" >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Length</th>
                        <th>Width</th>
                        <th>Height</th>
                        <th>Material</th>
                        <th>Color</th>
                    </tr>
                </thead>
                <tbody>
                    {boxes.map((box: any, index: number) => (
                        <tr key={box._id}>
                            <td>{page * 15 + index}</td>
                            <td>{box.length}</td>
                            <td>{box.width}</td>
                            <td>{box.height}</td>
                            <td>{box.material}</td>
                            <td>{box.color}</td>
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
                        <Pagination.Item onClick={() => setPage(page + 1)} disabled={page + 1 === pageCount}>{page + 2}</Pagination.Item>
                        <Pagination.Ellipsis />
                        <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === pageCount} />
                        <Pagination.Last onClick={() => setPage(pageCount)} disabled={page === pageCount} />
                    </Pagination>
                </Col>
                <Col xs={2}>
                    <Form noValidate onSubmit={handleGoToPage} >
                        <InputGroup className="mb-3">
                        <Form.Control type="number" placeholder="Go to page" min={1} max={pageCount - 1} />
                        <Button variant="primary" type="submit">Go</Button>
                        <Form.Text className="text-muted">
                            {validGoToPage ? "" : "Invalid page number"}
                        </Form.Text>
                        </InputGroup>

                    </Form>
                </Col>
            </Row>
            
        </Fragment>
    );
};

export default BoxList;