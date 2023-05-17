import React from "react";
import { Fragment } from "react";
import { Pagination, Row, Col, Button, Modal, Form, Table } from "react-bootstrap";
import { Navigate } from "react-router-dom";

interface BulkDeletorTemplateState {
    list: any[];
    selectedItems: any[];
    page: number;
    pageCount: number;
    validGoToPage: boolean;
    showDeleteModal: boolean;
    showConfirmModal: boolean;
    confirmResponse: string;
    navigate: any;
}

abstract class BulkDeletorTemplate extends React.Component<{}, BulkDeletorTemplateState> {

    abstract fieldNames: string[];
    abstract typeName: string;
    abstract typeNumber: number;
    searchParams = new URLSearchParams(window.location.search);

    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            selectedItems: [],
            page: parseInt(this.searchParams.get("page") || "0"),
            pageCount: 0,
            validGoToPage: true,
            showDeleteModal: false,
            showConfirmModal: false,
            confirmResponse: "",
            navigate: <Fragment />
        };
    }

    navigate(url: string) {
        this.setState({ navigate: <Navigate to={url} /> });
    }

    componentDidMount() {
        const role = localStorage.getItem("role") as string;
        if (role !== "admin") {
            this.navigate("/home");
        }
        this.fetchPageCount();
        this.fetchList();
    }

    setSearchParams(page: number) {
        this.searchParams.has("page") ? this.searchParams.set("page", page.toString()) : this.searchParams.append("page", page.toString());
        window.history.pushState({}, "", "?" + this.searchParams.toString());
    }

    fetchList() {
        fetch(this.getFetchUrl())
            .then(async response => {
                const data: any[] = await response.json() as any[];
                data.forEach(item => item.selected = this.state.selectedItems.includes(item));
                this.setState({ list: data });
                const page = this.state.page;
                this.setSearchParams(page);
            });
    }

    fetchPageCount() {
        fetch(this.getFetchPageCountUrl())
            .then(async response => {
                const data: number = await response.json() as number;
                this.setState({ pageCount: data - 1 });
            });
    }

    abstract getFetchUrl(): string;

    abstract getFetchPageCountUrl(): string;

    abstract getDeleteItemUrl(): string;

    handleDeleteButton() {
        this.setState({ showDeleteModal: true, selectedItems: this.state.list.filter(item => item.selected) });
    }

    handleDeleteConfirm() {
        const sessionToken = localStorage.getItem("sessiontoken") as string;

        this.setState({ showDeleteModal: false });

        fetch(this.getDeleteItemUrl(), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'sessiontoken': sessionToken
            },
            body: this.getDeleteBody()
        })
            .then(async response => {
                const data: string = await response.text() as string;
                this.setState({ confirmResponse: data });
                this.setState({ showConfirmModal: true });
                console.log(data);
                this.fetchList();
            });
    }

    getDeleteBody(): string {
        const list = {
            ids: this.state.selectedItems.map(item => item._id)
        };
        console.log(JSON.stringify(list));
        return JSON.stringify(list);
    }

    handleGoToPage(event: any) {
        event.preventDefault();
        const page = event.target.elements[0].value;
        console.log(this.state.pageCount);
        if (page > 0 && page <= this.state.pageCount) {
            this.setState({ page: page - 1 });
            this.setState({ validGoToPage: true });
        } else {
            this.setState({ validGoToPage: false });
        }
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<BulkDeletorTemplateState>, snapshot?: any): void {
        if (prevState.page !== this.state.page || prevState.showConfirmModal !== this.state.showConfirmModal) {
            this.fetchList();
            console.log("fetching list");
        }
    }

    getPagination(): JSX.Element {
        return (
            <Pagination>
                <Pagination.First onClick={() => this.setState({ page: 0 })} disabled={this.state.page <= 0} />
                <Pagination.Prev onClick={() => this.setState({ page: this.state.page - 1 })} disabled={this.state.page <= 0} />
                <Pagination.Ellipsis />
                <Pagination.Item onClick={() => this.setState({ page: this.state.page - 1 })} disabled={this.state.page <= 0}>{this.state.page}</Pagination.Item>
                <Pagination.Item active>{this.state.page + 1}</Pagination.Item>
                <Pagination.Item onClick={() => this.setState({ page: this.state.page + 1 })} disabled={this.state.page + 1 > this.state.pageCount}>{this.state.page + 2}</Pagination.Item>
                <Pagination.Ellipsis />
                <Pagination.Next onClick={() => this.setState({ page: this.state.page + 1 })} disabled={this.state.page + 1 > this.state.pageCount} />
                <Pagination.Last onClick={() => this.setState({ page: this.state.pageCount })} disabled={this.state.page === this.state.pageCount} />
            </Pagination>
        );
    }

    getModalBody(): JSX.Element {
        return (
            <Modal.Body>
                <strong>Count: </strong> {this.state.selectedItems.length} <br />
                <strong>Items: </strong> {this.state.selectedItems.map(item => item._id).join(", ")}
            </Modal.Body>
        );
    }

    getDeleteModal(): JSX.Element {
        return (
            <Modal show={this.state.showDeleteModal} onHide={() => this.setState({ showDeleteModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete these {this.typeName}s?</Modal.Title>
                </Modal.Header>
                {this.getModalBody()}
                <Modal.Footer>
                    <Button variant="danger" onClick={() => this.handleDeleteConfirm()}>Yes</Button>
                    <Button variant="secondary" onClick={() => this.setState({ showDeleteModal: false })}>No</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    getConfirmModal(): JSX.Element {
        return (
            <Modal show={this.state.showConfirmModal} onHide={() => this.setState({ showConfirmModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.typeName}s successfully deleted!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Response: </strong> {this.state.confirmResponse}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({ showConfirmModal: false })}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    getTableHeader(): JSX.Element {
        return (
            <thead>
                <tr>
                    <th>#</th>
                    <th><Form.Check type="checkbox" onChange={(event: any) => this.setState({ list: this.state.list.map(item => { item.selected = event.target.checked; return item; }) })} /></th>
                    <th>JSON</th>
                </tr>
            </thead>
        );
    }

    getTableRowItem(item: any): string {
        const purgedItem: any = {};
        this.fieldNames.forEach(fieldName => {
            if (fieldName !== "_id" && fieldName !== "selected")
                purgedItem[fieldName] = item[fieldName];
        });

        return JSON.stringify(purgedItem, null, 0);
    }

    getTableBody(): JSX.Element {
        return (
            <tbody>
                {this.state.list.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{this.state.page * (parseInt(localStorage.getItem('pagelength') || "15")) + index}</td>
                            <td><Form.Check type="checkbox" checked={item.selected} onChange={(event: any) => this.setState({ list: this.state.list.map(listItem => { if (listItem._id === item._id) { listItem.selected = event.target.checked; } return listItem; }) })} /></td>
                            <td><pre>{this.getTableRowItem(item)}</pre></td>
                        </tr>
                    );
                })}
            </tbody>
        );
    }

    getTable(): JSX.Element {
        return (
            <Table striped bordered hover responsive>
                {this.getTableHeader()}
                {this.getTableBody()}
            </Table>
        );
    }

    getDeletButton(): JSX.Element {
        return (
            <Button variant="danger" onClick={() => this.handleDeleteButton()}>Delete</Button>
        );
    }

    render() {
        const list = this.state.list;
        const fieldNames = this.fieldNames;
        const typeName = this.typeName;
        const page = this.state.page;
        const pageCount = this.state.pageCount;
        const validGoToPage = this.state.validGoToPage;
        const showDeleteModal = this.state.showDeleteModal;
        const navigate = this.state.navigate;

        return (
            <Fragment>
                {navigate}
                {this.getDeleteModal()}
                {this.getConfirmModal()}
                {this.getTable()}
                <Row>
                    <Col>
                        {this.getPagination()}
                    </Col>
                    <Col>
                        {this.getDeletButton()}
                    </Col>
                    <Col>
                        <Button variant="secondary" onClick={() => this.navigate("/home?type=" + this.typeNumber)}>Go Back</Button>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default BulkDeletorTemplate;
