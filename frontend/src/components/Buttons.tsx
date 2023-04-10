import {Button} from "@suid/material";
import {red} from "@suid/material/colors";
import {createTheme, ThemeProvider} from "@suid/material/styles";
import {ParentComponent} from "solid-js";



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
interface ButtonOptions {
    variant?: "text" | "outlined" | "contained",

    onClick?: any,
}

const RedButton: ParentComponent<ButtonOptions> = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <Button
                onClick={props.onClick}
                variant={props.variant}
                class="round-btn"
            >{props.children}</Button>
        </ThemeProvider>
    );
};

export default RedButton;
