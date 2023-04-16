import type {Component, ParentComponent} from 'solid-js';

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

export const [asideType, setAsideType] = createSignal<"full" | "compact">("compact");
export const toggleAsideType = () => {
    asideType() === "full" ? setAsideType("compact") : setAsideType("full");
    const root = document.documentElement;
    root.style.setProperty('--root-padding', asideType() === "full" ? "11rem" : "4rem");
};
export const fontSizeInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);


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
                                    main: themeMode === "dark" ? "#ECEFF4" : "#2C313D",
                                    contrastText: red[300]
                                },
                                secondary: {
                                    // This is green.A700 as hex.
                                    main: "rgba(0,0,0,0)",
                                },
                                error: {
                                    main: red[300],
                                    contrastText: themeMode === "dark" ? "#2C313D" : "#ECEFF4"

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
        (() => {
            const root = document.documentElement;
            root.style.setProperty("--scroll-bar-color", "rgba(96, 96, 96, 0.3)");
        })();

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
            }, 100);
        }, false);
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


    return (
        <>
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

            </Transition>
            <GetThemeApp
                mode={mode()}
            >
                <AppRoutes/>

            </GetThemeApp>


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
