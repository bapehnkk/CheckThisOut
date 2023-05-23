import {Button, IconButton} from "@suid/material";
import {red} from "@suid/material/colors";
import {createTheme, ThemeProvider} from "@suid/material/styles";
import {Accessor, Component, createEffect, createSignal} from "solid-js";
import PlayArrowOutlined from "@suid/icons-material/PlayArrowOutlined";
import PauseOutlined from "@suid/icons-material/PauseOutlined";
import Favorite from "@suid/icons-material/Favorite";
import FavoriteBorderOutlined from "@suid/icons-material/FavoriteBorderOutlined";
import {useQueueStore} from "../store/AudioPlayer";

const [queueStore, setQueueStore] = useQueueStore();

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

interface RedButtonOptions {
    fontSize?: string,
    playing?: Accessor<boolean>
}

const RedButton: Component<RedButtonOptions> = (props) => {
    const [fontSize, setFontSize] = createSignal(props.fontSize || "large");

    return (
        <div class="content-btn">
            {props.playing ? props.playing() ?
                    <PauseOutlined sx={{fontSize: fontSize()}}/> :
                    <PlayArrowOutlined sx={{fontSize: fontSize()}}/> :
                <PlayArrowOutlined sx={{fontSize: fontSize()}}/>
            }
        </div>
    );
};

interface FavoriteButtonOptions {
    fontSize?: "medium" | "large",
    trackUUID: string
}

export const FavoriteButton: Component<FavoriteButtonOptions> = (props) => {
    // const [track, setTrack] = createSignal(queueStore.tracks.at("uuid" == ))     // не реализовано в django (лайки)
    const [isFavorite, setIsFavorite] = createSignal(false)

    return (
        <IconButton
            title="Add to favorite"
            onClick={() => {
                setIsFavorite(!isFavorite())
            }}
        >
            {isFavorite() ? // queueStore.tracks.at(queueStore.nowPlaying)!.isFavorite ?
                <Favorite sx={{fontSize: props.fontSize === "medium" ? "2rem" : "2.5rem"}}/> :
                <FavoriteBorderOutlined sx={{fontSize: props.fontSize === "medium" ? "2rem" : "2.5rem"}}/>
            }
        </IconButton>
    );
};


export default RedButton;
