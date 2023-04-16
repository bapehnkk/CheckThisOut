import {Route, Routes} from "@solidjs/router";
import {lazy, Component} from "solid-js";

import {HomeScreen} from "../screens/Home";
import {TrackScreen} from "../screens/Track";


const AppRoutes: Component = (props) => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <HomeScreen/>
                }
            />
            <Route
                path="/track"
                element={
                    <TrackScreen/>
                }
            />
        </Routes>
    )
}

export default AppRoutes;
