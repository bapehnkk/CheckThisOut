import {Route, Routes} from "@solidjs/router";
import {lazy, Component} from "solid-js";
import {useAuthStore} from "../store/auth";


// import HomeScreen from "../screens/Home";
// import TrackScreen from "../screens/Track";
const HomeScreen = lazy(() => import("../screens/Home"));
const TrackScreen = lazy(() => import("../screens/Track"));
const LoginScreen = lazy(() => import("../screens/Login"));
const RegisterScreen = lazy(() => import("../screens/Register"));
const UserList = lazy(() => import("../Components/UserList"));
const TrackList = lazy(() => import("../Components/TrackList"));

const AppRoutes: Component = (props) => {
    const [authState, _] = useAuthStore();

    return (
        <Routes>
            <Route
                path="/"
                component={
                    HomeScreen
                }
            />
            <Route
                path="/track/:trackId"
                component={
                    TrackScreen
                }
            />
            <Route
                path="/UserList"
                component={
                    UserList
                }
            />
            <Route
                path="/tracks"
                component={
                    TrackList
                }
            />

            {!authState.isAuthenticated &&
                <>
                    <Route
                        path="/login"
                        component={
                            LoginScreen
                        }
                    />
                    <Route
                        path="/register"
                        component={
                            RegisterScreen
                        }
                    />
                </>
            }

        </Routes>
    )
}

export default AppRoutes;
