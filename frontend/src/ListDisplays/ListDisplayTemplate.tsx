import React, { Fragment } from "react";
import { Table, Button, Col, Form, InputGroup, Pagination, Row, Modal } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
// import { withRouter } from "react-router-dom";



interface ListDisplayTemplateState {
    list: any[];
    page: number;
    pageCount: number;
    validGoToPage: boolean;
    showAlert: boolean;
    tempItem: any;
    navigate: any;
}

abstract class ListDisplayTemplate extends React.Component<{}, ListDisplayTemplateState> {

    abstract fieldNames: string[];
    abstract typeNumber: number;
    abstract typeName: string;
    searchParams = new URLSearchParams(window.location.search);

    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            page: parseInt(this.searchParams.get("page") || "0"),
            pageCount: 0,
            validGoToPage: true,
            showAlert: false,
            tempItem: {},
            navigate: <Fragment />
        };
        this.handleGoToPage = this.handleGoToPage.bind(this);
    }

    navigate(url: string) {
        this.setState({ navigate: <Navigate to={url} /> });
    }

    componentDidMount() {
        this.fetchPageCount();
        this.fetchList();
    }

    setSearchParams(page: number, type: number) {
        this.searchParams.has("page") ? this.searchParams.set("page", page.toString()) : this.searchParams.append("page", page.toString());
        this.searchParams.has("type") ? this.searchParams.set("type", type.toString()) : this.searchParams.append("type", type.toString());
        window.history.pushState({}, "", "?" + this.searchParams.toString());
    }


    fetchList() {
        fetch(this.getFetchUrl())
            .then(async response => {
                const data: any[] = await response.json() as any[];
                const fetchOwnerNamePromises = data.map((item: any) => {
                    return item.ownerid === null ? "" :
                    fetch(this.getOwnerNameUrl(item.ownerid))
                        .then(response => response.json())
                        .then(data => {
                            item.ownername = data.username;
                        });
                });
                Promise.all(fetchOwnerNamePromises).then(() => {
                    this.setState({ list: data });
                    const page = this.state.page;
                    const type = this.typeNumber;
                    this.setSearchParams(page, type);
                });
            })
    }

    fetchPageCount() {
        fetch(this.getFetchPageCountUrl())
            .then(async (response) => {
                const data: number = await response.json();
                // console.log(data);
                // const data: number = parseInt(response.json() as any);
                // console.log(response.json());
                // console.log(response.text());

                this.setState({ pageCount: data - 1 });
            });
    }

    abstract getFetchUrl(): string;

    abstract getFetchPageCountUrl(): string;

    abstract getDeleteItemUrl(): string;

    abstract getOwnerNameUrl(ownerId: number): string;

    getTableHeaderList(): string[] {
        var headers: string[] = ["#"];

        this.fieldNames.forEach((fieldName: string) => {
            // Capitalize first letter of each word
            headers.push(fieldName.charAt(0).toUpperCase() + fieldName.slice(1));
        });

        headers.push("Actions");
        headers.push("By");

        return headers;
    }

    checkEditEligibility(boxOwnerId: number): boolean {
        const role = localStorage.getItem("role");
        const userId = localStorage.getItem("userid");

        if (role === "admin" || role === "moderator") {
            return true;
        }
        
        if (boxOwnerId === null) {
            return false;
        }
        
        if (userId === boxOwnerId.toString()) {
            return true;
        }
        return false;
    }

    handleDeleteButton(itemId: number) {
        this.setState({ showAlert: true, tempItem: this.state.list.find((item: any) => item._id === itemId) });
    }

    deleteItem() {
        const sessionToken = localStorage.getItem("sessiontoken") as string;

        this.setState({ showAlert: false })

        fetch(this.getDeleteItemUrl(), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "sessiontoken": sessionToken
            }
        })
            .then(response => {
                console.log(response.text());
                this.fetchList();
            });
    }

    handleGoToPage(event: any) {
        event.preventDefault();
        const page = event.target.elements[0].value;
        console.log(this.state.pageCount);
        if (page > 0 && page <= this.state.pageCount) {
            // setPage(page - 1);
            this.setState({ page: page - 1 });
            // setValidGoToPage(true);
            this.setState({ validGoToPage: true });
        } else {
            // setValidGoToPage(false);
            this.setState({ validGoToPage: false });
        }
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<ListDisplayTemplateState>, snapshot?: any): void {
        if (prevState.page !== this.state.page || prevState.showAlert !== this.state.showAlert) {
            this.fetchList();
            console.log("Page changed or alert changed");
        }
    }

    getTable(): JSX.Element {
        return (
            <Table striped bordered hover variant="dark" className="element-list" id={this.typeName + "-list"} align="center" responsive>
                <thead>
                    <tr>
                        {this.getTableHeaderList().map((header: string) => {
                            return <th>{header}</th>
                        }
                        )}
                    </tr>
                </thead>
                <tbody>
                    {this.state.list.map((item: any, index: number) => (
                        <tr key={item._id}>
                            <td>{this.state.page * (parseInt(localStorage.getItem('pagelength') || "15")) + index}</td>
                            {this.fieldNames.map((fieldName: string) => {
                                return <td>{item[fieldName]}</td>
                            })}
                            <td>{
                                this.checkEditEligibility(item.ownerid) ?
                                    <Fragment>
                                        <Button variant="info" onClick={() => this.navigate(`/${this.typeName}?id=` + item._id)}>Edit</Button>
                                        <Button variant="danger" onClick={() => this.handleDeleteButton(item._id)}>Delete</Button>
                                    </Fragment>
                                    :
                                    <Button variant="white" disabled={true}>None</Button>

                            }</td>
                            <td> <a href={"/profile?id=" + item.ownerid}>{item.ownername}</a></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
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

    getGoToPage(): JSX.Element {
        return (
            <Form noValidate onSubmit={this.handleGoToPage} >
                <InputGroup className="mb-3" >
                    <Form.Control type="number" placeholder="Go to page" min={1} max={this.state.pageCount - 1} />
                    <Button variant="primary" type="submit">Go</Button>
                </InputGroup>
                <Form.Text className="text-muted">
                    {this.state.validGoToPage ? "" : "Invalid page number"}
                </Form.Text>

            </Form>
        );
    }

    getAddItemButton(): JSX.Element {
        if (localStorage.getItem("sessiontoken") === null) {
            return <Fragment></Fragment>;
        }
        return (
            <Button variant="secondary" onClick={() => this.navigate(`/${this.typeName}`)}><strong>+</strong></Button>
        );
    }

    getModalBody(): JSX.Element {
        return (
            <Modal.Body>
                {
                    this.fieldNames.map((fieldName: string) => {
                        const tempItem = this.state.tempItem;
                        return (
                            <Fragment>
                                <strong>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: </strong> {tempItem[fieldName]} <br />
                            </Fragment>
                        );
                    })
                }
            </Modal.Body>
        );
    }

    getDeleteModal(): JSX.Element {
        return (
            <Modal show={this.state.showAlert} onHide={() => this.setState({ showAlert: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete this {this.typeName}?</Modal.Title>
                </Modal.Header>
                {this.getModalBody()}
                <Modal.Footer>
                    <Button variant="danger" onClick={() => this.deleteItem()}>Yes</Button>
                    <Button variant="secondary" onClick={() => this.setState({ showAlert: false })}>No</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render(): React.ReactNode {
        const {
            list,
            page,
            pageCount,
            validGoToPage,
            showAlert,
            tempItem,
            navigate
        } = this.state;

        return (
            <Fragment>
                {this.getTable()}
                <Row>
                    <Col>
                        {this.getPagination()}
                    </Col>
                    <Col>
                        {this.getAddItemButton()}
                    </Col>
                    <Col xs={2}>
                        {this.getGoToPage()}
                    </Col>
                </Row>
                {this.getDeleteModal()}
                {this.state.navigate}
            </Fragment>
        );
    }
}

export default ListDisplayTemplate;