import {Component, createSignal, onMount, onCleanup, createEffect, createMemo} from "solid-js";
import {Badge, Button, CardMedia, Divider, IconButton, Menu, MenuItem, Toolbar, Typography} from "@suid/material";
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
} from "../context/AudioPlayerContext";


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

import OpenInNewOutlined from "@suid/icons-material/OpenInNewOutlined";
import MoreHoriz from "@suid/icons-material/MoreHoriz";

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

const [musicVolume, setMusicVolume] = createSignal(0.7);

const [audioPlayerStore, setAudioPlayerStore] = useAudioPlayerStore();
const [queueStore, setQueueStore] = useQueueStore();

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer: Component = () => {
    const Song = new Audio();
    const setSongSrc = (src: string) => {
        Song.src = src
    };

    const [audio] = createSignal(Song);

    const [duration, setDuration] = createSignal(0);
    const [currentTime, setCurrentTime] = createSignal(0);
    const [mouseDown, setMouseDown] = createSignal(false);

    const togglePlayPause = () => {
        if (queueStore.playing) {
            audio().pause();
        } else {
            audio().play();
        }
        setQueueStore({
            playing: !queueStore.playing
        })
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
    };

    const prevTrack = () => {
        setQueueStore({
            nowPlaying: queueStore.nowPlaying === 0 ? queueStore.tracks.length - 1 : queueStore.nowPlaying - 1
        });
    };

    const nextTrack = () => {
        setQueueStore({
            nowPlaying: queueStore.nowPlaying === queueStore.tracks.length - 1 ? 0 : queueStore.nowPlaying + 1
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
            console.log('end');
            // if (queueStore.repeat === "track") {
            //     audio().play();
            // } else if (queueStore.repeat === "queue") {
            //     nextTrack();
            // } else if (queueStore.repeat === "no" && queueStore.nowPlaying !== queueStore.tracks.length - 1) {
            //     nextTrack();
            // }
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
                        setQueueStore({playing: false});
                    }
                    break;
            }

        });


        return onCleanup(() => {
            audio().pause();
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
        setSongSrc(queueStore.tracks.at(queueStore.nowPlaying)!.src);

        createEffect(() => {
            setSongSrc(queueStore.tracks.at(queueStore.nowPlaying)!.src);
        });
    })


    return (
        <div class={"audio-progress"}>
            <div class="audio-progress__controls-btns">
                <div class="row">
                    <IconButton
                        title={"Open trackpage"}
                        size={"small"}
                    >
                        <OpenInNewOutlined/>
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
                            queueStore.repeat === "queue" ? <RepeatOutlined/> : <RepeatOutlined/>
                        }

                    </IconButton>
                </div>
                <div class="row">
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
            <div class={queueStore.playing ? "track-info__image" : "track-info__image pause"}>
                <img src={queueStore.tracks.at(queueStore.nowPlaying)!.image} alt={""}/>
            </div>
            <div class="track-info__text">
                <h3 title={queueStore.tracks.at(queueStore.nowPlaying)!.track}>{queueStore.tracks.at(queueStore.nowPlaying)!.track}</h3>
                <p title={queueStore.tracks.at(queueStore.nowPlaying)!.group}>{queueStore.tracks.at(queueStore.nowPlaying)!.group}</p>
            </div>
        </div>
    );
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
const FooterQueue: Component = () => {
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
                <PlaylistPlay sx={{fontSize: "2.5rem"}}/>
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
                        width: "40ch"
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

                <MenuItem sx={{height: "3rem", padding: "0"}}>
                    <Toolbar sx={{width: "100%", height: "2rem"}}>
                        <Typography variant="body1" component="div" class={"row start"}
                                    sx={{flexGrow: 1, fontSize: "1.2rem", gap: "1rem"}}>
                            <PlaylistPlay sx={{fontSize: "2.5rem"}}/>
                            Queue
                        </Typography>


                        <IconButton
                            title={"Play/Stop"}
                            onClick={() => {
                                setQueueStore({
                                    playing: !queueStore.playing
                                })
                            }}
                            size={"small"}
                        >
                            {queueStore.playing ?
                                <PauseOutlined sx={{fontSize: "2rem"}}/> :
                                <PlayArrowOutlined sx={{fontSize: "2rem"}}/>
                            }

                        </IconButton>
                    </Toolbar>
                </MenuItem>
                <Divider/>
                {queueStore.tracks.map((track) => (
                    <MenuItem
                        selected={track.id === queueStore.nowPlaying}
                        onClick={() => {
                            setQueueStore({nowPlaying: track.id})
                        }}
                    >
                        <div class="row start">
                            <CardMedia
                                component="img"
                                sx={{
                                    width: "2.5rem",
                                    height: "2.5rem",
                                    borderRadius: "50%",
                                    mr: "1rem"
                                }}
                                image={track.image}
                                alt="Live from space album cover"
                            />
                            <div class="column start-start">
                                <div>{track.track}</div>
                                <div>{track.group}</div>
                            </div>
                        </div>
                        <div class="row">
                        </div>
                    </MenuItem>

                ))}
            </Menu>
        </>
    );
};


interface SVGVolumeKnobProps {
    range: Range;
    defaultValue: number;
    smoothed?: boolean;
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
                <svg style="width: 4rem; position: releative;" viewBox="0 0 100 100">
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


export const RightButtonsControls: Component = (props) => {

    return (
        <div class={"right-buttons-controls"}>
            <FooterQueue/>
            <IconButton
                title="Add to favorite"
                onClick={() => {
                    editTrackById(queueStore.nowPlaying, {isFavorite: !queueStore.tracks.at(queueStore.nowPlaying)!.isFavorite})
                }}
            >
                {queueStore.tracks.at(queueStore.nowPlaying)!.isFavorite ?
                    <Favorite sx={{fontSize: "2.5rem"}}/> :
                    <FavoriteBorderOutlined sx={{fontSize: "2.5rem"}}/>
                }
            </IconButton>
            <SVGVolumeKnob
                defaultValue={musicVolume()}
                range={rangeCreators.createAccuratePercentageRange()}
                smoothed={true}
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
