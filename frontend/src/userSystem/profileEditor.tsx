import { Fragment } from "react";
import { Form, Col } from "react-bootstrap";
import ItemEditor from "../EntityEditors/ItemEditor";
import { apiAccess } from "../models/endpoints";

class ProfileEditor extends ItemEditor {
    input1stRow: any[] = [
        {
            name: "nickname",
            type: "text"
        },
        {
            name: "email",
            type: "email"
        }
    ];
    input2ndRow: any[] = [
        {
            name: "gender",
            type: "text"
        },
        {
            name: "eyecolor",
            type: "text"
        }
    ]
    input3rdRow: any[] = [
        {
            name: "birthday",
            type: "date"
        },
        {
            name: "pagelength",
            type: "number"
        }
    ]
    itemType: string = "profile";
    typeNumber: number = -1;
    getFetchItemUrl(): string {
        return new apiAccess().userWithoutLists(parseInt(this.itemid)).url;
    }
    getSubmitUrl(): string {
        return new apiAccess().users().id(this.itemid).url;
    }
    getSubmitOptions(item: any) {
        return {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "sessiontoken": localStorage.getItem("sessiontoken") || ""
            },
            body: JSON.stringify(item)
        };
    }
    componentDidMount() {
        if (this.itemid !== "") {
            this.fetchTempItem();
        } else {
            this.navigate("/home");
        }
    }

    fetchTempItem() {
        fetch(this.getFetchItemUrl())
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const oldDate = data.birthday;
                const newDate = oldDate.split("T")[0];
                data.birthday = newDate;
                this.setState({ tempItem: data });
            });
    }

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
                // console.log(response);
                var toast = {
                    type: "Success",
                    message: await response.text(),
                    duration: 5000,
                    visible: true,
                    id: this.state.toasts.length !== 0 ? (this.state.toasts.at(-1).id + 1) : 0
                };
                if (![200, 201].includes(response.status)) {
                    toast.type = "Warning";
                    toast.duration = 10000;
                } else {
                    localStorage.setItem("pagelength", itemToSubmit.pagelength);
                }
                this.setState({ toasts: [...this.state.toasts, toast] });
            });
    }
}

export default ProfileEditor;