import { Fragment } from "react";
import { Navigate } from "react-router-dom";
import UserDetailsOffCanvas from "../Elements/userDetails";
import React from "react";
import { Badge, Button, Col, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { render } from "react-dom";

interface ItemEditorState {
    tempItem: any;
    toasts: any[];
    navigate: JSX.Element;
}

abstract class ItemEditor extends React.Component<{}, ItemEditorState> {

    abstract input1stRow: any[];
    abstract input2ndRow: any[];
    abstract input3rdRow: any[];
    abstract itemType: string;
    abstract typeNumber: number;
    itemid: string;
    searchParams = new URLSearchParams(window.location.search);

    constructor(props: any) {
        super(props);
        this.state = {
            tempItem: {},
            toasts: [],
            navigate: <Fragment />
        };
        this.itemid = this.searchParams.get("id") || "";
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    navigate(url: string) {
        this.setState({ navigate: <Navigate to={url} /> });
    }

    componentDidMount() {
        if (this.itemid !== "") {
            this.fetchTempItem();
        }
    }

    fetchTempItem() {
        fetch(this.getFetchItemUrl())
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({ tempItem: data });
            });
    }

    abstract getFetchItemUrl(): string;

    handleSubmit(event: any) {
        event.preventDefault();

        // concatanate all inputs into one array
        const allInputs = [...this.input1stRow, ...this.input2ndRow, ...this.input3rdRow];

        const formData = new FormData(event.target);

        var itemToSubmit: any = {};
        allInputs.forEach((input: any) => {
            itemToSubmit[input.name] = formData.get(input.name);
        });

        fetch(this.getSubmitUrl(), this.getSubmitOptions(itemToSubmit))
            .then(async (response) => {
                console.log(response);
                var toast = {
                    type: "Success",
                    message: await response.text(),
                    duration: 5000,
                    visible: true,
                    id: this.state.toasts.length !== 0 ? (this.state.toasts.at(-1).id + 1) : 0
                };
                if (response.status === 400) {
                    toast.type = "Warning";
                    toast.duration = 10000;
                }
                this.setState({ toasts: [...this.state.toasts, toast] });
            });
    }


    abstract getSubmitUrl(): string;
    abstract getSubmitOptions(item: any): any;

    getTitleElement() {
        return (
            <Fragment>
                {
                    this.itemid !== "" &&
                    <h1>Editing {this.itemType} with<Badge bg="secondary">ID: {this.itemid}</Badge> </h1>
                }
                {
                    this.itemid === "" &&
                    <h1>Create a new {this.itemType}</h1>
                }
            </Fragment>
        )
    }

    getFormButtons() {
        return (
            <Fragment>
                <Button variant="primary" type="submit">
                    {
                        (this.itemid === "" ? "Create" : "Edit") + " " + this.itemType
                    }
                </Button>
                <Button variant="primary" type="button" onClick={() => this.navigate("/home?type=" + this.typeNumber)}>
                    Go Back
                </Button>
            </Fragment>
        )
    }

    capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getFormRow(inputRow: string[]) {
        return (
            <Fragment>
                {
                    inputRow.map((input: any, index) => (
                        <Form.Group as={Col} controlId={"formGrid" + this.capitalizeFirstLetter(input.name)} >
                            <Form.Label>{this.capitalizeFirstLetter(input.name)}</Form.Label>
                            <Form.Control
                                type={input.type}
                                placeholder={"Enter " + input.name}
                                value={this.state.tempItem[input.name]}
                                name={input.name}
                                onChange={(event) => {
                                    const { name, value } = event.target;
                                    this.setState((prevState) => ({
                                        tempItem: {
                                            ...prevState.tempItem,
                                            [name]: value
                                        }
                                    }));
                                }}
                            />
                        </Form.Group>

                    ))
                }
            </Fragment>
        )
    }

    get1stRow() {
        return this.getFormRow(this.input1stRow);
    }

    get2ndRow() {
        return this.getFormRow(this.input2ndRow);
    }

    get3rdRow() {
        return this.getFormRow(this.input3rdRow);
    }


    getFormElement() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row className="mb-3">
                    {this.get1stRow()}
                </Row>
                <Row className="mb-3">
                    {this.get2ndRow()}
                </Row>
                <Row className="mb-3">
                    {this.get3rdRow()}
                </Row>
                {this.getFormButtons()}
            </Form>
        )
    }

    getToastContainer() {
        return (
            <ToastContainer position="bottom-end" className="p-3">
                {this.state.toasts.map((toast: any) => (
                    <Toast
                        key={toast.id}
                        onClose={() => {
                            this.setState({
                                toasts: this.state.toasts.map((t: any) => t.id === toast.id ? { ...t, visible: false } : t) as any
                            })
                        }}
                        show={toast.visible}
                        delay={toast.duration}
                        bg={toast.type.toLowerCase()}
                        animation={true}
                        autohide>
                        <Toast.Header>
                            <strong className="me-auto">{toast.type}</strong>
                        </Toast.Header>
                        <Toast.Body>{toast.message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        )
    }

    render() {
        return (
            <Fragment>
                {this.state.navigate}
                {this.getTitleElement()}
                {this.getFormElement()}
                {this.getToastContainer()}
            </Fragment>
        )
    }
}

export default ItemEditor;