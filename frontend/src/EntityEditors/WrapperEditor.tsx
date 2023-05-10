import { Fragment, useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { ToastDetails } from "../models/entities";
import { apiAccess } from "../models/endpoints";
import { useNavigate, useSearchParams } from "react-router-dom";


const WrapperEditor = () => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const wrapperId = searchParams.get("id") || "";

    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [color, setColor] = useState("");
    const [complementaryColor, setComplementaryColor] = useState("");
    const [pattern, setPattern] = useState("");
    const [toasts, setToasts] = useState([]); 

    const onChangeLength = (event: any) => { setLength(parseFloat(event.target.value)); };
    const onChangeWidth = (event: any) => { setWidth(parseFloat(event.target.value)); };
    const onChangeColor = (event: any) => { setColor(event.target.value); };
    const onChangeComplementaryColor = (event: any) => { setComplementaryColor(event.target.value); };
    const onChangePattern = (event: any) => { setPattern(event.target.value); };

    useEffect(() => {
        if (wrapperId !== "") {
            fetch(new apiAccess().wrappers().id(wrapperId).url)
                .then(response => response.json())
                .then(data => {
                    setLength(data.length);
                    setWidth(data.width);
                    setColor(data.color);
                    setComplementaryColor(data.complementarycolor);
                    setPattern(data.pattern);
                });
        }
    }, []);

    function validateDimensions() {
        var invalidDimensions = "";
        if (length <= 0 && !isNaN(length)) {
            invalidDimensions += "Length ";
        }
        if (width <= 0 && !isNaN(width)) {
            if (invalidDimensions !== "")
                invalidDimensions += ", ";
            invalidDimensions += "Width ";
        }
        return invalidDimensions;
    }

    function checkEmptyFields() {
        var emptyFields = "";
        if (isNaN(length)) {
            emptyFields += "Length ";
        }
        if (isNaN(width)) {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Width ";
        }
        if (color === "") {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Color ";
        }
        if (complementaryColor === "") {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Complementary color ";
        }
        if (pattern === "") {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Pattern ";
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

        const invalidDimensions = validateDimensions();
        const emptyFields = checkEmptyFields();
        if (invalidDimensions !== "") {
            toastType = "Warning";
            toastMessage = invalidDimensions + "must be greater than 0";
            toastDuration = 10000;
        } else if (emptyFields !== "") {
            toastType = "Info";
            toastMessage = emptyFields + "cannot be empty";
            toastDuration = 10000;
        } else {
            if (wrapperId !== "") {
                toastMessage = "Wrapper edited successfully";
            } else {
                toastMessage = "Wrapper created successfully";
            }
        }

        const wrapper = {
            "length": length,
            "width": width,
            "color": color,
            "complementarycolor": complementaryColor,
            "pattern": pattern
        };
        console.log(wrapper);

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

        if (wrapperId !== "") {
            fetch(new apiAccess().wrappers().id(wrapperId).url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(wrapper)
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } else {
            fetch(new apiAccess().wrappers().url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(wrapper)
            })
                .then(response => response.json())
                .then(data => console.log(data));
        }
    };




    return (
        <Fragment>
            {
                wrapperId !== "" && 
                <h1>Editing wrapper with<Badge bg="secondary">ID: {wrapperId}</Badge> </h1>
            }
            {
                wrapperId === "" &&
                <h1>Create a new wrapper</h1>
            }
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridLength">
                        <Form.Label>Length</Form.Label>
                        <Form.Control type="number" placeholder="Enter length" onChange={onChangeLength} value={length} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridWidth">
                        <Form.Label>Width</Form.Label>
                        <Form.Control type="number" placeholder="Enter width" onChange={onChangeWidth} value={width} />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridColor">
                        <Form.Label>Color</Form.Label>
                        <Form.Control type="text" placeholder="Enter color" onChange={onChangeColor} defaultValue={color} />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridComplementaryColor">
                        <Form.Label>Complementary color</Form.Label>
                        <Form.Control type="text" placeholder="Enter complementary color" onChange={onChangeComplementaryColor} defaultValue={complementaryColor} />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridPattern">
                        <Form.Label>Pattern</Form.Label>
                        <Form.Control type="text" placeholder="Enter pattern" onChange={onChangePattern} defaultValue={pattern} />
                    </Form.Group>
                </Row>


                <Button variant="primary" type="submit">
                    {
                        (wrapperId !== "" &&
                        "Edit wrapper")
                        ||
                        (wrapperId === "" &&
                        "Create wrapper")
                    }
                </Button>
                <Button variant="primary" type="button" onClick={() => navigate("/home?type=2")}>
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

export default WrapperEditor;