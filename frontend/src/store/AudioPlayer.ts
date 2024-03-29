import {createStore} from 'solid-js/store';
import axios from "axios";
import {onMount} from "solid-js";

interface AudioPlayerState {
    audioSrc: string | null;
}

const [audioPlayerStore, setAudioPlayerStore] = createStore<AudioPlayerState>({
    audioSrc: null,
});

export function useAudioPlayerStore() {
    return [audioPlayerStore, setAudioPlayerStore] as const;
}

export function setAudioSrc(src: string | null) {
    setAudioPlayerStore('audioSrc', src);
}

export interface UserOptions {
    id: number;
    email: string;
    username: string;
    full_name: string;
    phone: string;
    image: string | null;
    language: string;
}



export interface ImageOptions {
    id: number;
    title: string;
    image_file: string;
    image_type: "art" | "logo";
    user: number;
}

export interface BandOptions {
    id: number;
    title: string;
    description: string;
    musicians: number[];
    images: ImageOptions[];
}

export interface AlbumOptions {
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
    images: ImageOptions[];
}

interface ClipOptions {
    clip_url: string | null;
    clip_file: string | null;
}

export interface QueueTrackOptions {
    id: number;
    uuid: string;
    title: string;
    description: string;
    lyrics: string;
    music_file: string;
    liner_notes: string;
    release_date: string;
    update_date: string;
    user: UserOptions;
    album: AlbumOptions;
    tags: string[];
    musicians: UserOptions[];
    bands: BandOptions[];
    images: ImageOptions[];
    clips: ClipOptions[];
    comments: any[];
}


export interface QueueOptions {
    nowPlaying: number,
    musicVolume: number,    // 1>= musicVolume >= 0
    playing: boolean,
    repeat: "no" | "queue" | "track",
    tracks: QueueTrackOptions[],
    audio: HTMLAudioElement,
    audioTime: number
}


const [queueStore, setQueueStore] = createStore<QueueOptions>({
    nowPlaying: -1,
    musicVolume: 0.7,
    playing: false,
    repeat: "no",
    audio: new Audio(),
    tracks: [],
    audioTime: 0
});
const fetchTracks = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/tracks/');
        console.log(response.data)
        setQueueStore("tracks", response.data.results)
    } catch (error) {
        console.error('Error fetching tracks:', error);
    }
};
onMount(async () => {
    queueStore.audio.preload = "metadata";
    await fetchTracks();
    console.log(queueStore)
});

export function useQueueStore() {
    return [queueStore, setQueueStore] as const;
}

export function addTrackToQueueStore(track: Partial<QueueTrackOptions>) {
    if (track.id === undefined || queueStore.tracks.some(existingTrack => existingTrack.id === track.id)) {
        const maxId = queueStore.tracks.reduce((max, currTrack) => Math.max(max, currTrack.id), -1);
        track.id = maxId + 1;
    }

    setQueueStore('tracks', [...queueStore.tracks, track as QueueTrackOptions]);
}


export function editTrackById(id: number, updatedTrack: Partial<QueueTrackOptions>) {
    setQueueStore('tracks', queueStore.tracks.map(track => track.id === id ? {...track, ...updatedTrack} : track));
}

export const toggleRepeatType = () => {
    switch (queueStore.repeat) {
        case "track":
            setQueueStore("repeat", "no")
            break;
        case "queue":
            setQueueStore("repeat", "track")
            break;
        case "no":
            setQueueStore("repeat", "queue")
            break;
    }
};

export const shuffleTracks = () => {
    const shuffledTracks = [...queueStore.tracks].sort(() => Math.random() - 0.5);

    const updatedTracks = shuffledTracks.map((track, index) => {
        return {...track, id: index};
    });

    setQueueStore('tracks', updatedTracks);
    setQueueStore('nowPlaying', 0);
};
export const getTrackIds = (): number[] => {
    return queueStore.tracks.map(track => track.id);
};
export const getTrackById = (id: number): QueueTrackOptions | undefined => {
    // return queueStore.tracks.find(track => track.id === id);
    return queueStore.tracks.at(id);
};

