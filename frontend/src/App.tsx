import { Fragment } from "react";
import ListPage from "./pages/ListPage";
import BoxEditor from "./EntityEditors/BoxEditor";
import { Route, Routes, Navigate } from "react-router-dom";
import WrapperEditor from "./EntityEditors/WrapperEditor";
import SupplierEditor from "./EntityEditors/SupplierEditor";
import ComboEditor from "./EntityEditors/ComboEditor";
import RegisterPage from "./userSystem/registerPage";
import ConfirmPage from "./userSystem/confirmPage";

const App = () => {
    return (
        <Fragment>
            <Routes>
                <Route path="/home" element={<ListPage />} />
                <Route path="/box" element={<BoxEditor />} />
                <Route path="/wrapper" element={<WrapperEditor />} />
                <Route path="/supplier" element={<SupplierEditor />} />
                <Route path="/combo" element={<ComboEditor />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/confirm" element={<ConfirmPage />} />
                <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
        </Fragment>
    );
};

export default App;
