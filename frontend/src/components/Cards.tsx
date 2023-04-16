import {Component} from "solid-js";
import {Link} from "@solidjs/router";
import PlayArrowOutlined from "@suid/icons-material/PlayArrowOutlined";
import {FitText} from "./FitText";
import {MasonCardOptions} from "./Tracks";



export interface CardOptions {
    url: string,
    image: string,
    title: string,
    subtitle: string
}




const SlideChildren: Component<CardOptions> = (props) => {


    return (
        <>
            <img src={props.image} loading="lazy"/>

            <Link href={props.url} class="content">
                <div class="content-btn">
                    <PlayArrowOutlined fontSize={"large"}/>
                </div>

                <div class="content-description">
                    <FitText text={props.title} class="content-description__title"/>
                    <FitText text={props.subtitle} class="content-description__subtitle"/>
                </div>
            </Link>
        </>
    );
};

export const SwiperCard: Component<CardOptions> = (props) => {
    return (
        <>
            <swiper-slide lazy="true" class={"card-play"}>
                <SlideChildren {...props}/>
            </swiper-slide>
        </>
    );
};


export const MasonCard: Component<MasonCardOptions> = (props) => {
    return (
        <>
            <div
                class="card-play mason__parent"
                style={{'aspect-ratio': `${props.width}/${props.height}`}}>
                <SlideChildren {...props.card}/>
            </div>
        </>
    );
};

