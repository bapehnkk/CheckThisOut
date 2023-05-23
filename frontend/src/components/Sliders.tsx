import {Component, createSignal, onMount} from "solid-js";
import {register} from 'swiper/element/bundle';

register();
import PlayArrowOutlined from "@suid/icons-material/PlayArrowOutlined";
import {Link} from "@solidjs/router";
import {FitText} from "./FitText";
import {CardOptions, SwiperCard} from "./Cards";

export interface LinksSliderOptions {
    id: string,
    slides: CardOptions[]
}

export const LinksSlider: Component<LinksSliderOptions> = (props) => {
    const [slidesPerViewCount, setSlidesPerViewCount] = createSignal(window.innerWidth / 200);
    window.addEventListener("resize", () => {
        setSlidesPerViewCount(window.innerWidth / 200)
    });


    onMount(() => {
        const swiperEl = document.querySelector(`swiper-container#${props.id}`)!;

        const params = {
            // array with CSS styles
            injectStyles: [
                `
                .swiper-button-next,
                .swiper-button-prev {
                    background-color: white;
                    padding: 8px 16px;
                    border-radius: 50%;
                    color: red;
                    opacity: 0.5;
                    
                    filter: blur(0.5px);
                    transition: all .3s ease;
                }
                .swiper-button-next::before,
                .swiper-button-next::after,
                .swiper-button-prev::before,
                .swiper-button-prev::after {
                    color: #BF616A;
                    font-size: 1.5rem;
                    font-weight: bolder;
                }
                
                .swiper-button-next:hover,
                .swiper-button-prev:hover {
                    opacity: 1;
                    filter: blur(0);
                }
                .swiper-button-disabled {
                    opacity: 0 !important;
                }
                `
            ],
        };

        Object.assign(swiperEl, params);

        // @ts-ignore
        swiperEl.initialize();
    });


    return (
        <>
            <swiper-container
                id={props.id}
                slides-per-view={slidesPerViewCount()}
                space-between="30"
                navigation="true"
                init={false}
            >
                <For each={props.slides}>
                    {(slide, i) =>
                        <SwiperCard {...slide}/>
                    }
                </For>
            </swiper-container>

        </>
    );
}



interface ImageSliderOptions {
    images: string[];
}

export const ImageSlider: Component<ImageSliderOptions> = (props) => {

    return (
        <div  class={"image-slider"} >
            <swiper-container style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff" class="mySwiper"
                              thumbs-swiper=".mySwiper2" space-between="10" navigation="true">
                <For each={props.images}>
                    {(image, i) =>
                        <swiper-slide>
                            <img src={image}/>
                        </swiper-slide>
                    }
                </For>
            </swiper-container>


            <swiper-container class="mySwiper2" space-between="10" slides-per-view="4" free-mode="true"
                              watch-slides-progress="true">
                <For each={props.images}>
                    {(image, i) =>
                        <swiper-slide>
                            <img src={image}/>
                        </swiper-slide>
                    }
                </For>
            </swiper-container>
        </div>
    );
}