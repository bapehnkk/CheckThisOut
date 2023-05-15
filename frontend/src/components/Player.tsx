import {Component, createSignal, onMount, onCleanup, createEffect, createMemo} from "solid-js";
import {
    Badge, Box,
    Button,
    CardMedia,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Modal,
    Toolbar,
    Typography,
    Stack
} from "@suid/material";
import {
    Arc,
    ContinuousRange,
    Control,
    rangeCreators,
    createSmoothedValue,
    ImageStripControl,
    Range,
    rangeFunctions,
    RangeType,
    Scale,
    ValueInput
} from "solid-knobs";
import {createAccuratePercentageRange} from "solid-knobs/dist/types/range/rangeCreators";
import {fontSizeInPixels} from "../App";
import {
    QueueOptions,
    QueueTrackOptions,
    useAudioPlayerStore,
    useQueueStore,
    editTrackById,
    toggleRepeatType, shuffleTracks
} from "../store/AudioPlayer";


import FavoriteBorderOutlined from "@suid/icons-material/FavoriteBorderOutlined";
import Favorite from "@suid/icons-material/Favorite";
import PlaylistPlay from "@suid/icons-material/PlaylistPlay";
import VolumeUp from "@suid/icons-material/VolumeUp";
import VolumeDown from "@suid/icons-material/VolumeDown";
import VolumeMute from "@suid/icons-material/VolumeMute";
import VolumeOff from "@suid/icons-material/VolumeOff";
import PauseOutlined from "@suid/icons-material/PauseOutlined";
import PlayArrowOutlined from "@suid/icons-material/PlayArrowOutlined";
import PlayCircleOutline from "@suid/icons-material/PlayCircleOutline";
import PauseCircleOutline from "@suid/icons-material/PauseCircleOutline";
import ShuffleOutlined from "@suid/icons-material/ShuffleOutlined";
import SkipPreviousOutlined from "@suid/icons-material/SkipPreviousOutlined";
import SkipNextOutlined from "@suid/icons-material/SkipNextOutlined";
import RepeatOutlined from "@suid/icons-material/RepeatOutlined";
import RepeatOneOutlined from "@suid/icons-material/RepeatOneOutlined";
import EventRepeatOutlined from "@suid/icons-material/EventRepeatOutlined";
import Close from "@suid/icons-material/Close";
import KeyboardArrowLeft from "@suid/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@suid/icons-material/KeyboardArrowRight";

import OpenInNewOutlined from "@suid/icons-material/OpenInNewOutlined";
import MoreHoriz from "@suid/icons-material/MoreHoriz";
import {QueueTrack} from "./Tracks";
import {SortableVerticalListExample} from "./SortableList";
import {Link} from "@solidjs/router";
import Visualizer from "./Visualizer";

import {
    useKeyDownList,
    createKeyHold,
    createShortcut, useKeyDownEvent,
} from '@solid-primitives/keyboard'
import {FitText} from "./FitText";
import TabsDotted from "./Tabs";

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

const [musicVolume, setMusicVolume] = createSignal(0.7);

const [audioPlayerStore, setAudioPlayerStore] = useAudioPlayerStore();
const [queueStore, setQueueStore] = useQueueStore();

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
interface NextTrackInPlayer {
    prevOrNext: "prev" | "next",
    onClick: any
}

