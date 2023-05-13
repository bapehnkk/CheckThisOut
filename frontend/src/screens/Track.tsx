import {createEffect, createSignal} from "solid-js";
import {useParams} from "@solidjs/router";
import axios from "axios";
import RedButton from "../components/Buttons";
import Visualizer from "../components/Visualizer";
import {setAudioSrc, useQueueStore} from "../store/AudioPlayer";

interface TrackType {
    id: string;
    title: string;
    description: string;
    music_file: string;
    liner_notes: string;
    release_date: string;
    update_date: string;
    user: {
        id: number;
        email: string;
        username: string;
        full_name: string;
        phone: string;
        image: string | null;
        language: string;
    };
    album: {
        id: number;
        album_type: string;
        title: string;
        description: string;
        critical_receptions: string;
        record_label: string;
        liner_notes: string;
        release_date: string;
        update_date: string;
        tracks: string[];
        credentials: any[];
        comments: any[];
    };
    tags: {
        id: number;
        title: string;
        user: number;
    }[];
    musicians: {
        id: number;
        email: string;
        username: string;
        full_name: string;
        phone: string;
        image: string | null;
        language: string;
    }[];
    bands: {
        id: number;
        title: string;
        description: string;
        musicians: number[];
        images: number[];
    }[];
    images: {
        id: number;
        title: string;
        image_file: string;
        user: number;
    }[];
    comments: any[];
}


const Track = () => {
    const [queueStore, setQueueStore] = useQueueStore();
    const [track, setTrack] = createSignal<TrackType | null>(null);
    const params = useParams();

    createEffect(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/tracks/${params.trackId}/`);
            console.log(response.data)
            setTrack(response.data);
        } catch (error) {
            console.error("Error fetching track:", error);
        }
    });

    return (
        <div class="container">
            <div
                class="preview-container"
                style={`background: linear-gradient(0deg, rgba(59, 66, 82, 0.9), rgba(59, 66, 82, 0.9)), url(${track()?.images.map(image => image?.image_file)});`}
            >
                <div class="preview-container__about">
                    {queueStore.tracks.at((queueStore.nowPlaying))!.music_file &&
                        <Visualizer/>
                    }

                    <div class="column">
                        <RedButton/>
                        <RedButton/>
                        <RedButton/>
                        <div>aaaaaaaaaaaaa</div>
                    </div>

                </div>
                <div class="album">
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                    <div>aaaaaaaaaaaaa</div>
                </div>


            </div>


            {track() ? (
                <div>
                    <h1>{track()!.title}</h1>
                    <p>Description: {track()!.description}</p>
                    <p>Release Date: {track()!.release_date}</p>
                    <p>Album: {track()!.album.title}</p>
                    <h2>Authors:</h2>
                    <p>Tags: {track()!.tags.map((tag) => tag.title).join(", ")}</p>
                    <p>Musicians: {track()!.musicians.map((musician) => musician.username).join(", ")}</p>
                    <p>Bands: {track()!.bands.map((band) => band.title).join(", ")}</p>
                    {/* ... другие поля */}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Track;
