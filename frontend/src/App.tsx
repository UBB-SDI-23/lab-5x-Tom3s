import { Fragment } from "react";
import ListPage from "./pages/ListPage";
import BoxEditor from "./EntityEditors/BoxEditor";

const App = () => {
    return (
        <Fragment>
            <ListPage />
            {/* {BoxEditor("6419faf56b23d736edce7bd6")} */}
        </Fragment>
    );
};

export default App;
