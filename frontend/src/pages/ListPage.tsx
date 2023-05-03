import { useState, Fragment } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import BoxList from "../ListDisplays/Boxes";
import ComboList from "../ListDisplays/Combos";
import SupplierList from "../ListDisplays/Suppliers";
import WrapperList from "../ListDisplays/Wrappers";

const ListPage = () => {
    const [list, setList] = useState(<BoxList />);
    return (
        <Fragment>
            <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                <ToggleButton variant="outline-secondary" id="tbg-radio-1" value={1} onClick={() => setList(<BoxList />)}>Boxes</ToggleButton>
                <ToggleButton variant="outline-secondary" id="tbg-radio-2" value={2} onClick={() => setList(<WrapperList />)}>Wrappers</ToggleButton>
                <ToggleButton variant="outline-secondary" id="tbg-radio-3" value={3} onClick={() => setList(<SupplierList />)}>Supplier</ToggleButton>
                <ToggleButton variant="outline-secondary" id="tbg-radio-4" value={4} onClick={() => setList(<ComboList />)}>Combos</ToggleButton>

            </ToggleButtonGroup>
            {list}
        </Fragment>
    );
};

export default ListPage;
