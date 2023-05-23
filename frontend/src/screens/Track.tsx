import {Component, createEffect, createSignal, For, onMount} from "solid-js";
import {Link, useNavigate, useParams} from "@solidjs/router";
import axios from "axios";
import RedButton, {FavoriteButton} from "../components/Buttons";
import Visualizer from "../components/Visualizer";
import {ImageOptions, QueueTrackOptions, setAudioSrc, useQueueStore} from "../store/AudioPlayer";
import {Avatar, Typography, Box, Divider, Toolbar, IconButton, SvgIcon} from "@suid/material";
import Tags from "../components/Tags";
import {FitText} from "../components/FitText";
import {QueueTrack} from "../components/Tracks";
import NotFound from "./NotFound";

import MusicNoteOutlined from "@suid/icons-material/MusicNoteOutlined";
import PauseOutlined from "@suid/icons-material/PauseOutlined";
import PlayArrowOutlined from "@suid/icons-material/PlayArrowOutlined";
import AlbumOutlined from "@suid/icons-material/AlbumOutlined";
import Visibility from "@suid/icons-material/Visibility";
import CommentOutlined from "@suid/icons-material/CommentOutlined";
import VideocamOutlined from "@suid/icons-material/VideocamOutlined";
import ImageOutlined from "@suid/icons-material/ImageOutlined";
import ReplyOutlined from "@suid/icons-material/ReplyOutlined";
import NumComponent from "../components/NumComponent";
import TextWrap from "../components/TextWrap";
import ShowClip from "../components/ShowClip";
import {ImageSlider} from "../components/Sliders";
import TipTapField from "../components/TipTapField";

interface TrackOptions {
    id: string;
    title: string;
    images: string[];
}

interface AlbumOptions {
    id: string;
    album_type: string;
    title: string;
    tracks: TrackOptions[];
}


