import { Fragment } from "react";
import ListPage from "./pages/ListPage";
import { Route, Routes, Navigate } from "react-router-dom";
import RegisterPage from "./userSystem/registerPage";
import ConfirmPage from "./userSystem/confirmPage";
import LoginPage from "./userSystem/loginPage";
import ProfilePage from "./userSystem/profilePage";
import { BoxEditor, ComboEditor, SupplierEditor, WrapperEditor } from "./EntityEditors/EditorClasses";
import { Container, ThemeProvider } from "react-bootstrap";
import NavigationBar from "./Elements/navBar";

const App = () => {
    return (
        <Fragment>
            <ThemeProvider
                breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
                minBreakpoint="xxs"
            >
                <Container fluid >
                    <NavigationBar />
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
                        <Route path="/" element={<Navigate to="/home" />} />
                    </Routes>
                </Container>
            </ThemeProvider>
        </Fragment>
    );
};

export default App;
