import type {Component} from 'solid-js';
import {ThemeProvider} from 'solid-theme-provider';
// @ts-ignore
import myThemes from '../styles/themes.json';
import {
    Button,
    Popover,
    Typography,
    Fab,
    Avatar,
    MenuItem,
    ListItemIcon,
    Menu,
    Divider,
    IconButton,
    Badge,
    Toolbar
} from "@suid/material";
import logo from '../assets/logo.png';
import {createEffect, createSignal, onMount} from "solid-js";
import RedButton from "./Buttons";


import Logout from "@suid/icons-material/Logout";
import PersonAdd from "@suid/icons-material/PersonAdd";
import Settings from "@suid/icons-material/Settings";
import NotificationsOutlined from "@suid/icons-material/NotificationsOutlined";
import WbSunnyOutlined from "@suid/icons-material/WbSunnyOutlined";
import DarkModeOutlined from "@suid/icons-material/DarkModeOutlined";
import SettingsOutlined from "@suid/icons-material/SettingsOutlined";
import MenuOutlined from "@suid/icons-material/MenuOutlined";


import {toggleTheme, mode} from "../App";


const HeaderAvatar: Component = () => {
    const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
    const open = () => Boolean(anchorEl());
    const handleClose = () => setAnchorEl(null);

    createEffect(() => {
        if (open()) document.querySelector('html')!.classList.add('noscroll');
        else document.querySelector('html')!.classList.remove('noscroll');
    });

    return (
        <>
            <Button
                title="Account settings"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                size="small"
                sx={{
                    ml: 2,
                    boxSizing: "border-box",
                    p: ".3em",
                    minWidth: 0,
                    borderRadius: "50%",
                    width: "2.3rem",
                    height: "2.3rem"
                }}
                aria-controls={open() ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open() ? "true" : undefined}
            >
                <Avatar
                    alt="Remy Sharp"
                    src="https://sun9-80.userapi.com/impg/ON8cDnTljNdFI71lCImKGfpCKaRJe0zKPNJn1g/y0vGhRyKCEU.jpg?size=1280x675&quality=96&sign=62be4b049caeac5aacbb66be169af5ed&type=album"
                    sx={{
                        width: "2.3rem",
                        height: "2.3rem",
                    }}
                >

                </Avatar>
            </Button>
            <Menu
                anchorEl={anchorEl()}
                id="account-menu"
                open={open()}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        ["& .MuiAvatar-root"]: {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{
                    horizontal: "right",
                    vertical: "top",
                }}
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "bottom",
                }}
            >
                <MenuItem>
                    <Avatar/> Profile
                </MenuItem>
                <MenuItem>
                    <Avatar/> My account
                </MenuItem>
                <Divider/>
                <MenuItem>
                    <ListItemIcon>
                        <PersonAdd fontSize="small"/>
                    </ListItemIcon>
                    Add another account
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Settings fontSize="small"/>
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Logout fontSize="small"/>
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

const HeaderNotifications: Component = () => {
    const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
    const open = () => Boolean(anchorEl());
    const handleClose = () => setAnchorEl(null);

    const [options, setOptions] = createSignal<string[]>(["1", "2", "3", "4", "5"]);
    createEffect(() => {
        if (open()) document.querySelector('html')!.classList.add('noscroll');
        else document.querySelector('html')!.classList.remove('noscroll');
    });
    return (
        <>


            <Badge
                color="error" badgeContent={5}>
                <Button
                    title="Notifications"
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    size="small"
                    sx={{
                        ml: 2,
                        boxSizing: "border-box",
                        p: ".3em",
                        minWidth: 0,
                        borderRadius: "50%",
                        width: "2.3rem",
                        height: "2.3rem"
                    }}
                    aria-controls={open() ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open() ? "true" : undefined}
                >
                    <NotificationsOutlined fontSize="medium"/>
                </Button>
            </Badge>
            <Menu
                anchorEl={anchorEl()}
                id="account-menu"
                open={open()}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        maxHeight: 48 * 4.5,
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        width: "40ch",
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{
                    horizontal: "right",
                    vertical: "top",
                }}
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "bottom",
                }}
            >

                <Toolbar>

                    <Typography variant="body1" component="div" sx={{flexGrow: 1}}>
                        Notifications
                    </Typography>

                    <IconButton
                        title="Notifications settings"
                        size="small"
                    >
                        <SettingsOutlined fontSize="medium"/>
                    </IconButton>
                </Toolbar>
                <Divider/>
                {options().map((option) => (
                    <MenuItem selected={option === "Pyxis"} onClick={handleClose}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};


export const Aside: Component = () => {

    return (
        <aside>
            a
        </aside>

    );
};
export const Header: Component = () => {

    // onMount(() => {
    //    const el = document.getElementById("toggleThemeBtn");
    //    const read = () => {
    //        console.log("rrrr toggleTheme rrrr")
    //        toggleTheme()
    //    };
    //    el!.addEventListener("click", read);
    //    // el!.removeEventListener("mousedown", read);
    //
    // });

    return (
        <header>
            <div class="left-components">
                <Button
                    title="Notifications"
                    size="small"
                    sx={{
                        ml: 2,
                        boxSizing: "border-box",
                        p: ".3em",
                        minWidth: 0,
                        borderRadius: "50%",
                        width: "2.3rem",
                        height: "2.3rem"
                    }}
                >
                    <MenuOutlined/>
                </Button>
                <Avatar
                    alt="Remy Sharp"
                    src={logo}
                    sx={{
                        width: 44,
                        height: 44,
                    }}
                />
            </div>
            <div class="right-components">

                <IconButton
                    title="Account settings"
                    onClick={toggleTheme}
                    sx={{ml: 2}}
                >
                    {mode() === "dark" ?
                        <DarkModeOutlined/> :
                        <WbSunnyOutlined/>
                    }
                </IconButton>
                <ThemeProvider
                    themes={myThemes}
                    default={mode()}
                    id={"ThemeProvider"}
                ></ThemeProvider>

                <HeaderNotifications/>
                <HeaderAvatar/>

            </div>


        </header>

    );
};


