import { Fragment } from "react";
import ListPage from "./pages/ListPage";
import { Route, Routes, Navigate } from "react-router-dom";
import RegisterPage from "./userSystem/registerPage";
import ConfirmPage from "./userSystem/confirmPage";
import LoginPage from "./userSystem/loginPage";
import ProfilePage from "./userSystem/profilePage";
import { BoxEditor, ComboEditor, SupplierEditor, WrapperEditor } from "./EntityEditors/EditorClasses";
import ProfileEditor from "./userSystem/profileEditor";

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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/confirm" element={<ConfirmPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/editProfile" element={<ProfileEditor />} />
                <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
        </Fragment>
    );
};

export default App;
