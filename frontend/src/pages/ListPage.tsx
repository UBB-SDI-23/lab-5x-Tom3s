import { useState, Fragment, useEffect } from "react";
import { ToggleButtonGroup, ToggleButton, Button, Row, Col } from "react-bootstrap";
import BoxList from "../ListDisplays/Boxes";
import ComboList from "../ListDisplays/Combos";
import SupplierList from "../ListDisplays/Suppliers";
import WrapperList from "../ListDisplays/Wrappers";
import { useNavigate, useSearchParams } from "react-router-dom";

const ListPage = () => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const typeParam = searchParams.get("type") || "1";

    const [listType, setListType] = useState(parseInt(typeParam));
    const [list, setList] = useState(<BoxList />);


    // console.log(typeParam);

    useEffect(() => {
        console.log(listType);
        switch (listType) {
            case 1:
                setList(<BoxList />);
                setSearchParams((oldParams) => {
                    oldParams.set("type", "1");
                    return oldParams;
                });
                break;
            case 2:
                setList(<WrapperList />);
                setSearchParams((oldParams) => {
                    oldParams.set("type", "2");
                    return oldParams;
                });
                break;
            case 3:
                setList(<SupplierList />);
                setSearchParams((oldParams) => {
                    oldParams.set("type", "3");
                    return oldParams;
                });
                break;
            case 4:
                setList(<ComboList />);
                setSearchParams((oldParams) => {
                    oldParams.set("type", "4");
                    return oldParams;
                });
                break;
            default:
                setList(<BoxList />);
                break;
        }
    }, [listType]);

    return (
        <Fragment>
            <Row>
                <Col>
                    <ToggleButtonGroup type="radio" name="options" defaultValue={listType}>
                        <ToggleButton variant="outline-secondary" id="tbg-radio-1" value={1} onClick={() => setListType(1)}>Boxes</ToggleButton>
                        <ToggleButton variant="outline-secondary" id="tbg-radio-2" value={2} onClick={() => setListType(2)}>Wrappers</ToggleButton>
                        <ToggleButton variant="outline-secondary" id="tbg-radio-3" value={3} onClick={() => setListType(3)}>Supplier</ToggleButton>
                        <ToggleButton variant="outline-secondary" id="tbg-radio-4" value={4} onClick={() => setListType(4)}>Combos</ToggleButton>
                    </ToggleButtonGroup>
                </Col>

                <Col>
                    <Button variant="primary" onClick={() => navigate("/register")}>Register</Button>
                    <Button variant="primary" onClick={() => navigate("/login")}>Login</Button>
                </Col>

            </Row>
            {list}
        </Fragment>
    );
};

export default ListPage;
