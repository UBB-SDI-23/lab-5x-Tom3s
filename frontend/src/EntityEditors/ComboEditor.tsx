import { Fragment, useEffect, useState } from "react";
import { Badge, Button, Col, Form, InputGroup, Row, Toast, ToastContainer } from "react-bootstrap";
import { apiAccess } from "../models/endpoints";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserDetailsOffCanvas from "../Elements/userDetails";

const ComboEditor = () => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const comboId = searchParams.get("id") || "";

    const [boxId, setBoxId] = useState(0);
    const [wrapperId, setWrapperId] = useState(0);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);

    const [toasts, setToasts] = useState([]); // [{type: "success", message: "Box created successfully"}

    const onChangeBoxId = (event: any) => { setBoxId(parseFloat(event.target.value)); };
    const onChangeWrapperId = (event: any) => { setWrapperId(parseFloat(event.target.value)); };
    const onChangeName = (event: any) => { setName(event.target.value); };
    const onChangePrice = (event: any) => { setPrice(parseFloat(event.target.value)); };

    useEffect(() => {
        if (comboId !== "") {
            fetch(new apiAccess().combos().id(comboId).url)
                .then(response => response.json())
                .then(data => {
                    setBoxId(data.box._id);
                    setWrapperId(data.wrapper._id);
                    setName(data.name);
                    setPrice(data.price);
                });
        }
    }, []);

    function validatePrice() {
        if (price <= 0 && !isNaN(price)) {
            return "Price";
        }
        return "";
    }

    function validateIds() {
        var invalidIds = "";
        if (boxId <= 0 && !isNaN(boxId)) {
            invalidIds += "Box ID ";        
        }
        if (wrapperId <= 0 && !isNaN(wrapperId)) {
            if (invalidIds !== "")
                invalidIds += ", ";
            invalidIds += "Wrapper ID ";
        }
        return invalidIds;
    }

    function checkEmptyFields() {
        var emptyFields = "";
        if (isNaN(wrapperId)) {
            emptyFields += "Wrapper ID ";
        }
        if (isNaN(boxId)) {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Box ID ";
        }
        if (name === "") {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Name ";
        }
        if (isNaN(price)) {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Price ";
        }
        return emptyFields;
    }

    function handleSubmit(event: any) {
        event.preventDefault();

        var toastType = "Success";
        var toastMessage = "";
        var toastDuration = 5000;
        var toastId = toasts.length;
        var toastVisible = true;

        var invalidIds = validateIds();
        var invalidPrice = validatePrice();
        var emptyFields = checkEmptyFields();

        if (invalidIds !== "") {
            toastType = "Warning";
            toastMessage = "Invalid " + invalidIds + " Ids!";
            toastDuration = 10000;
        } else if (invalidPrice !== "") {
            toastType = "Warning";
            toastMessage = "Invalid " + invalidPrice + "!";
            toastDuration = 10000;
        } else if (emptyFields !== "") {
            toastType = "Info";
            toastMessage = emptyFields + "cannot be empty";
            toastDuration = 10000;
        } else if (emptyFields == "") {
            if (comboId !== "") {
                toastMessage = "Combo edited successfully";
            } else {
                toastMessage = "Combo created successfully";
            }
        }

        const combo = {
            "boxid": boxId,
            "wrapperid": wrapperId,
            "name": name,
            "price": price
        };
        // console.log(combo);

        const toast = {
            "type": toastType,
            "message": toastMessage,
            "duration": toastDuration,
            "id": toastId,
            "visible": toastVisible
        };

        setToasts([...toasts, toast] as any);

        if (toastType !== "Success") {
            return;
        }

        if (comboId !== "") {
            fetch(new apiAccess().combos().id(comboId).url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(combo)
            })
                .then(response => response.json())
                .then(data => console.log("updated: " + JSON.stringify(data)));
        } else {
            fetch(new apiAccess().combos().url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(combo)
            })
                .then(response => response.json())
                .then(data => console.log("Created" + JSON.stringify(data)));
        }
    };

    return (
        <Fragment>
            <UserDetailsOffCanvas />
            {
                comboId !== "" && 
                <h1>Editing Wrapper-Box Combo with<Badge bg="secondary">ID: {comboId}</Badge> </h1>
            }
            {
                comboId === "" &&
                <h1>Create a new Wrapper-Box Combo</h1>
            }
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridBoxId">
                        <Form.Label>Box ID</Form.Label>
                        <Form.Control type="number" placeholder="Enter box ID" onChange={onChangeBoxId} value={boxId} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridWrapperId">
                        <Form.Label>Wrapper ID</Form.Label>
                        <Form.Control type="number" placeholder="Enter wrapper ID" onChange={onChangeWrapperId} value={wrapperId} />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" onChange={onChangeName} defaultValue={name} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPrice">
                        <Form.Label>Price</Form.Label>
                        <InputGroup>
                            <Form.Control type="number" placeholder="Enter price" onChange={onChangePrice} value={String(price)} />
                            <InputGroup.Text>$</InputGroup.Text>
                            <InputGroup.Text>0.00</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </Row>

                <Button variant="primary" type="submit">
                    {
                        (comboId !== "" &&
                        "Edit combo")
                        ||
                        (comboId === "" &&
                        "Create combo")
                    }
                </Button>
                <Button variant="primary" type="button" onClick={() => navigate("/home?type=4")}>
                    Go Back
                </Button>
            </Form>

            <ToastContainer position="bottom-end" className="p-3">
                {toasts.map((toast: any) => (
                    <Toast
                        key={toast.id}
                        onClose={() => setToasts(toasts.map((t: any) => t.id === toast.id ? { ...t, visible: false } : t) as any)}
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
        </Fragment>
    );
};

export default ComboEditor;
