import { Fragment, useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { ToastDetails } from "../models/entities";
import { apiAccess } from "../models/endpoints";
import { useNavigate, useSearchParams } from "react-router-dom";


const SupplierEditor = () => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const supplierId = searchParams.get("id") || "";

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [toasts, setToasts] = useState([]); 

    const onChangeName = (event: any) => { setName(event.target.value); };
    const onChangeAddress = (event: any) => { setAddress(event.target.value); };
    const onChangePhone = (event: any) => { setPhone(event.target.value); };
    const onChangeEmail = (event: any) => { setEmail(event.target.value); };

    useEffect(() => {
        if (supplierId !== "") {
            fetch(new apiAccess().suppliers().id(supplierId).url)
                .then(response => response.json())
                .then(data => {
                    setName(data.name);
                    setAddress(data.address);
                    setPhone(data.phone);
                    setEmail(data.email);
                });
        }
    }, []);

    function validatePhoneNumber(phoneNumber: string): boolean {
        const regex = /^07[0-9]{2}( |-)[0-9]{3}( |-)?[0-9]{3}$/;
        if (!phoneNumber) {
            return false;
        }
        return regex.test(phoneNumber);
    }

    function checkEmptyFields() {
        var emptyFields = "";
        if (name === "") {
            emptyFields += "Name ";
        }
        if (address === "") {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Address ";
        }
        if (phone === "") {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Phone ";
        }
        if (email === "") {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Email ";
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

        // const invalidDimensions = validateDimensions();

        const invalidPhoneNumber = validatePhoneNumber(phone) ? "" : "Phone number is invalid. (must be in format 07X XXX XXXX or 07X-XXX-XXXX)";

        const emptyFields = checkEmptyFields();
        if (invalidPhoneNumber !== "") {
            toastType = "Warning";
            toastMessage = invalidPhoneNumber;
            toastDuration = 10000;
        } else if (emptyFields !== "") {
            toastType = "Info";
            toastMessage = emptyFields + "cannot be empty";
            toastDuration = 10000;
        } else {
            if (supplierId !== "") {
                toastMessage = "Supplier edited successfully";
            } else {
                toastMessage = "Supplier created successfully";
            }
        }

        const supplier = {
            "name": name,
            "address": address,
            "phone": phone,
            "email": email
        };
        console.log(supplier);

        const toast: any = {
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

        if (supplierId !== "") {
            fetch(new apiAccess().suppliers().id(supplierId).url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(supplier)
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } else {
            fetch(new apiAccess().suppliers().url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(supplier)
            })
                .then(response => response.json())
                .then(data => console.log(data));
        }
    };




    return (
        <Fragment>
            {
                supplierId !== "" &&
                <h1>Editing supplier with<Badge bg="secondary">ID: {supplierId}</Badge> </h1>
            }
            {
                supplierId === "" &&
                <h1>Create a new supplier</h1>
            }
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    {/* <Form.Group as={Col} controlId="formGridLength">
                        <Form.Label>Length</Form.Label>
                        <Form.Control type="number" placeholder="Enter length" onChange={onChangeLength} value={length} />
                    </Form.Group> */}
                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" onChange={onChangeName} defaultValue={name} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" placeholder="Enter email" onChange={onChangeEmail} defaultValue={email} />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter address" onChange={onChangeAddress} defaultValue={address} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="text" placeholder="Enter phone" onChange={onChangePhone} defaultValue={phone} />
                    </Form.Group>

                </Row>

                <Button variant="primary" type="submit">
                    {
                        (supplierId !== "" &&
                            "Edit supplier")
                        ||
                        (supplierId === "" &&
                            "Create supplier")
                    }
                </Button>
                <Button variant="primary" type="button" onClick={() => navigate("/home")}>
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

export default SupplierEditor;