const Track: Component = () => {
    const [queueStore, setQueueStore] = useQueueStore();
    const [track, setTrack] = createSignal<QueueTrackOptions | null>(null);
    const [trackPlaying, setTrackPlaying] = createSignal<boolean>(false);
    const params = useParams();
    const [currentTrack, setCurrentTrack] = createSignal(false);
    const [album, setAlbumTracks] = createSignal<AlbumOptions | null>(null);

    const navigate = useNavigate();

    createEffect(async () => {
        params.trackId;
        try {
            const response = await axios.get(`http://localhost:8000/api/track/${params.trackId}/`);
            setTrack(response.data);

            const aResponse = await axios.get(`http://localhost:8000/api/album/${track()?.album.id}/`);
            setAlbumTracks(aResponse.data)
        } catch (error) {
            console.error("Error fetching track:", error);
            setTrack(null)
        }
    });

    createEffect(() => {
        queueStore.playing
        if (track() && queueStore.tracks.at((queueStore.nowPlaying))) {
            setTrackPlaying(queueStore.tracks.at((queueStore.nowPlaying))!.uuid === track().uuid ? queueStore.playing : false)
        }
    });

    function getRandomArtImage(track: QueueTrackOptions, id: number): string {
        // Функция поиска изображения 'art'
        const findArt = (images: ImageOptions[]): ImageOptions | undefined => {
            if (!images) return undefined;
            const artImages = images.filter(image => image.image_type === 'art' && image.id !== id);
            if (artImages.length === 0) return undefined;
            const randomImage = artImages[Math.floor(Math.random() * artImages.length)];
            return randomImage;
        }


        // Поиск в track.images
        let image = findArt(track.images);
        if (image) return image.image_file;

        // Поиск в album.images
        image = findArt(track.album.images);
        if (image) return image.image_file;

        // Поиск в bands[].images
        if (track.bands.length > 0) {
            // Выбор случайной группы
            const randomBand = track.bands[Math.floor(Math.random() * track.bands.length)];
            image = findArt(randomBand.images);
            if (image) return image.image_file;
        }

        return track.images[0].image_file;
    }


    return (
        <>
            {track() ?
                <div class="container">
                    <div
                        class="preview-container"
                        style={`background: linear-gradient(0deg, rgba(59, 66, 82, 0.9), rgba(59, 66, 82, 0.9)), url(${getRandomArtImage(track(), track().images[0].id)});`}
                    >

                        <div class="preview-container__player">
                            <Box class="preview-container__disc" sx={{
                                minWidth: window.innerWidth / 3 + "px",
                                height: window.innerHeight / 2 + "px",
                            }}>
                                {queueStore.tracks.at((queueStore.nowPlaying))?.uuid === track()?.uuid ?
                                    <Visualizer/> :
                                    <Avatar
                                        src={track().images[0].image_file}
                                        sx={{
                                            minWidth: window.innerWidth / 5.2,
                                            height: window.innerWidth / 5.2,
                                            boxShadow: "0px 5px 15px rgba(0,0,0,0.2)"
                                        }}
                                    />
                                }
                            </Box>


                            <div class="preview-container__about">
                                <div class="row start-end gap-1">
                                    <RedButton fontSize={"5rem"} playing={trackPlaying}/>
                                    <IconButton disabled sx={{color: "var(--stp-foreground) !important"}}>
                                        <SvgIcon height="11" viewBox="0 0 11 11" width="11">
                                            <path
                                                d="m1 2.506v5.988a1.5 1.5 0 0 0 1.491 1.506h6.019c.827 0 1.49-.674 1.49-1.506v-5.988a1.5 1.5 0 0 0 -1.491-1.506h-6.019c-.827 0-1.49.674-1.49 1.506zm4 2.494v-1h2v-1h-3v5h3v-1h-2v-1h2v-1zm-5-2.494a2.496 2.496 0 0 1 2.491-2.506h6.019a2.5 2.5 0 0 1 2.49 2.506v5.988a2.496 2.496 0 0 1 -2.491 2.506h-6.019a2.5 2.5 0 0 1 -2.49-2.506z"
                                                fill-opacity="1"/>
                                        </SvgIcon>
                                    </IconButton>

                                    <FavoriteButton fontSize={"large"}
                                                    trackUUID={queueStore.tracks.at(queueStore.nowPlaying)!.uuid}/>
                                </div>
                                <Tags tags={track().tags}/>
                                <div class="preview-container__text">
                                    <Typography variant="h3" gutterBottom component="div">
                                        <MusicNoteOutlined fontSize={"large"}/> {track().title}
                                    </Typography>
                                    <div class="row start preview-container__text-authors marquee">
                                        <span class="row">
                                            {track()
                                                .bands.map((band, index, bandsArray) => (
                                                    <>
                                                        <Avatar
                                                            src={band.images.find(image => image.image_type === 'logo')!.image_file}
                                                            sx={{
                                                                mr: ".5rem"
                                                            }}
                                                        />
                                                        <Link
                                                            title={band.title}
                                                            href={`/band/${band.id}`}
                                                        >
                                                            {band.title}{index < bandsArray.length - 1 ? ', ' : ''}

                                                        </Link>
                                                    </>
                                                ))
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {album() &&
                            <Box class="album"
                                 sx={{
                                     maxHeight: window.innerHeight / 2 + "px",
                                 }}
                            >


                                <Toolbar class={"player-queue"}>
                                    <Link href={"/queue"} class={"player-queue__title"}>
                                        <Typography variant="body1" component="div" class={"row start"}
                                                    sx={{flexGrow: 1, fontSize: "1.2rem", gap: "1rem"}}>
                                            <AlbumOutlined sx={{fontSize: "2.5rem"}}/>
                                            Album {album().album_type === "single" ? "single" : ""}
                                        </Typography>

                                    </Link>

                                    <IconButton
                                        title={"Play/Stop"}
                                        onClick={() => {
                                        }}
                                        size={"small"}
                                    >
                                        <PlayArrowOutlined sx={{fontSize: "2rem"}}/>

                                    </IconButton>

                                </Toolbar>
                                <Divider
                                    sx={{
                                        borderWidth: ".05rem",
                                        borderColor: "var(--stp-foreground)"
                                    }}
                                />
                                <Tags tags={album().tags}/>
                                <Divider
                                    sx={{
                                        borderWidth: ".05rem",
                                        borderColor: "var(--stp-foreground)"
                                    }}
                                />
                                <div class="album__tracks">
                                    <For each={album()?.tracks}>{(track, index) =>
                                        <QueueTrack {...track}/>
                                    }</For>
                                </div>
                            </Box>
                        }
                    </div>
                    <div class="content-wrapper">
                        <div class="content-wrapper__content">
                            <div class="content-wrapper__content-block info-panel">
                                <div class={"row gap-05"}>
                                    <IconButton disabled sx={{color: "var(--stp-foreground) !important"}}>
                                        <Visibility sx={{fontSize: "2rem"}}/>
                                    </IconButton>
                                    <NumComponent num={25600}/>
                                </div>
                                <div class={"row gap-05"}>
                                    <FavoriteButton fontSize={"medium"}
                                                    trackUUID={queueStore.tracks.at(queueStore.nowPlaying)!.uuid}/>
                                    <NumComponent num={1900}/>
                                </div>
                                <div class={"row gap-05"}>
                                    <IconButton>
                                        <CommentOutlined sx={{fontSize: "2rem"}}/>
                                    </IconButton>
                                    <NumComponent num={348}/>
                                </div>
                                <div class={"row gap-05"}>
                                    <IconButton>
                                        <VideocamOutlined sx={{fontSize: "2rem"}}/>
                                    </IconButton>
                                    <NumComponent num={1}/>
                                </div>
                                <div class={"row gap-05"}>
                                    <IconButton>
                                        <ImageOutlined sx={{fontSize: "2rem"}}/>
                                    </IconButton>
                                    <NumComponent num={1}/>
                                </div>
                                <div class={"row gap-05"}>
                                    <IconButton>
                                        <ReplyOutlined sx={{transform: "scale(-1, 1)", fontSize: "2rem"}}/>
                                    </IconButton>
                                    <NumComponent num={640}/>
                                </div>
                            </div>
                            <div class="content-wrapper__content-block text">
                                {track()?.lyrics &&
                                    <div class="block">
                                        <h2 class={"anchor-link"}>Lyrics</h2>
                                        <TextWrap text={track()?.lyrics}></TextWrap>
                                    </div>
                                }
                                {track()?.release_date &&
                                    <div class="block">
                                        <h2 class={"anchor-link"}>Release date</h2>
                                        <TextWrap text={track()?.release_date}></TextWrap>
                                    </div>
                                }
                                {track()?.album.record_label &&
                                    <div class="block">
                                        <h2 class={"anchor-link"}>Record label</h2>
                                        <TextWrap text={track()!.album.record_label}></TextWrap>
                                    </div>
                                }
                                {track()?.album.critical_receptions &&
                                    <div class="block">
                                        <h2 class={"anchor-link"}>Record label</h2>
                                        <TextWrap text={track()!.album.critical_receptions}></TextWrap>
                                    </div>
                                }
                                {track().description &&
                                    <div class="block">
                                        <h2 class={"anchor-link"}>About</h2>
                                        <TextWrap text={track()!.description}></TextWrap>
                                    </div>
                                }
                            </div>
                            <div class="content-wrapper__content-block interactive">

                                <div>
                                    <h2 class={"anchor-link"}>
                                        Clips
                                        <VideocamOutlined sx={{ml: ".5rem", fontSize: "3rem"}}/>
                                    </h2>

                                    <ShowClip youtubeUrl={track()?.clips[0]?.clip_url}
                                              videoUrl={track()?.clips[0]?.clip_file}/>
                                </div>
                                <div>
                                    <h2 class={"anchor-link"}>
                                        Arts
                                        <ImageOutlined sx={{ml: ".5rem", fontSize: "3rem"}}/>
                                    </h2>

                                    <ImageSlider images={track()!.images.map(image => image.image_file)}/>


                                </div>

                                <div>
                                    <h2 class={"anchor-link"}>Comments</h2>
                                    <TipTapField/>

                                </div>
                            </div>


                        </div>
                        <div class="content-wrapper__music-queue">
                            {album() &&
                                <Box class="album"
                                     sx={{
                                         maxHeight: window.innerHeight / 2 + "px",
                                         backgroundColor: "var(--stp-background-light)"
                                     }}
                                >


                                    <Toolbar class={"player-queue"}>
                                        <Link href={"/queue"} class={"player-queue__title"}>
                                            <Typography variant="body1" component="div" class={"row start"}
                                                        sx={{flexGrow: 1, fontSize: "1.2rem", gap: "1rem"}}>
                                                <AlbumOutlined sx={{fontSize: "2.5rem"}}/>
                                                Album {album().album_type === "single" ? "single" : ""}
                                            </Typography>

                                        </Link>

                                        <IconButton
                                            title={"Play/Stop"}
                                            onClick={() => {
                                            }}
                                            size={"small"}
                                        >
                                            <PlayArrowOutlined sx={{fontSize: "2rem"}}/>

                                        </IconButton>

                                    </Toolbar>
                                    <Divider
                                        sx={{
                                            borderWidth: ".05rem",
                                            borderColor: "var(--stp-foreground)"
                                        }}
                                    />
                                    <Tags tags={album().tags}/>
                                    <Divider
                                        sx={{
                                            borderWidth: ".05rem",
                                            borderColor: "var(--stp-foreground)"
                                        }}
                                    />
                                    <div class="album__tracks">
                                        <For each={album()?.tracks}>{(track, index) =>
                                            <QueueTrack {...track}/>
                                        }</For>
                                    </div>
                                </Box>
                            }
                        </div>
                    </div>


                </div> :
                <NotFound/>

            }
        </>
    );
};

export default Track;
