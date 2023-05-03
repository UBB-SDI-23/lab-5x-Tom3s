import { useState, useEffect, Fragment } from "react";
import { Table, Pagination } from "react-bootstrap";
import { apiAccess } from "../models/endpoints";

const WrapperList = () => {
    
    const [wrapperes, setWrapperes] = useState([]);
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(13334);

    useEffect(() => {
        fetch(new apiAccess().wrappers().page(page).url)
            .then(response => response.json())
            .then(data => setWrapperes(data));
    }, [page]);

    return (
        <Fragment>
            <Table striped bordered hover variant="dark" className="element-list" id="wrapper-list" >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Length</th>
                        <th>Width</th>
                        <th>Color</th>
                        <th>Complementary Color</th>
                        <th>Pattern</th>
                    </tr>
                </thead>
                <tbody>
                    {wrapperes.map((wrapper: any, index: number) => (
                        <tr key={wrapper._id}>
                            <td>{page * 15 + index}</td>
                            <td>{wrapper.length}</td>
                            <td>{wrapper.width}</td>
                            <td>{wrapper.color}</td>
                            <td>{wrapper.complementaryColor}</td>
                            <td>{wrapper.pattern}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
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
            </Fragment>
    );
};

export default WrapperList;