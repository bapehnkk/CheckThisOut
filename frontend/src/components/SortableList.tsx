import {Id, useDragDropContext} from "@thisbeyond/solid-dnd";
import {
    DragDropProvider,
    DragDropSensors,
    DragOverlay,
    SortableProvider,
    createSortable,
    closestCenter,
    Draggable,
    Droppable
} from "@thisbeyond/solid-dnd";
import {Component, createEffect, createSignal, For, JSX} from "solid-js";
import {DragEventHandler} from "@thisbeyond/solid-dnd"
import {CardMedia, MenuItem} from "@suid/material";
import {useQueueStore, QueueTrackOptions, getTrackIds, getTrackById} from "../store/AudioPlayer";
import {QueueTrack} from "./Tracks";


const [queueStore, setQueueStore] = useQueueStore();


interface SortableOptions {
    // item: boolean | Node | JSX.ArrayElement | JSX.FunctionElement | Id | null | undefined;
    // index: () => number | boolean | Node | JSX.ArrayElement | JSX.FunctionElement | (string & {}) | null | undefined;
    index: number | boolean | Node | JSX.ArrayElement | JSX.FunctionElement | string | null | undefined;
    track: QueueTrackOptions
}


const Sortable: Component<SortableOptions> = (props) => {
    const sortable = createSortable(props.index as string | number);
    const [state] = useDragDropContext();


    return (
        <div
            use:sortable
            class="sortable"
            classList={{
                // "opacity-25": sortable.isActiveDraggable,
                // "transition-transform": !!state.active.draggable,
            }}
        >
            <QueueTrack {...props.track}/>
        </div>
    );
};


export const SortableVerticalListExample: Component = () => {
    const [items, setItems] = createSignal(getTrackIds());
    const [activeItem, setActiveItem] = createSignal<number | null>(null);
    const ids = () => items();
    const onDragStart: DragEventHandler = ({draggable}) => setActiveItem(draggable.id);

    createEffect(() => {
        queueStore.tracks
        setItems(getTrackIds())
    });


    const onDragEnd: DragEventHandler = ({draggable, droppable}) => {
        if (!draggable || !droppable) return;
        // Выход, если ид не числа
        if (typeof draggable.id !== "number" || typeof droppable.id !== "number") return;

        const fromIndex = queueStore.tracks.findIndex(track => track.id === draggable.id);
        const toIndex = queueStore.tracks.findIndex(track => track.id === droppable.id);

        // Выход, если индексы элементов не найдены или они равны
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

        const updatedTracks = [...queueStore.tracks];
        updatedTracks.splice(toIndex, 0, ...updatedTracks.splice(fromIndex, 1));

        // Обновление id треков и нахождение нового индекса текущего воспроизводимого трека
        let newNowPlayingIndex = queueStore.nowPlaying;
        const updatedTracksWithNewIds = updatedTracks.map((track, index) => {
            if (track.id === queueStore.nowPlaying) {
                newNowPlayingIndex = index;
            }
            return {...track, id: index};
        });

        // Установка обновленных треков и нового индекса для текущего воспроизводимого трека
        setQueueStore({
            tracks: updatedTracksWithNewIds,
            nowPlaying: newNowPlayingIndex
        });

    };

    return (
        <DragDropProvider
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            collisionDetector={closestCenter}
        >
            <DragDropSensors/>
            <div class="column self-stretch">

                <SortableProvider ids={ids()}>
                    <For each={items()}>
                        {(item) => <Sortable track={getTrackById(item)!} index={item}/>}
                    </For>
                </SortableProvider>
            </div>
            <DragOverlay
                class={"sortable top"}>
                {/*{activeItem()}*/}
                {() => {
                    const track = getTrackById(activeItem()!)!;
                    // console.log(track)
                    return (
                        <QueueTrack {...track}/>
                    );
                }}
            </DragOverlay>
        </DragDropProvider>
    );
};