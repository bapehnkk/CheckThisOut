import {createSignal, For, onMount} from 'solid-js';
import {Link} from '@solidjs/router';
import axios from 'axios';
import {QueueTrackOptions} from "../store/AudioPlayer";

export const TrackList = () => {
    const [tracks, setTracks] = createSignal<QueueTrackOptions[]>([]);

    const fetchTracks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/tracks/');
            setTracks(response.data);
        } catch (error) {
            console.error('Error fetching tracks:', error);
        }
    };

    onMount(async () => {
        await fetchTracks()
    });

    return (
        <div>
            <h1>Tracks:</h1>
            <br/>
            <ul>
                {tracks().map((track) => (
                    <li key={track.id}>
                        <Link href={`/track/${track.uuid}`}>{track.title}</Link>
                        <div>Author: {track.musicians.length > 0 ? track.musicians[0].username : (track.bands.length > 0 ? track.bands[0].title : "Unknown")}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrackList;