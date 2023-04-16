import {Component, createSignal, onCleanup, onMount} from "solid-js";
import {createMasonryBreakpoints, Mason} from "solid-mason";
import {Link} from "@solidjs/router";
import PlayArrowOutlined from "@suid/icons-material/PlayArrowOutlined";
import {FitText} from "./FitText";
import {CardOptions, MasonCard} from "./Cards";
import {fontSizeInPixels} from "../App";

export interface MasonCardOptions {
    id: number;
    width: number;
    height: number;
    card: CardOptions,
}

export const MasonTracks: Component = () => {
    let myMason: HTMLDivElement | undefined;

    const HORIZONTAL_ASPECT_RATIO = [
        {width: 4, height: 4}, // Square
        {width: 4, height: 3}, // Standard Fullscreen
        {width: 16, height: 10}, // Standard LCD
        {width: 16, height: 9}, // HD
        // { width: 37, height: 20 }, // Widescreen
        {width: 6, height: 3}, // Univisium
        {width: 21, height: 9}, // Anamorphic 2.35:1
        // { width: 64, height: 27 }, // Anamorphic 2.39:1 or 2.37:1
        {width: 19, height: 16}, // Movietone
        {width: 5, height: 4}, // 17' LCD CRT
        // { width: 48, height: 35 }, // 16mm and 35mm
        {width: 11, height: 8}, // 35mm full sound
        // { width: 143, height: 100 }, // IMAX
        {width: 6, height: 4}, // 35mm photo
        {width: 14, height: 9}, // commercials
        {width: 5, height: 3}, // Paramount
        {width: 7, height: 4}, // early 35mm
        {width: 11, height: 5}, // 70mm
        {width: 12, height: 5}, // Bluray
        {width: 8, height: 3}, // Super 16
        {width: 18, height: 5}, // IMAX
        {width: 12, height: 3}, // Polyvision
    ];

    const VERTICAL_ASPECT_RATIO = HORIZONTAL_ASPECT_RATIO.map((item) => ({
        width: item.height,
        height: item.width,
    }));

    const ASPECT_RATIO = [
        ...HORIZONTAL_ASPECT_RATIO,
        ...VERTICAL_ASPECT_RATIO,
    ].map((item) => ({
        width: item.width * 50,
        height: item.height * 50,
    }));


    function createNewCard(id: number): MasonCardOptions {
        const randomAspectRatio = ASPECT_RATIO[Math.floor(Math.random() * ASPECT_RATIO.length)];

        return {
            id,
            ...randomAspectRatio,
            card: {
                url: "#",
                image: "https://www.designformusic.com/wp-content/uploads/2018/11/trailer-tension-album-cover-3d-design-1000x1000.jpg",
                title: "Track title",
                subtitle: "Group name"
            }
        };
    }


    const [items, setItems] = createSignal<MasonCardOptions[]>([]);

    function addItems() {
        setItems((current) => {
            const newData = [...current];

            for (let i = 0; i < 20; i += 1) {
                newData.push(
                    createNewCard(newData.length + 1)
                );
            }

            return newData;
        });
        console.log(items())
    }

    function onScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            addItems();
        }
    }

    const setMasonWidth = () => {
        console.log(window.innerWidth);

        if (myMason) {
            if (window.innerWidth > 800) {
                const masonWidth = window.innerWidth - fontSizeInPixels * 12;
                myMason.style.width = masonWidth + "px";
                myMason.style.maxWidth = masonWidth + "px";
            } else {

                myMason.style.width = "100%";
                myMason.style.maxWidth = "100%";
            }
        }
    };

    onMount(() => {
        addItems();

        document.addEventListener('scroll', onScroll, {
            passive: true,
        });

        onCleanup(() => {
            document.removeEventListener('scroll', onScroll);
        });

        setMasonWidth();
        window.addEventListener('resize', setMasonWidth);
    });

    const breakpoints = createMasonryBreakpoints(() => [
        {query: '(min-width: 1536px)', columns: 6},
        {query: '(min-width: 1280px) and (max-width: 1536px)', columns: 5},
        {query: '(min-width: 1024px) and (max-width: 1280px)', columns: 4},
        {query: '(min-width: 768px) and (max-width: 1024px)', columns: 3},
        {query: '(max-width: 768px)', columns: 2},
    ]);


    return (
        <div
            class={"myMason"}
            ref={myMason}
        >
            <Mason
                columns={breakpoints()}
                items={items()}
                class={"mason"}
                id={"mason"}
            >
                {(item) => (

                    <MasonCard {...item}/>
                )}
            </Mason>
        </div>
    );
};