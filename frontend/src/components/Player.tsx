import {Component, createSignal, onMount, onCleanup, createEffect} from "solid-js";
import {IconButton} from "@suid/material";
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


import FavoriteBorderOutlined from "@suid/icons-material/FavoriteBorderOutlined";
import Favorite from "@suid/icons-material/Favorite";
import PlaylistPlay from "@suid/icons-material/PlaylistPlay";
import VolumeUp from "@suid/icons-material/VolumeUp";

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
interface AudioPlayerProps {
    src: string;
}

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer: Component<AudioPlayerProps> = (props) => {
    const [audio] = createSignal(new Audio(props.src));
    const [duration, setDuration] = createSignal(0);
    const [currentTime, setCurrentTime] = createSignal(0);
    const [playing, setPlaying] = createSignal(false);
    const [mouseDown, setMouseDown] = createSignal(false);

    createEffect(() => {
        audio().addEventListener('loadedmetadata', () => {
            setDuration(audio().duration);
        });

        audio().addEventListener('timeupdate', () => {
            setCurrentTime(audio().currentTime);
        });

        return onCleanup(() => {
            audio().pause();
        });
    });

    const togglePlayPause = () => {
        if (playing()) {
            audio().pause();
        } else {
            audio().play();
        }
        setPlaying(!playing());
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

    return (
        <div class={"audio-progress"}>
            <button onClick={togglePlayPause}>{playing() ? 'Stop' : 'Play'}</button>

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
//
// interface AudioProgressOptions {
//     progress: number,
//     duration: number,
// }
//
// export const AudioProgress: Component<AudioProgressOptions> = (props) => {
//     return (
//         <div class={"audio-progress"}>
//             <div class={"audio-progress__progress"}>0:00</div>
//             <div class={"audio-progress__progress-bar"}></div>
//             <div class={"audio-progress__duration"}>0:00</div>
//         </div>
//     );
// }
//
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


interface TrackInfoOptions {
    track: string,
    group: string,
    image: string
}

export const TrackInfo: Component<TrackInfoOptions> = (props) => {
    return (
        <>
            <img src={props.image} alt={""}/>
            <div>{props.track}</div>
            <div>{props.group}</div>
        </>
    );
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

interface SVGVolumeKnobProps {
    range: Range;
    defaultValue: number;
    smoothed?: boolean;
}

function SVGVolumeKnob(props: SVGVolumeKnobProps) {
    const [value, setValue] = createSignal(props.defaultValue);

    const normalisedValue = () => rangeFunctions.toNormalised(props.range, value());

    const smoothedValue = createSmoothedValue(normalisedValue, 0.7);

    const baseAngle = 135;
    return (
        <>
            <Control
                defaultValue={props.defaultValue}
                range={props.range}
                value={value()}
                onGestureStart={() => console.log('Started change gesture.')}
                onGestureEnd={() => console.log('Ended change gesture.')}
                onChange={setValue}>
                <svg style="width: 4rem; position: releative;" viewBox="0 0 100 100">
                    <circle cx={50} cy={50} r={28} fill="var(--stp-background-lighter)"/>
                    <VolumeUp
                        x={30}
                        y={30} class={"VolumeControlIcon"}/>
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
                value={value()}
                onChange={setValue}/>
        </>
    );
}

interface QueueTrack {
    track: string,
    group: string,
    image: string
}

interface Queue {
    nowReproduced: number,
    tracks: QueueTrack[]
}

interface RightButtonsControlsOptions {
    queue: Queue,
    isFavorite: boolean,
    volume: number
}

export const RightButtonsControls: Component<RightButtonsControlsOptions> = (props) => {
    return (
        <div class={"right-buttons-controls"}>

            <IconButton
                title="Show queue"
            >
                <PlaylistPlay sx={{fontSize: "2.5rem"}}/>
            </IconButton>
            <IconButton
                title="Add to favorite"
            >
                <FavoriteBorderOutlined sx={{fontSize: "2.5rem"}}/>
            </IconButton>
            <SVGVolumeKnob
                defaultValue={props.volume}
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
            FooterPlayer
            <AudioPlayer src="Pnevmoslon_-_Po_bumagam_vsjo_pizdato_(musmore.com).mp3"/>
            <RightButtonsControls
                queue={{

                    nowReproduced: 0,
                    tracks: []
                }}
                isFavorite={false}
                volume={0.5}
            />
        </div>
    );
};
