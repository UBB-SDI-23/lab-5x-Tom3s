import { Fragment, useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { ToastDetails } from "../models/entities";
import { apiAccess } from "../models/endpoints";


const BoxEditor = (boxId: string = "") => {

    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [color, setColor] = useState("");
    const [material, setMaterial] = useState("");
    const [toasts, setToasts] = useState([]); // [{type: "success", message: "Box created successfully"}

    const onChangeLength = (event: any) => { setLength(parseFloat(event.target.value)); };
    const onChangeWidth = (event: any) => { setWidth(parseFloat(event.target.value)); };
    const onChangeHeight = (event: any) => { setHeight(parseFloat(event.target.value)); };
    const onChangeColor = (event: any) => { setColor(event.target.value); };
    const onChangeMaterial = (event: any) => { setMaterial(event.target.value); };

    useEffect(() => {
        if (boxId !== "") {
            fetch(new apiAccess().boxes().id(boxId).url)
                .then(response => response.json())
                .then(data => {
                    setLength(data.length);
                    setWidth(data.width);
                    setHeight(data.height);
                    setColor(data.color);
                    setMaterial(data.material);
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
        if (height <= 0 && !isNaN(height)) {
            if (invalidDimensions !== "")
                invalidDimensions += ", ";
            invalidDimensions += "Height ";
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
        if (isNaN(height)) {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Height ";
        }
        if (color === "") {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Color ";
        }
        if (material === "") {
            if (emptyFields !== "")
                emptyFields += ", ";
            emptyFields += "Material ";
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
            if (boxId !== "") {
                toastMessage = "Box edited successfully";
            } else {
                toastMessage = "Box created successfully";
            }
        }

        const box = {
            "length": length,
            "width": width,
            "height": height,
            "color": color,
            "material": material
        };
        console.log(box);

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

        if (boxId !== "") {
            fetch(new apiAccess().boxes().id(boxId).url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(box)
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } else {
            fetch(new apiAccess().boxes().url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(box)
            })
                .then(response => response.json())
                .then(data => console.log(data));
        }
    };




    return (
        <Fragment>
            {
                boxId !== "" && 
                <h1>Editing box with<Badge bg="secondary">ID: {boxId}</Badge> </h1>
            }
            {
                boxId === "" &&
                <h1>Create a new box</h1>
            }
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridLength">
                        <Form.Label>Length</Form.Label>
                        <Form.Control type="number" placeholder="Enter length" onChange={onChangeLength} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridWidth">
                        <Form.Label>Width</Form.Label>
                        <Form.Control type="number" placeholder="Enter width" onChange={onChangeWidth} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridHeight">
                        <Form.Label>Height</Form.Label>
                        <Form.Control type="number" placeholder="Enter height" onChange={onChangeHeight} />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridColor">
                        <Form.Label>Color</Form.Label>
                        <Form.Control type="text" placeholder="Enter color" onChange={onChangeColor} />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridMaterial">
                        <Form.Label>Material</Form.Label>
                        <Form.Control type="text" placeholder="Enter material" onChange={onChangeMaterial} />
                    </Form.Group>
                </Row>

                <Button variant="primary" type="submit">
                    {
                        (boxId !== "" &&
                        "Edit box")
                        ||
                        (boxId === "" &&
                        "Create box")
                    }
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

export default BoxEditor;