export const NextTrackInPlayer: Component<NextTrackInPlayer> = (props) => {
    const [track, setTrack] = createSignal<QueueTrackOptions>();


    createEffect(() => {
        if (props.prevOrNext === "prev") {
            if (queueStore.nowPlaying - 1 < 0) {
                setTrack(queueStore.tracks.at(queueStore.tracks.length - 1))
            } else {
                setTrack(queueStore.tracks.at(queueStore.nowPlaying - 1))
            }
        } else if (props.prevOrNext === "next") {
            if (queueStore.nowPlaying + 1 > queueStore.tracks.length - 1) {
                setTrack(queueStore.tracks.at(0))
            } else {
                setTrack(queueStore.tracks.at(queueStore.nowPlaying + 1))
            }
        }
    });

    return (
        <div
            class={"nextOrPrev-track-button"}
            onClick={props.onClick}
        >
            <div
                class={"nextOrPrev-track-button__bgc"}
                style={`background: linear-gradient(0deg, rgba(59, 66, 82, 0.9), rgba(59, 66, 82, 0.9)), url(${track()?.images[0]!.image_file});`}
            ></div>
            {props.prevOrNext === "prev" ?
                <KeyboardArrowLeft/> :
                <KeyboardArrowRight/>
            }

            <div class="nextOrPrev-track-button__description">
                {track() &&
                    <>
                        <FitText text={track()!.title.toString()} class="content-description__title"/>
                        {track()!.bands!.map(
                            band => <FitText text={band.title}
                                             class="content-description__title"/>
                        )}

                    </>
                }
            </div>
        </div>
    )
};

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer: Component = () => {
    const updateTrack = () => {
        const nowPlaying = queueStore.audio.src;
        const trackInQueue = queueStore.tracks.at(queueStore.nowPlaying)!.music_file;
        if (nowPlaying != trackInQueue) {
            queueStore.audio.src = trackInQueue;
        }
    };

    const [audio] = createSignal(queueStore.audio);

    const [duration, setDuration] = createSignal(0);
    const [currentTime, setCurrentTime] = createSignal(0);
    const [mouseDown, setMouseDown] = createSignal(false);


    const [openPlayer, setOpenPlayer] = createSignal(false);
    const handleOpenPlayer = () => setOpenPlayer(true);
    const handleClosePlayer = () => setOpenPlayer(false);

    const togglePlayPause = () => {
        if (queueStore.playing) {
            audio().pause();
        } else {
            audio().play();
        }
        setQueueStore(
            "playing", !queueStore.playing
        )
    };

    const setVolume = (volume: number) => {
        audio().volume = volume;
    };

    const getVolume = (): number => {
        return audio().volume;
    };

    const handleMouseDown = () => {
        setMouseDown(true);
    };

    const handleMouseUp = () => {
        setMouseDown(false);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (mouseDown()) {
            handleProgressBarClick(event);
        }
    };

    const handleMouseLeave = () => {
        setMouseDown(false);
    };

    const handleProgressBarClick = (event: MouseEvent) => {
        const progressBar = event.currentTarget as HTMLElement;
        const rect = progressBar.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const progress = x / rect.width;
        audio().currentTime = progress * duration();
        setCurrentTime(progress * duration());
        setQueueStore(
            "audioTime", currentTime
        )
    };

    const prevTrack = () => {
        setQueueStore(
            "nowPlaying", queueStore.nowPlaying === 0 ? queueStore.tracks.length - 1 : queueStore.nowPlaying - 1
        );
    };

    const nextTrack = () => {
        setQueueStore(
            "nowPlaying", queueStore.nowPlaying === queueStore.tracks.length - 1 ? 0 : queueStore.nowPlaying + 1
        );
    };

    const increaseVolume = () => {
        setMusicVolume((currentVolume) => {
            let newVolume = currentVolume + 0.1;
            return newVolume > 1 ? 1 : newVolume;
        });
    };

    const decreaseVolume = () => {
        setMusicVolume((currentVolume) => {
            let newVolume = currentVolume - 0.1;
            return newVolume < 0 ? 0 : newVolume;
        });
    };

    createEffect(() => {
        audio().addEventListener('loadedmetadata', () => {
            setDuration(audio().duration);
        });

        audio().addEventListener('timeupdate', () => {
            setCurrentTime(audio().currentTime);
        });
        audio().addEventListener('ended', () => {
            switch (queueStore.repeat) {
                case "track":
                    audio().play();
                    break;
                case "queue":
                    nextTrack();
                    break;
                case "no":
                    if (queueStore.nowPlaying !== queueStore.tracks.length - 1) {
                        nextTrack();
                    } else {
                        setQueueStore("playing", false);
                    }
                    break;
            }
        });
    });

    createEffect(() => {
        setVolume(musicVolume());
    });


    createEffect(() => {
        queueStore.tracks
        queueStore.repeat
        queueStore.nowPlaying
        onMount(() => {
            if (queueStore.playing) {
                audio().play();
            }
        })
    });

    createEffect(() => {
        queueStore.playing
        onMount(() => {
            if (queueStore.playing) {
                audio().play();
            } else {
                audio().pause();
            }
        })
    });

    onMount(() => {

        updateTrack();
        createEffect(() => {
            updateTrack();
        });
    })

    const handleProgress = () => {
        if (preload) {
            preload.style.width = preloadProgress();
        }
    };
    onMount(() => {
        queueStore.audio.addEventListener('progress', handleProgress);
        onCleanup(() => {
            queueStore.audio.removeEventListener('progress', handleProgress);
        });
    });


    let preload: HTMLDivElement;
    const preloadProgress = () => {
        if (queueStore.audio.buffered.length > 0) {
            const bufferedEnd = queueStore.audio.buffered.end(queueStore.audio.buffered.length - 1);
            const duration = queueStore.audio.duration;

            if (duration > 0) {
                return `${(bufferedEnd / duration) * 100}%`;
            }
        }
        return '0%';
    };

    createEffect(() => {
        if (preload) {
            preload.style.width = preloadProgress();
        }
    });


    // Hotkeys
    createShortcut(
        [' '], togglePlayPause, {preventDefault: true,},
    );

    createShortcut(
        ['ArrowLeft'], prevTrack, {preventDefault: true,},
    );
    createShortcut(
        ['ArrowRight'], nextTrack, {preventDefault: true,},
    );
    createShortcut(
        ['ArrowDown'], decreaseVolume, {preventDefault: true,},
    );
    createShortcut(
        ['ArrowUp'], increaseVolume, {preventDefault: true,},
    );
    createShortcut(
        ['Escape'], () => {
            setOpenPlayer(false)
        },
        {preventDefault: true,},
    );

    return (
        <div class={"audio-progress"}>
            <div class="audio-progress__controls-btns">
                <div class="row start">
                    <IconButton
                        title={"Open trackpage"}
                        size={"small"}
                        onClick={handleOpenPlayer}
                    >
                        <OpenInNewOutlined/>
                    </IconButton>
                    <Modal
                        open={openPlayer()}
                        onClose={handleClosePlayer}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box
                            sx={{
                                position: "fixed",
                                top: "0",
                                left: "0",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "var(--stp-background)",
                                boxShadow: "24px",
                                p: 4,
                                display: "flex"
                            }}
                        >

                            <Stack
                                direction="row"
                                justifyContent="space-around"
                                alignItems="center"
                                spacing={1}
                                flex={"1"}
                                // height={"100%"}
                                // width={"100%"}
                            >
                                <NextTrackInPlayer
                                    prevOrNext={"prev"}
                                    onClick={prevTrack}
                                />

                                <div class="full-page-player">

                                    <div
                                        class={"full-page-player__bgc"}
                                        style={`background: linear-gradient(0deg, rgba(59, 66, 82, 0.9), rgba(59, 66, 82, 0.9)), url(${queueStore.tracks!.at(queueStore.nowPlaying)!.images[0]!.image_file});`}
                                    ></div>

                                    <div class={"full-page-player__content"}>
                                        <TabsDotted
                                            tabs={[
                                                <Visualizer/>,
                                                // <div>aa</div>,
                                                <div>dd</div>,
                                            ]}
                                        />

                                        <div class="audio-progress__controls-btns">
                                            <div class="row start">
                                                <IconButton
                                                    title={"More"}
                                                    size={"small"}
                                                >
                                                    <MoreHoriz/>
                                                </IconButton>
                                            </div>
                                            <div class="row">
                                                <IconButton
                                                    title={"Mix"}
                                                    size={"small"}
                                                    onClick={shuffleTracks}
                                                >
                                                    <ShuffleOutlined/>
                                                </IconButton>
                                                <IconButton
                                                    title={"SkipPreviousOutlined"}
                                                    size={"small"}
                                                    onClick={prevTrack}
                                                >
                                                    <SkipPreviousOutlined/>
                                                </IconButton>
                                                <IconButton
                                                    title={"Play/Stop"}
                                                    onClick={togglePlayPause}
                                                    size={"small"}
                                                >

                                                    {queueStore.playing ?
                                                        <PauseCircleOutline fontSize={"large"}/> :
                                                        <PlayCircleOutline fontSize={"large"}/>
                                                    }
                                                </IconButton>
                                                <IconButton
                                                    title={"Play next"}
                                                    size={"small"}
                                                    onClick={nextTrack}
                                                >
                                                    <SkipNextOutlined/>
                                                </IconButton>
                                                <IconButton
                                                    title={"Repeat"}
                                                    size={"small"}
                                                    onClick={toggleRepeatType}
                                                >
                                                    {queueStore.repeat === "track" ? <RepeatOneOutlined/> :
                                                        queueStore.repeat === "queue" ? <RepeatOutlined/> :
                                                            <RepeatOutlined
                                                                sx={{color: "var(--stp-foreground-dark-alpha_secondary)"}}/>
                                                    }

                                                </IconButton>
                                            </div>
                                            <div class="row end">

                                                <FooterQueue fontSize={"medium"}/>
                                                <IconButton
                                                    title="Add to favorite"
                                                    onClick={() => {
                                                        // editTrackById(queueStore.nowPlaying, {isFavorite: !queueStore.tracks.at(queueStore.nowPlaying)!.isFavorite})
                                                    }}
                                                >
                                                    {true ? // queueStore.tracks.at(queueStore.nowPlaying)!.isFavorite ?
                                                        <Favorite sx={{fontSize: "2rem"}}/> :
                                                        <FavoriteBorderOutlined sx={{fontSize: "2rem"}}/>
                                                    }
                                                </IconButton>
                                                <SVGVolumeKnob
                                                    defaultValue={musicVolume()}
                                                    range={rangeCreators.createAccuratePercentageRange()}
                                                    smoothed={true}
                                                    fontSize={"medium"}
                                                />

                                            </div>


                                        </div>
                                        <div class="audio-progress__progress">
                                            <span
                                                class="audio-progress__progress-time"
                                            >{formatTime(currentTime())}</span>
                                            <div
                                                onMouseDown={handleMouseDown}
                                                onMouseUp={handleMouseUp}
                                                onMouseMove={handleMouseMove}
                                                onMouseLeave={handleMouseLeave}
                                                onClick={handleProgressBarClick}
                                                class="audio-progress__progress-bar"
                                            >
                                                <div
                                                    class="audio-progress__progress-preload"
                                                    ref={preload}
                                                ></div>
                                                <div
                                                    class="audio-progress__progress-progress"
                                                    style={{
                                                        width: currentTime() > 0 ? `calc(${(currentTime() / duration()) * 100}% + 0.2rem)` : "0",
                                                    }}
                                                />
                                            </div>

                                            <span
                                                class="audio-progress__progress-time"
                                            >{formatTime(duration())}</span>
                                        </div>
                                    </div>

                                </div>
                                <NextTrackInPlayer
                                    prevOrNext={"next"}
                                    onClick={nextTrack}
                                />
                            </Stack>

                        </Box>

                        <IconButton
                            title={"Close"}
                            size={"small"}
                            onClick={handleClosePlayer}
                            sx={{
                                position: "fixed",
                                top: "1rem",
                                right: "1rem",
                            }}
                        >
                            <Close/>
                        </IconButton>
                    </Modal>
                </div>
                <div class="row">

                    <IconButton
                        title={"Mix"}
                        size={"small"}
                        onClick={shuffleTracks}
                    >
                        <ShuffleOutlined/>
                    </IconButton>
                    <IconButton
                        title={"SkipPreviousOutlined"}
                        size={"small"}
                        onClick={prevTrack}
                    >
                        <SkipPreviousOutlined/>
                    </IconButton>
                    <IconButton
                        title={"Play/Stop"}
                        onClick={togglePlayPause}
                        size={"small"}
                    >

                        {queueStore.playing ?
                            <PauseCircleOutline fontSize={"large"}/> :
                            <PlayCircleOutline fontSize={"large"}/>
                        }
                    </IconButton>
                    <IconButton
                        title={"Play next"}
                        size={"small"}
                        onClick={nextTrack}
                    >
                        <SkipNextOutlined/>
                    </IconButton>
                    <IconButton
                        title={"Repeat"}
                        size={"small"}
                        onClick={toggleRepeatType}
                    >
                        {queueStore.repeat === "track" ? <RepeatOneOutlined/> :
                            queueStore.repeat === "queue" ? <RepeatOutlined/> :
                                <RepeatOutlined sx={{color: "var(--stp-foreground-dark-alpha_secondary)"}}/>
                        }

                    </IconButton>
                </div>
                <div class="row end">
                    <IconButton
                        title={"More"}
                        size={"small"}
                    >
                        <MoreHoriz/>
                    </IconButton>
                </div>

            </div>

            <div class="audio-progress__progress">
                <span
                    class="audio-progress__progress-time"
                >{formatTime(currentTime())}</span>
                <div
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleProgressBarClick}
                    class="audio-progress__progress-bar"
                >
                    <div
                        class="audio-progress__progress-preload"
                        ref={preload}
                    ></div>
                    <div
                        class="audio-progress__progress-progress"
                        style={{
                            width: currentTime() > 0 ? `calc(${(currentTime() / duration()) * 100}% + 0.2rem)` : "0",
                        }}
                    />
                </div>

                <span
                    class="audio-progress__progress-time"
                >{formatTime(duration())}</span>
            </div>
        </div>
    );
};


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

