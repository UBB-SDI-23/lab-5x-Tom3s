import { Fragment } from "react";
import ListPage from "./pages/ListPage";
import BoxEditor from "./EntityEditors/BoxEditor";
import { Route, Routes, Navigate } from "react-router-dom";

const App = () => {
    return (
        <Fragment>
            <Routes>
                <Route path="/home" element={<ListPage />} />
                <Route path="/box" element={<BoxEditor />} />
                <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
        </Fragment>
    );
};

export default App;
