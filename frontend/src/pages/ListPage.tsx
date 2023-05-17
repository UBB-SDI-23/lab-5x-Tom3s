import { useState, Fragment, useEffect } from "react";
import { ToggleButtonGroup, ToggleButton, Button, Row, Col, Offcanvas, ListGroup } from "react-bootstrap";
import { BoxList, WrapperList, SupplierList, ComboList } from "../ListDisplays/ListClasses";
import { useNavigate, useSearchParams } from "react-router-dom";
import { destroyLocalSessionDetails } from "../models/entities";
import UserDetailsOffCanvas from "../Elements/userDetails";

const ListPage = () => {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const typeParam = searchParams.get("type") || "1";

    const [listType, setListType] = useState(parseInt(typeParam));
    const [list, setList] = useState(<BoxList />);

    useEffect(() => {
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

    console.log("Token: " + localStorage.getItem('token'));

    return (
        <Fragment>
            <Row>
                <Col className="d-flex justify-content-center">
                    <ToggleButtonGroup type="radio" name="options" defaultValue={listType}>
                        <ToggleButton variant="outline-secondary" id="tbg-radio-1" value={1} onClick={() => setListType(1)}>Boxes</ToggleButton>
                        <ToggleButton variant="outline-secondary" id="tbg-radio-2" value={2} onClick={() => setListType(2)}>Wrappers</ToggleButton>
                        <ToggleButton variant="outline-secondary" id="tbg-radio-3" value={3} onClick={() => setListType(3)}>Supplier</ToggleButton>
                        <ToggleButton variant="outline-secondary" id="tbg-radio-4" value={4} onClick={() => setListType(4)}>Combos</ToggleButton>
                    </ToggleButtonGroup>
                </Col>

                <Col className="d-flex justify-content-end">
                    
                </Col>

            </Row>
            {list}
        </Fragment>
    );
};

export default ListPage;
