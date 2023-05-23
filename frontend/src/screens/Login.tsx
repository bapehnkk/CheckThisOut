import {createSignal, onCleanup, onMount} from "solid-js";
import {handleLogout, loginUser} from "../auth";
import {setAuth, useHeaderSignal} from "../store/auth";
import {Link, useNavigate} from "@solidjs/router";
import {setAudioSrc} from "../store/AudioPlayer";
import {hideAside, toggleAsideType} from "../App";
import {TextField, Button, Stack, Typography} from "@suid/material";

export default function Login() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = createSignal("");

    const [_, setHeaderShow] = useHeaderSignal();
    onMount(() => {
        setHeaderShow(false);
        hideAside();
        onCleanup(() => {
            setHeaderShow(true);
            toggleAsideType();
        });
    });

    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        try {
            await loginUser(email(), password());
            navigate("/");

        } catch (error) {
            console.error(error);
            setErrorMessage("Invalid username or password.");
            // await handleLogout();
        }
    };

    return (
        <div class="container">
            <Stack class={"form"} spacing={2}>
                <Typography variant="h4" component="div" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>

                    <TextField
                        label="Email"
                        variant="standard"
                        class={"form__input"}
                        onChange={(event, value) => {
                            setEmail(value);
                        }}
                    />
                    <TextField
                        type="password"
                        label="Password"
                        variant="standard"
                        class={"form__input"}
                        onChange={(event, value) => {
                            setPassword(value);
                        }}
                    />
                    {errorMessage() && (
                        <Typography variant="body2" color="error">
                            {errorMessage()}
                        </Typography>
                    )}
                    <Button variant="outlined" type="submit">Login</Button>
                </form>
                <p>
                    Don't have an account? <Link href="/register" style={"text-decoration: underline"}>Register</Link>
                </p>
            </Stack>
        </div>
    );
}