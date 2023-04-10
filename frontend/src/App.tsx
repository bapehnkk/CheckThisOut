import type {Component, ParentComponent} from 'solid-js';
import Header from "./components/Header";

import {red} from "@suid/material/colors";
import {Theme, createTheme, ThemeProvider} from "@suid/material/styles";
import {createMemo, createSignal, onMount, createContext, useContext, onCleanup,} from "solid-js";

import {Transition} from "solid-transition-group";
import AppRoutes from "./router";

export const [mode, setMode] = createSignal<"dark" | "light">("dark");
import {Mason, createMasonryBreakpoints} from 'solid-mason';


export const toggleTheme = () => {
    setMode(mode() === "light" ? "dark" : "light"); // Переключаем тему между светлой и темной
    // console.log(mode())

    // console.log(theme())
};

interface GetThemeAppOptions {
    mode: "dark" | "light" | undefined
}

import Input from "@suid/material/Input";


const GetThemeApp: ParentComponent<GetThemeAppOptions> = (props) => {
    return (
        createMemo(
            () => {
                const themeMode = props.mode;

                return (
                    <ThemeProvider theme={(
                        createTheme({
                            palette: {
                                mode: themeMode,
                                primary: {
                                    // Purple and green play nicely together.
                                    main: red[300],
                                    contrastText: themeMode === "dark" ? "#110000" : "#FFFFF5"
                                },
                                secondary: {
                                    // This is green.A700 as hex.
                                    main: "rgba(0,0,0,0)",
                                },
                                error: {
                                    main: red[300],
                                    contrastText: themeMode === "dark" ? "#110000" : "#FFFFF5"

                                }

                            },
                        })
                    )}>
                        {/*mode = {props.mode}*/}
                        {props.children}
                    </ThemeProvider>
                )
            }
        )
    );
};
const App: Component = () => {

    onMount(async () => {

        let isScrolling: any;
        window.addEventListener('scroll', function (event) {
            const root = document.documentElement;
            if (root) {
                root.style.setProperty("--scroll-bar-color", "rgba(96, 96, 96, 1)");
            }
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(function () {
                if (root) {
                    root.style.setProperty("--scroll-bar-color", "rgba(96, 96, 96, 0.3)");
                }
            }, 66);
        }, false);
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

    interface Item {
        id: number;
        width: number;
        height: number;
    }

    function createNewImage(id: number): Item {
        const randomAspectRatio = ASPECT_RATIO[Math.floor(Math.random() * ASPECT_RATIO.length)];

        return {
            ...randomAspectRatio,
            id,
        };
    }

    interface Item {
        id: number;
        width: number;
        height: number;
    }

    const [items, setItems] = createSignal<Item[]>([]);

    function addItems() {
        setItems((current) => {
            const newData = [...current];

            for (let i = 0; i < 20; i += 1) {
                newData.push(createNewImage(newData.length + 1));
            }

            return newData;
        });
    }

    function onScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            addItems();
        }
    }

    onMount(() => {
        addItems();

        document.addEventListener('scroll', onScroll, {
            passive: true,
        });

        onCleanup(() => {
            document.removeEventListener('scroll', onScroll);
        });
    });

    const breakpoints = createMasonryBreakpoints(() => [
        {query: '(min-width: 1536px)', columns: 6},
        {query: '(min-width: 1280px) and (max-width: 1536px)', columns: 5},
        {query: '(min-width: 1024px) and (max-width: 1280px)', columns: 4},
        {query: '(min-width: 768px) and (max-width: 1024px)', columns: 3},
        {query: '(max-width: 768px)', columns: 2},
    ]);

    return (
        <>

            <GetThemeApp
                mode={mode()}
            >
                <Transition
                    onBeforeEnter={(el: any) => (el.style.opacity = 0)}
                    onEnter={(el, done) => {
                        const a = el.animate([{opacity: 0}, {opacity: 1}], {
                            duration: 300
                        });
                        a.finished.then(done);
                    }}
                    onAfterEnter={(el: any) => (el.style.opacity = 1)}
                    onExit={(el, done) => {
                        const a = el.animate([{opacity: 1}, {opacity: 0}], {
                            duration: 300
                        });
                        a.finished.then(done);
                    }}
                >
                    <AppRoutes/>
                </Transition>
            </GetThemeApp>


            {/*<Mason*/}
            {/*    columns={breakpoints()}*/}
            {/*    items={items()}*/}
            {/*    id={"mason"}*/}
            {/*>*/}
            {/*    {(item) => (*/}
            {/*        <div class="w-full p-2">*/}
            {/*            <div class="parent rounded-xl overflow-hidden"*/}
            {/*                 style={{'aspect-ratio': `${item.width}/${item.height}`}}>*/}
            {/*                <div*/}
            {/*                    class="child flex items-center justify-center"*/}
            {/*                    style={{*/}
            {/*                        'background-image': `url(https://picsum.photos/id/${item.id}/${item.width}/${item.height}/)`,*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    <span class="font-semibold text-lg text-white">{`Image no. ${item.id}`}</span>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</Mason>*/}
            {/*<img*/}
            {/*    class="invert-safe--light"*/}
            {/*    src="https://i.etsystatic.com/6530391/r/il/043640/2308096487/il_1080xN.2308096487_hpme.jpg"*/}
            {/*/>*/}
            {/*<img*/}
            {/*    class="invert-safe--dark"*/}
            {/*    src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a5d2baa3-9fa5-485f-bd73-b2235d902157/degy3a4-123e43e5-78b8-4d8a-8393-d8350ff6f188.png/v1/fill/w_397,h_250,q_70,strp/reflection_by_pinlin_degy3a4-250t.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTY3IiwicGF0aCI6IlwvZlwvYTVkMmJhYTMtOWZhNS00ODVmLWJkNzMtYjIyMzVkOTAyMTU3XC9kZWd5M2E0LTEyM2U0M2U1LTc4YjgtNGQ4YS04MzkzLWQ4MzUwZmY2ZjE4OC5wbmciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.-KVZRxswjzcCjtGoo3l-hfyZYhgGTBZrcVm-St97D-M"*/}
            {/*/>*/}
            {/*<img*/}
            {/*    class="invert-safe--dark"*/}
            {/*    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCGC7kdPaNR-4kHX2Cx2hPMxrpyomNa-juP-FxaAAu5jY94Q3SmAKBBYyTQmK92eElVtg&usqp=CAU"*/}
            {/*/>*/}
            {/*<img*/}
            {/*    class="invert-safe--light"*/}
            {/*    src="https://outschool.com/_next/image?url=https%3A%2F%2Fprocess.filepicker.io%2FAPHE465sSbqvbOIStdwTyz%2Frotate%3Ddeg%3Aexif%2Fresize%3Dfit%3Acrop%2Cheight%3A372%2Cwidth%3A586%2Foutput%3Dquality%3A80%2Ccompress%3Atrue%2Cstrip%3Atrue%2Cformat%3Ajpg%2Fcache%3Dexpiry%3Amax%2Fhttps%3A%2F%2Fcdn.filestackcontent.com%2FwjIh58HTBSbjmnYto6ym&w=640&q=75"*/}
            {/*/>*/}
        </>
    );
};

export default App;
