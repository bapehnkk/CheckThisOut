import {
    ParentComponent,
    createSignal,
    onMount,
    onCleanup,
    createEffect,
    createMemo,
    Component,
    JSXElement,
    For,
    useTransition,
    Match,
    Switch,
    Suspense
} from "solid-js";

import Circle from "@suid/icons-material/Circle";
import CircleOutlined from "@suid/icons-material/CircleOutlined";


interface TabsDottedOptions {
    tabs: JSXElement[]
}

export const TabsDotted: Component<TabsDottedOptions> = (props) => {
    const [tabOpen, setTabOpen] = createSignal(0);
    const [pending, start] = useTransition();
    let swiperEl;

    const updateTab = (index: number) => () => start(() => {
        setTabOpen(index);
        setSlide();
    });


    const onProgress = (e) => {
        const [swiper, progress] = e.detail;
        setTabOpen(Math.round(progress))
        // console.log(progress)
    };

    const setSlide = () => {

        const swiper = swiperEl.swiper;
        swiper.slideTo(tabOpen(), 500, false);
    };

    onMount(() => {
        swiperEl = document.querySelector('swiper-container#tabs-dotted')!;

        Object.assign(swiperEl, {
            slidesPerView: 1,
            virtual: {
                slides: (() => props.tabs)(),
            },
        });
        if (swiperEl.initialize) {
            swiperEl.initialize();
        } else {
            console.error('swiperEl.initialize is not a function');
        }
    })

    return (
        <div class={"tabs-dotted"}>
            <div class="tabs-dotted__tab" classList={{pending: pending()}}>
                <swiper-container id={"tabs-dotted"} onProgress={onProgress} init="false">
                    <For each={props.tabs}>{(tab, index) =>
                        <swiper-slide>
                            {tab}
                        </swiper-slide>
                    }</For>
                </swiper-container>

            </div>

            <ul>
                <For each={props.tabs}>{(_, index) =>
                    <li onClick={updateTab(index())}>
                        {tabOpen() === index() ?
                            <Circle fontSize={"medium"}/> :
                            <CircleOutlined fontSize={"medium"}/>
                        }
                    </li>
                }</For>
            </ul>
        </div>
    );
};

export default TabsDotted;