import {Component, createSignal, onCleanup} from "solid-js";
import {Header} from "../components/Header";
import {Footer} from "../components/Footer";
import {setAudioSrc, useAudioPlayerStore} from "../context/AudioPlayerContext";
import {SortableVerticalListExample} from "../components/SortableList";


const TrackScreen: Component = () => {
    const [audioPlayerStore, setAudioPlayerStore] = useAudioPlayerStore();
    setAudioSrc(audioPlayerStore.audioSrc);

    onCleanup(() => {
        // setAudioSrc(null);
    });


    return (
        <>
            <div class="container">
                <h1>Track</h1>
                <SortableVerticalListExample/>

            </div>
        </>
    );
};


export default TrackScreen;