export const TrackInfo: Component = (props) => {
    return (
        <div class={"track-info"}>
            <Link
                href={`/player`}
                classList={{
                    "track-info__image": true,
                    "pause": !queueStore.playing,
                }}
            >
                <img src={queueStore.tracks.at(queueStore.nowPlaying)!.images[0].image_file} alt={""}/>
            </Link>
            <div class="track-info__text">
                <div class="row start marquee">

                    <Link
                        class={"track-info__text-track "}
                        title={queueStore.tracks.at(queueStore.nowPlaying)!.title}
                        href={`/track/${queueStore.tracks.at(queueStore.nowPlaying)!.uuid}`}>
                        {queueStore.tracks.at(queueStore.nowPlaying)!.title}
                    </Link>
                </div>
                <div class="row start track-info__text-authors marquee">
                        <span>
                            {queueStore.tracks.at(queueStore.nowPlaying)!
                                .bands.map((band, index, bandsArray) => (
                                    <Link
                                        title={band.title}
                                        href={`/band/${band.id}`}
                                    >
                                        {band.title}{index < bandsArray.length - 1 ? ', ' : ''}

                                    </Link>
                                ))}
                        </span>
                </div>

                {/*<h3 title={queueStore.tracks.at(queueStore.nowPlaying)!.title}>{queueStore.tracks.at(queueStore.nowPlaying)!.title}</h3>*/}
                {/*<p title={queueStore.tracks.at(queueStore.nowPlaying)!.bands.map(band => band.title)}>{queueStore.tracks.at(queueStore.nowPlaying)!.bands.map(band => band.title)}</p>*/}
            </div>
        </div>
    );
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
interface FooterQueueOptions {
    fontSize?: "medium" | "large"
}

const FooterQueue: Component<FooterQueueOptions> = (props) => {
    const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
    const open = () => Boolean(anchorEl());
    const handleClose = () => setAnchorEl(null);
    createEffect(() => {
        if (open()) document.querySelector('html')!.classList.add('noscroll');
        else document.querySelector('html')!.classList.remove('noscroll');
    });
    return (
        <>
            <IconButton
                title="Show queue"
                onClick={(event) => setAnchorEl(event.currentTarget)}

                aria-controls={open() ? "footer-queue" : undefined}
                aria-haspopup="true"
                aria-expanded={open() ? "true" : undefined}
            >
                <PlaylistPlay sx={{fontSize: props.fontSize === "medium" ? "2rem" : "2.5rem"}}/>
            </IconButton>
            <Menu
                anchorEl={anchorEl()}
                id="footer-queue"
                open={open()}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        backgroundColor: "var(--stp-background-light)",
                        maxHeight: 48 * 6.5,
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        width: "20rem"
                    },
                }}
                transformOrigin={{
                    horizontal: "right",
                    vertical: "top",
                }}
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "top",
                }}
            >

                <Toolbar class={"player-queue"}>
                    <Link href={"/queue"} class={"player-queue__title"}>`
                        <Typography variant="body1" component="div" class={"row start"}
                                    sx={{flexGrow: 1, fontSize: "1.2rem", gap: "1rem"}}>
                            <PlaylistPlay sx={{fontSize: "2.5rem"}}/>
                            Queue
                        </Typography>`

                    </Link>

                    <IconButton
                        title={"Play/Stop"}
                        onClick={(event) => {
                            setQueueStore(
                                "playing", !queueStore.playing
                            );
                            event.preventDefault();
                        }}
                        size={"small"}
                    >
                        {queueStore.playing ?
                            <PauseOutlined sx={{fontSize: "2rem"}}/> :
                            <PlayArrowOutlined sx={{fontSize: "2rem"}}/>
                        }

                    </IconButton>

                </Toolbar>
                <Divider/>
                {/*{queueStore.tracks.map((track) => (*/}
                {/*    <QueueTrack {...track}/>*/}
                {/*))}*/}
                {/*<Divider/>*/}
                <SortableVerticalListExample/>
            </Menu>
        </>
    );
};


