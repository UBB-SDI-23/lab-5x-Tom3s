import { Fragment, useEffect, useState } from "react";
import { Button, Pagination, Table, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { apiAccess } from "./models/endpoints";
import BoxList from "./ListDisplays/Boxes";
import WrapperList from "./ListDisplays/Wrappers";

const App = () => {
    const [list, setList] = useState(<BoxList />);
    return (
        <Fragment>
            <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                <ToggleButton variant="outline-secondary" id="tbg-radio-1" value={1} onClick={() => setList(<BoxList />)}>Boxes</ToggleButton>
                <ToggleButton variant="outline-secondary" id="tbg-radio-2" value={2} onClick={() => setList(<WrapperList />)}>Wrappers</ToggleButton>
            </ToggleButtonGroup>
            {list}
        </Fragment>
    );
};

export default App;
