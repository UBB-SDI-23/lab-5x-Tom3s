import { Fragment, useState } from "react";
import DisplayBoxes from "./ListDisplays/Boxes";
import DisplayWrappers from "./ListDisplays/Wrappers";
import "./Button.css";
import "./App.css";
import InputFields from "./InputFields";

const App = () => {
    
    const [list, setList] = useState<JSX.Element>(<DisplayBoxes />);
    const [inputFields, setInputFields] = useState<JSX.Element>(<InputFields />);
    const [title, setTitle] = useState<string>("Box List");
    // setList(<DisplayBoxes />);

    function boxButtonClicked() {
        setList(<DisplayBoxes />);
        setTitle("Box List");
    }
    
    function wrapperButtonClicked() {
        setList(<DisplayWrappers />);
        setTitle("Wrapper List");
    }

    return (
        <Fragment>
            <div className="button-row">
                <button className="list-button" onClick={boxButtonClicked}>Boxes</button>
                <button className="list-button" onClick={wrapperButtonClicked}>Wrappers</button>
            </div>
            <h1 className="display-list-title">{title}</h1>
            <div className="main-content">
            {list}
            {inputFields}
            </div>
        </Fragment>
    );
};

export default App;
