import {Component} from "solid-js";
import {Link} from "@solidjs/router";
import PlayArrowOutlined from "@suid/icons-material/PlayArrowOutlined";
import {FitText} from "./FitText";
import {MasonCardOptions} from "./Tracks";
import {addTrackToQueueStore} from "../context/AudioPlayerContext";
import toast from "solid-toast";


export interface CardOptions {
    url: string,
    image: string,
    title: string,
    subtitle: string
}


const SlideChildren: Component<CardOptions> = (props) => {

    const addTrack = () => {
        addTrackToQueueStore({
            track: "Scar Tissue",
            group: "Red Hot Chili Peppers",
            src: "Red Hot Chili Peppers - Scar Tissue.mp3",
            image: "https://mixdownmag.com.au/wp-content/uploads/2019/05/featured_rhcp.jpg",
            isFavorite: false
        });
        toast('Track Scar Tissue was added to Queue', {
            duration: 5000,
            position: 'top-right',
            // Add a delay before the toast is removed
            // This can be used to time the toast exit animation
            unmountDelay: 500,
            // Styling - Supports CSS Objects, classes, and inline styles
            // Will be applied to the toast container
            style: {
                'background-color': 'var(--stp-background-lighter)',
                'color': 'var(--stp-foreground)',
            },
            icon: 'ⓘ',
            iconTheme: {
                primary: '#fff',
                secondary: '#000',
            },
        });
    };

    return (
        <>
            <img src={props.image} loading="lazy"/>

            <Link href={props.url} class="content" onclick={addTrack}>
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

