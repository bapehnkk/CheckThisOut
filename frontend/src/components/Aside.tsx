import {Component, For, createSignal} from "solid-js";
import {Avatar, IconButton, MenuItem} from "@suid/material";
import HomeOutlined from "@suid/icons-material/HomeOutlined";
import List from "@suid/icons-material/List";
import LanguageOutlined from "@suid/icons-material/LanguageOutlined";
import {mode, toggleTheme} from "../App";
import DarkModeOutlined from "@suid/icons-material/DarkModeOutlined";
import WbSunnyOutlined from "@suid/icons-material/WbSunnyOutlined";
import {ThemeProvider} from "solid-theme-provider";
import {Link} from "@solidjs/router";
// @ts-ignore
import myThemes from "../Styles/themes.json";
import TranslateOutlined from "@suid/icons-material/TranslateOutlined";
import SettingsOutlined from "@suid/icons-material/SettingsOutlined";
import HistoryOutlined from "@suid/icons-material/HistoryOutlined";
import FavoriteOutlined from "@suid/icons-material/FavoriteOutlined";
import AlbumOutlined from "@suid/icons-material/AlbumOutlined";
import MusicNoteOutlined from "@suid/icons-material/MusicNoteOutlined";
import BookmarksOutlined from "@suid/icons-material/BookmarksOutlined";
import QueueMusicOutlined from "@suid/icons-material/QueueMusicOutlined";

interface AsideOptions {
    type: "full" | "compact" | "none"
}

interface AsideLinkOptions extends AsideOptions {
    icon: any,
    description: string,
    link: string
}

export const AsideLink: Component<AsideLinkOptions> = (props) => {
    return (
        <>
            {props.type === "full" ?
                <Link href={props.link} class="row">
                    <MenuItem
                        title={props.description}
                        class="row"
                    >
                        <IconButton
                            disableRipple={true}
                        >
                            {props.icon}
                        </IconButton>
                        <p>{props.description}</p>
                    </MenuItem>
                </Link> :
                <Link href={props.link} class="row">
                    <IconButton
                        title={props.description}
                    >
                        {props.icon}
                    </IconButton>
                </Link>
            }
        </>
    );
};


export const Aside: Component<AsideOptions> = (props) => {

    const [playlist, setPlaylist] = createSignal([
        {id: '/playlist', name: "playlist"},
        {id: '/playlist', name: "playlist"},
        {id: '/playlist', name: "playlist"},
        {id: '/playlist', name: "playlist"},
        {id: '/playlist', name: "playlist"},
        {id: '/playlist', name: "playlist"},
        {id: '/playlist', name: "playlist"},
        {id: '/playlist', name: "playlist"},
        {id: '/playlist', name: "playlist"},
        {id: '/playlist', name: "playlist"}
    ]);

    return (
        <aside
            class={props.type === "full" ? "full" : "compact"}
        >
            <div class="column">
                <AsideLink type={props.type} icon={HomeOutlined} description={"Home"} link={"/"}/>
                <AsideLink type={props.type} icon={List} description={"Categories"} link={"/tracks"}/>
                <AsideLink type={props.type} icon={LanguageOutlined} description={"Events"} link={"#"}/>
            </div>

            {props.type === "full" &&
                <>
                    <div class="column">
                        <AsideLink type={props.type} icon={HistoryOutlined} description={"History"} link={"#"}/>
                        <AsideLink type={props.type} icon={FavoriteOutlined} description={"Favorites"} link={"#"}/>
                        <AsideLink type={props.type} icon={AlbumOutlined} description={"Albums"} link={"#"}/>
                        <AsideLink type={props.type} icon={MusicNoteOutlined} description={"Artists"} link={"#"}/>
                        <AsideLink type={props.type} icon={BookmarksOutlined} description={"Bookmarks"} link={"#"}/>
                    </div>

                    <div class="column">
                        <AsideLink type={props.type} icon={QueueMusicOutlined} description={"Playlist"} link={"#"}/>

                        <For each={playlist()}>
                            {(playlist, i) =>
                                <Link
                                    class="row"
                                    // target="_blank"
                                    href={playlist.id}
                                >
                                    <MenuItem class="row">

                                        <Avatar/> {playlist.name}
                                    </MenuItem>
                                </Link>

                            }
                        </For>
                    </div>
                </>
            }
            <div class="column">
                {props.type === "full" ?
                    <MenuItem
                        class="row"
                        onClick={toggleTheme}
                    >
                        <IconButton
                            title="Toggle theme"
                            disableRipple={true}
                        >
                            {mode() === "dark" ?
                                <WbSunnyOutlined/> :
                                <DarkModeOutlined/>
                            }
                        </IconButton>
                        <p>Toggle theme</p>
                    </MenuItem> :
                    <IconButton
                        title="Toggle theme"
                        onClick={toggleTheme}
                    >
                        {mode() === "dark" ?
                            <WbSunnyOutlined/> :
                            <DarkModeOutlined/>
                        }
                    </IconButton>
                }
                <ThemeProvider
                    themes={myThemes}
                    default={mode()}
                    id={"ThemeProvider"}
                ></ThemeProvider>


                <AsideLink type={props.type} icon={TranslateOutlined} description={"Language"} link={"#"}/>
                <AsideLink type={props.type} icon={SettingsOutlined} description={"Settings"} link={"#"}/>
            </div>
        </aside>

    );
};