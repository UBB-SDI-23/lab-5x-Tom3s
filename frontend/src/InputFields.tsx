import './InputFields.css'
const InputFields = () => {
    return (
        <div className="input-fields">
            <h2 className="input-field-name">Box Details</h2>
            <div className="text-fields">
            ID: <i id="input-field-id"></i>
                Width <textarea className="input-field" name="width" id="input-box-width" cols={30} rows={1} defaultValue={10}/>
                Length <textarea className="input-field" name="length" id="input-box-length" cols={30} rows={1} defaultValue={10}/>
                Height <textarea className="input-field" name="height" id="input-box-height" cols={30} rows={1} defaultValue={10}/>
                Material <textarea className="input-field" name="material" id="input-box-material" cols={30} rows={1} defaultValue="Cardboard"/>
                Color <textarea className="input-field" name="color" id="input-box-color" cols={30} rows={1} defaultValue="Brown"/>
            </div>
            <div className="field-buttons">
                <button className="field-button" id="add-box-button">Create New</button>
                <button className="field-button" id="update-box-button">Update</button>
                <button className="field-button" id="delete-box-button">Delete</button>
            </div>
        </div>        
    )
}

export default InputFields;