interface SVGVolumeKnobProps {
    range: Range;
    defaultValue: number;
    smoothed?: boolean;
    fontSize?: "medium" | "large";
}

export const VolumeIcon: Component = (props) => {
    return (
        <>
            {musicVolume() == 0 ?
                <VolumeOff
                    x={30}
                    y={30} class={"VolumeControlIcon"}/> :
                (musicVolume() > 0 && musicVolume() < 0.33) ?
                    <VolumeMute
                        x={30}
                        y={30} class={"VolumeControlIcon"}/> :
                    (musicVolume() > 0.33 && musicVolume() < 0.66) ?
                        <VolumeDown
                            x={30}
                            y={30} class={"VolumeControlIcon"}/> :
                        <VolumeUp
                            x={30}
                            y={30} class={"VolumeControlIcon"}/>

            }
        </>
    );
};


function SVGVolumeKnob(props: SVGVolumeKnobProps) {
    const normalisedValue = () => rangeFunctions.toNormalised(props.range, musicVolume());

    const smoothedValue = createSmoothedValue(normalisedValue, 0.7);

    const baseAngle = 135;
    return (
        <>
            <Control
                defaultValue={props.defaultValue}
                range={props.range}
                value={musicVolume()}
                onGestureStart={() => console.log('Started change gesture.')}
                onGestureEnd={() => console.log('Ended change gesture.')}
                onChange={setMusicVolume}>
                <svg style={`width: ${props.fontSize === "medium" ? "3rem" : "4rem"}; position: releative;`}
                     viewBox="0 0 100 100">
                    <circle cx={50} cy={50} r={28} fill="var(--stp-background-lighter)"/>
                    <VolumeIcon/>
                    <Arc
                        x={50}
                        y={50}
                        radius={38}
                        startAngle={-baseAngle}
                        endAngle={baseAngle}
                        stroke="#ccc"
                        stroke-width={10}/>
                    <Arc
                        x={50}
                        y={50}
                        radius={38}
                        startAngle={props.range.type === RangeType.Continuous && props.range.bipolar ? 0 : -baseAngle}
                        endAngle={-baseAngle + baseAngle * 2 * (props.smoothed ? smoothedValue() : normalisedValue())}
                        stroke="var(--stp-red)"
                        stroke-width={11}/>
                </svg>
            </Control>
            <ValueInput
                class="value-input"
                range={props.range}
                value={musicVolume()}
                onChange={setMusicVolume}/>
        </>
    );
}

