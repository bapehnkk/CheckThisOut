import {createEffect, createSignal, onCleanup, onMount} from "solid-js";
import {loginUser, registerUser, validateField} from "../auth";
import {setAuth, useHeaderSignal} from "../store/auth";
import {Link, useNavigate} from "@solidjs/router";
import {hideAside, toggleAsideType} from "../App";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@suid/material";
import {SelectChangeEvent} from "@suid/material/Select";
import toast from "solid-toast";
import {createStore} from "solid-js/store";

export default function Register() {
    interface Errors {
        [key: string]: string[];
    }

    const navigate = useNavigate();
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
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [confirmPassword, setConfirmPassword] = createSignal("");
    const [fullName, setFullName] = createSignal("");
    const [phone, setPhone] = createSignal("");
    const [language, setLanguage] = createSignal("");
    const [errors, setErrors] = createStore<Errors>({});

    const [submitIsDisabled, setSubmitIsDisabled,] = createSignal(false);

    function addError(field: string, message: string) {
        setErrors((oldErrors) => {
            const newErrors = {...oldErrors};
            if (!newErrors[field]) {
                newErrors[field] = [];
            }
            newErrors[field].push(message);
            return newErrors;
        });
    }

    function removeError(field: string) {
        setErrors(field, "");
    }

    function clearErrors() {
        setErrors({});
    }

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        try {
            clearErrors();
            const response = await registerUser(
                email(),
                username(),
                password(),
                fullName(),
                phone(),
                language()
            );
            navigate("/");
            toast(`Welcome, ${username()}. To complete the activation of your account, kindly click on the link that has been sent to your email.`, {
                duration: 10000,
                position: 'top-right',
                // Add a delay before the toast is removed
                // This can be used to time the toast exit animation
                unmountDelay: 500,
                // Styling - Supports CSS Objects, classes, and inline styles
                // Will be applied to the toast container
                style: {
                    'background-color': 'var(--stp-background-lighter)',
                    'color': 'var(--stp-foreground)',
                },
                icon: '👋',
                iconTheme: {
                    primary: '#fff',
                    secondary: '#000',
                },
            });
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                setErrors({general: "An error occurred while processing your request."});
            }
        }
    };

    const handleLanguageChange = (event: SelectChangeEvent) => {
        setLanguage(event.target.value);
    };


    function hasNoErrors(): boolean {
        for (const field in errors) {
            if (errors[field] !== "") {
                return false;
            }
        }
        return true;
    }

    const checkConfirmPassword = () => {
        removeError("confrim_password");
        if (confirmPassword().length > 0 && confirmPassword() !== password()) {
            addError("confrim_password", "Password mismatch")
        }
    };


    return (
        <div class="container">
            <Stack class={"form"} spacing={2}>
                <Typography variant="h4" component="div" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        type="email"
                        label="Email"
                        variant="standard"
                        class={"form__input"}
                        onChange={async (event, value) => {
                            setEmail(value);
                            await validateField("email", value, addError, removeError);
                        }}
                        required
                    />
                    {errors.email && (
                        <Typography variant="body2" color="error">
                            {errors.email}
                        </Typography>
                    )}

                    <TextField
                        label="Username"
                        variant="standard"
                        class={"form__input"}
                        onChange={async (event, value) => {
                            setUsername(value);
                            await validateField("username", value, addError, removeError);
                        }}
                        required
                    />
                    {errors.username && (
                        <Typography variant="body2" color="error">
                            {errors.username}
                        </Typography>
                    )}

                    <TextField
                        type="password"
                        label="Password"
                        variant="standard"
                        class={"form__input"}
                        onChange={async (event, value) => {
                            setPassword(value);
                            await validateField("password", value, addError, removeError);
                            checkConfirmPassword();
                        }}
                        required
                    />
                    {errors.password && (
                        <Typography variant="body2" color="error">
                            {errors.password}
                        </Typography>
                    )}
                    <TextField
                        type="password"
                        label="Confirm Password"
                        variant="standard"
                        class={"form__input"}
                        onChange={async (event, value) => {
                            setConfirmPassword(value);
                            checkConfirmPassword();
                        }}
                        required
                    />
                    {errors.password && (
                        <Typography variant="body2" color="error">
                            {errors.confrim_password}
                        </Typography>
                    )}

                    <TextField
                        label="Full Name"
                        variant="standard"
                        class={"form__input"}
                        onChange={async (event, value) => {
                            setFullName(value);
                            await validateField("full_name", value, addError, removeError);
                        }}
                    />
                    {errors.full_name && (
                        <Typography variant="body2" color="error">
                            {errors.full_name}
                        </Typography>
                    )}

                    <TextField
                        type="tel"
                        label="Phone"
                        variant="standard"
                        class={"form__input"}
                        onChange={async (event, value) => {
                            setPhone(value);
                            await validateField("phone", value, addError, removeError);
                        }}
                    />
                    {errors.phone && (
                        <Typography variant="body2" color="error">
                            {errors.phone}
                        </Typography>
                    )}

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Language</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={language()}
                            label="Age"
                            onChange={handleLanguageChange}
                        >
                            <MenuItem value={"en"}>en</MenuItem>
                            <MenuItem value={"ru"}>ru</MenuItem>
                            <MenuItem value={"et"}>et</MenuItem>
                        </Select>
                    </FormControl>
                    {errors.language && (
                        <Typography variant="body2" color="error">
                            {errors.language}
                        </Typography>
                    )}

                    {errors.general && (
                        <Typography variant="body2" color="error">
                            {errors.general}
                        </Typography>
                    )}

                    <Button disabled={!hasNoErrors()} variant="outlined" type="submit">Register</Button>
                </form>

                <p>
                    You have an account? <Link href="/login" style={"text-decoration: underline"}>Login</Link>
                </p>
            </Stack>
        </div>
    );
}

