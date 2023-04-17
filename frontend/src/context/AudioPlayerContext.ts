import {createStore} from 'solid-js/store';

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

export interface QueueTrackOptions {
    id: number,
    track: string,
    group: string,
    image: string,
    src: string,
    isFavorite: boolean
}

export interface QueueOptions {
    nowPlaying: number,
    musicVolume: number,    // 1>= musicVolume >= 0
    playing: boolean,
    repeat: "no" | "queue" | "track",
    tracks: QueueTrackOptions[]
}


const [queueStore, setQueueStore] = createStore<QueueOptions>({
    nowPlaying: 0,
    musicVolume: 0.7,
    playing: false,
    repeat: "no",
    tracks: [
        {
            id: 0,
            track: "Scar Tissue",
            group: "Red Hot Chili Peppers",
            src: "Red Hot Chili Peppers - Scar Tissue.mp3",
            image: "https://mixdownmag.com.au/wp-content/uploads/2019/05/featured_rhcp.jpg",
            isFavorite: true
        },
        {
            id: 1,
            track: "Парень и леший",
            group: "Король и Шут",
            src: "KiSh_leshij.mp3",
            image: "https://i.ytimg.com/vi/nZ7utVUZTkQ/maxresdefault.jpg",
            isFavorite: true
        },
        {
            id: 2,
            track: "По бумагам всё пиздато",
            group: "ПНЕВМОСЛОН",
            src: "Pnevmoslon_-_Po_bumagam_vsjo_pizdato_(musmore.com).mp3",
            image: "https://is2-ssl.mzstatic.com/image/thumb/Music123/v4/db/89/63/db896313-cdde-85b7-4d41-165861946644/859736485656_cover.jpg/1200x1200bf-60.jpg",
            isFavorite: true
        },
    ]
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
            setQueueStore({repeat: "no"})
            break;
        case "queue":
            setQueueStore({repeat: "track"})
            break;
        case "no":
            setQueueStore({repeat: "queue"})
            break;
    }
};

export const shuffleTracks = () => {
  const shuffledTracks = [...queueStore.tracks].sort(() => Math.random() - 0.5);

  const updatedTracks = shuffledTracks.map((track, index) => {
    return { ...track, id: index };
  });

  setQueueStore('tracks', updatedTracks);
};
