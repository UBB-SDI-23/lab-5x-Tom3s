import { Fragment, useState } from "react";
import DisplayBoxes from "./ListDisplays/Boxes";
import DisplayWrappers from "./ListDisplays/Wrappers";
import "./Button.css";
import "./App.css";
import InputFields from "./InputFields";
import DisplayFilteredBoxes from "./ListDisplays/FilteredBoxes";

const App = () => {
    
    const [list, setList] = useState<JSX.Element>(<DisplayBoxes />);
    // const [inputFields, setInputFields] = useState<JSX.Element>(<InputFields />);
    const [inputFields] = useState<JSX.Element>(<InputFields />);
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

    function refreshButtonClicked() {
        console.log("refresh button clicked");
        setList(<Fragment></Fragment>);
        setTimeout(() => {
            if (title === "Box List") {
                setList(<DisplayBoxes />);
            } else {
                setList(<DisplayWrappers />);
            }
        }, 1);
    }

    function filterButtonClicked() {
        setList(<Fragment></Fragment>);
        setTimeout(() => {
            setList(<DisplayFilteredBoxes />);
        }, 1);
    }

    return (
        <Fragment>
            <div className="button-row">
                <button className="list-button" onClick={boxButtonClicked}>Boxes</button>
                <button className="list-button" onClick={wrapperButtonClicked}>Wrappers</button>
            </div>
            <div className="display-list-title">
                <h1>{title}</h1>
                <button id="refresh-button" className="refresh-button" onClick={refreshButtonClicked}>Refresh</button>
                {title === "Box List" && 
                <div className="filter-div">
                    <textarea id="filter-textarea" placeholder="Filter" cols={20} rows={1}></textarea>
                    <button id="filter-button" className="refresh-button" onClick={filterButtonClicked}>Filter</button>
                </div>
                }
            </div>
            <div className="main-content">
            {list}
            {title === "Box List" && inputFields}
            </div>
        </Fragment>
    );
};

export default App;