interface RightButtonsControlsOptions {
    fontSize?: "medium" | "large"
}

export const RightButtonsControls: Component<RightButtonsControlsOptions> = (props) => {

    return (
        <div class={"right-buttons-controls"}>
            <FooterQueue fontSize={props.fontSize}/>
            <IconButton
                title="Add to favorite"
                onClick={() => {
                    // editTrackById(queueStore.nowPlaying, {isFavorite: !queueStore.tracks.at(queueStore.nowPlaying)!.isFavorite})
                }}
            >
                {true ? // queueStore.tracks.at(queueStore.nowPlaying)!.isFavorite ?
                    <Favorite sx={{fontSize: props.fontSize === "medium" ? "2rem" : "2.5rem"}}/> :
                    <FavoriteBorderOutlined sx={{fontSize: props.fontSize === "medium" ? "2rem" : "2.5rem"}}/>
                }
            </IconButton>
            <SVGVolumeKnob
                defaultValue={musicVolume()}
                range={rangeCreators.createAccuratePercentageRange()}
                smoothed={true}
                fontSize={props.fontSize}
            />
        </div>
    );
}


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
interface FooterPlayerOptions {

}


export const FooterPlayer: Component<FooterPlayerOptions> = (props) => {
    return (
        <div class={"FooterPlayer"}>
            <TrackInfo/>
            <AudioPlayer/>
            <RightButtonsControls/>
        </div>
    );
};
