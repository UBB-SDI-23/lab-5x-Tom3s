import { apiAccess } from "../models/endpoints";
import { Box, Supplier, Wrapper, WrapperBoxCombo } from "../models/entities";
import './ListElement.css'
import { Fragment } from "react";


function getElementSpecificDetails(entity: Box | Wrapper | Supplier | WrapperBoxCombo): JSX.Element {
    if ((entity as Box).height !== undefined)
    {
        // console.log("Entity is a box");
        entity = entity as Box;
        return (
            <Fragment>
                <h2 className="list-element-detail"><b>Size: </b>{entity.length} x {entity.width} x {entity.height}</h2>
                {/* <hr></hr> */}
                <h2 className="list-element-detail"><b>Material: </b>{entity.material}</h2>
                {/* <hr></hr> */}
                <h2 className="list-element-detail"><b>Color: </b>{entity.color}</h2>
            </Fragment>
        );
    } else if ((entity as Wrapper).pattern !== undefined){
        // console.log("Entity is a wrapper");
        entity = entity as Wrapper;
        return (
            <Fragment>
                <h2 className="list-element-detail"><b>Size: </b>{entity.length} x {entity.width}</h2>
                {/* <hr></hr> */}
                <h2 className="list-element-detail"><b>Pattern: </b>{entity.pattern}</h2>
                {/* <hr></hr> */}
                <h2 className="list-element-detail"><b>Color: </b>{entity.color}/{entity.complementaryColor}</h2>
            </Fragment>
        );
    } else if ((entity as Supplier).address !== undefined){
        entity = entity as Supplier;
        return (
            <Fragment>
                <h2 className="list-element-detail"><b>Name: </b>{entity.name}</h2>
                {/* <hr></hr> */}
                <h2 className="list-element-detail"><b>Address: </b>{entity.address}</h2>
                {/* <hr></hr> */}
                <h2 className="list-element-detail"><b>Phone: </b>{entity.phone}</h2>
                {/* <hr></hr> */}
                <h2 className="list-element-detail"><b>Email: </b>{entity.email}</h2>
            </Fragment>
        );
    } else if ((entity as WrapperBoxCombo).wrapperId !== undefined){
        entity = entity as WrapperBoxCombo;
        return (
            <Fragment>
                <h2 className="list-element-detail"><b>Wrapper: </b>{entity.wrapperId}</h2>
                {/* <hr></hr> */}
                <h2 className="list-element-detail"><b>Box: </b>{entity.boxId}</h2>
                {/* <hr></hr> */}
                <h2 className="list-element-detail"><b>Name: </b>{entity.name}</h2>
                {/* <hr></hr> */}
                <h2 className="list-element-detail"><b>Price: </b>{entity.price}</h2>
            </Fragment>
        );
    }
    return <Fragment></Fragment>;
}


function listElementFromEnity(entity: Box | Wrapper | Supplier | WrapperBoxCombo, url: string = ""): JSX.Element {
    var buttons: JSX.Element = <Fragment></Fragment>;

    function editButtonClicked(id: string){
        console.log("Edit button clicked");

        document.getElementById("input-field-id")!.innerHTML = id;
        document.getElementById("input-box-width")!.innerHTML = (entity as Box).width.toString();
        document.getElementById("input-box-length")!.innerHTML = (entity as Box).length.toString();
        document.getElementById("input-box-height")!.innerHTML = (entity as Box).height.toString();
        document.getElementById("input-box-material")!.innerHTML = (entity as Box).material;
        document.getElementById("input-box-color")!.innerHTML = (entity as Box).color;

        console.log(entity);
    }

    function deleteButtonClicked(id: string) {
        if (window.confirm("Are you sure you want to delete this box?") === false) {
            return;
        }
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };


        fetch(new apiAccess().boxes().id(id).url, requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }


    if (url !== ""){
        buttons = <Fragment>
            <button className="list-element-edit" onClick={() => editButtonClicked(entity._id)}>Edit</button>
            <button className="list-element-delete" onClick={() => deleteButtonClicked(entity._id)}>Delete</button>
        </Fragment>;
    }
    console.log(url);
    return (
        <div className="list-element">
            <div className="list-element-top">
                <h1 className="list-element-id"><b>ID: </b>{entity._id}</h1>
                {/* <hr></hr> */}
                {buttons}
            </div>
            {/* <hr></hr> */}
            <div className="list-element-bottom">
                {getElementSpecificDetails(entity)}
            </div>
        </div>
    );
}

export default listElementFromEnity;