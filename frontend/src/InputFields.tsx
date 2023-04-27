import './InputFields.css'
import { apiAccess } from './models/endpoints';
// const [inputBoxWidth]

const InputFields = () => {

    function addBoxButtonClicked() {
        const width = document.getElementById("input-box-width") as HTMLTextAreaElement;
        const length = document.getElementById("input-box-length") as HTMLTextAreaElement;
        const height = document.getElementById("input-box-height") as HTMLTextAreaElement;
        const material = document.getElementById("input-box-material") as HTMLTextAreaElement;
        const color = document.getElementById("input-box-color") as HTMLTextAreaElement;
        // const id = document.getElementById("input-field-id") as HTMLTextAreaElement;
        const box = {
            // _id: id.innerHTML,
            width: width.value,
            length: length.value,
            height: height.value,
            material: material.value,
            color: color.value
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(box)
        };

        fetch(new apiAccess().boxes().url, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById("refresh-button")!.click();
            });
    }

    function updateButtonClicked() {
        const width = document.getElementById("input-box-width") as HTMLTextAreaElement;
        const length = document.getElementById("input-box-length") as HTMLTextAreaElement;
        const height = document.getElementById("input-box-height") as HTMLTextAreaElement;
        const material = document.getElementById("input-box-material") as HTMLTextAreaElement;
        const color = document.getElementById("input-box-color") as HTMLTextAreaElement;
        const id = document.getElementById("input-field-id") as HTMLTextAreaElement;
        const box = {
            // _id: id.innerHTML,
            width: width.value,
            length: length.value,
            height: height.value,
            material: material.value,
            color: color.value
        }

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(box)
        };

        fetch(new apiAccess().boxes().id(id.innerHTML).url, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById("refresh-button")!.click();
            });
    }

    function deleteButtonClicked() {
        if (window.confirm("Are you sure you want to delete this box?") === false) {
            return;
        }
        const id = document.getElementById("input-field-id") as HTMLTextAreaElement;
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };

        fetch(new apiAccess().boxes().id(id.innerHTML).url, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById("refresh-button")!.click();
            });
    }

    return (
        <div className="input-fields">
            <h2 className="input-field-name">Box Details</h2>
            <div className="text-fields">
                ID: <i id="input-field-id"></i>
                Width <textarea className="input-field" name="width" id="input-box-width" cols={30} rows={1} defaultValue={10} placeholder={"Width"}/>
                Length <textarea className="input-field" name="length" id="input-box-length" cols={30} rows={1} defaultValue={10} placeholder={"Length"} />
                Height <textarea className="input-field" name="height" id="input-box-height" cols={30} rows={1} defaultValue={10} placeholder={"Height"}/>
                Material <textarea className="input-field" name="material" id="input-box-material" cols={30} rows={1} placeholder={"Material"}/>
                Color <textarea className="input-field" name="color" id="input-box-color" cols={30} rows={1} placeholder={"Color"}/>
            </div>
            <div className="field-buttons">
                <button className="field-button" id="add-box-button" onClick={addBoxButtonClicked}>Create New</button>
                <button className="field-button" id="update-box-button" onClick={updateButtonClicked} >Update</button>
                <button className="field-button" id="delete-box-button" onClick={deleteButtonClicked} >Delete</button>
            </div>
        </div>        
    )
}

export default InputFields;