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
}

export default ProfileEditor;