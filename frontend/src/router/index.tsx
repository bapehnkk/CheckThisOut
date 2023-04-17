import {Route, Routes} from "@solidjs/router";
import {lazy, Component} from "solid-js";



// import HomeScreen from "../screens/Home";
// import TrackScreen from "../screens/Track";
const HomeScreen = lazy(() => import("../screens/Home"));
const TrackScreen = lazy(() => import("../screens/Track"));

const AppRoutes: Component = (props) => {
    return (
        <Routes>
            <Route
                path="/"
                component={
                    HomeScreen
                }
            />
            <Route
                path="/track"
                component={
                    TrackScreen
                }
            />
        </Routes>
    )
}

export default AppRoutes;
