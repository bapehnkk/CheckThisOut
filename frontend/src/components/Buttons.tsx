import {Button} from "@suid/material";
import {red} from "@suid/material/colors";
import {createTheme, ThemeProvider} from "@suid/material/styles";
import {Component} from "solid-js";
import PlayArrowOutlined from "@suid/icons-material/PlayArrowOutlined";


const theme = createTheme({
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: red[300],
        },
        secondary: {
            // This is green.A700 as hex.
            main: "#11cb5f",
        },
    },
});


const RedButton: Component = () => {
    return (
        <div class="content-btn">
            <PlayArrowOutlined fontSize={"large"}/>
        </div>
    );
};

export default RedButton;
