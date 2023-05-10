import { useState, useEffect, Fragment } from "react";
import { Table, Pagination, Row, InputGroup, Button, FormControl, Col, Form } from "react-bootstrap";
import { apiAccess } from "../models/endpoints";

const ComboList = () => {

    const [combos, setCombos] = useState([]);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(13334);
    const [validGoToPage, setValidGoToPage] = useState(true);

    useEffect(() => {
        fetch(new apiAccess().wrapperBoxCombos().page(page).url)
            .then(response => response.json())
            .then(data => setCombos(data));
    }, [page]);

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
            </Row>

        </Fragment>
    );
};

export default ComboList;