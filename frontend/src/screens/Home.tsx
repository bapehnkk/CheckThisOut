import {Component, createSignal, onMount} from "solid-js";
import {Header} from "../components/Header";
import {LinksSlider} from "../components/Sliders";
import {Link} from "@solidjs/router";
import {CardOptions} from "../components/Cards"
import {MasonTracks} from "../components/Tracks"
import {Footer} from "../components/Footer";

export const HomeScreen: Component = () => {

    const newAlbums: CardOptions[] = [
        {
            url: "#",
            image: "https://i.ytimg.com/vi/BgfjN6QaQHA/maxresdefault.jpg",
            title: "Контрэволюция",
            subtitle: "Пневмослон"
        },
        {
            url: "#",
            image: "https://www.designformusic.com/wp-content/uploads/2018/11/trailer-tension-album-cover-3d-design-1000x1000.jpg",
            title: "Album cover design",
            subtitle: "CD cover artisit"
        },
        {
            url: "#",
            image: "https://i.ytimg.com/vi/BgfjN6QaQHA/maxresdefault.jpg",
            title: "Контрэволюция",
            subtitle: "Пневмослон"
        },
        {
            url: "#",
            image: "https://www.designformusic.com/wp-content/uploads/2018/11/trailer-tension-album-cover-3d-design-1000x1000.jpg",
            title: "Album cover design",
            subtitle: "CD cover artisit"
        },
        {
            url: "#",
            image: "https://i.ytimg.com/vi/BgfjN6QaQHA/maxresdefault.jpg",
            title: "Контрэволюция",
            subtitle: "Пневмослон"
        },
        {
            url: "#",
            image: "https://www.designformusic.com/wp-content/uploads/2018/11/trailer-tension-album-cover-3d-design-1000x1000.jpg",
            title: "Album cover design",
            subtitle: "CD cover artisit"
        },
        {
            url: "#",
            image: "https://i.ytimg.com/vi/BgfjN6QaQHA/maxresdefault.jpg",
            title: "Контрэволюция",
            subtitle: "Пневмослон"
        },
        {
            url: "#",
            image: "https://www.designformusic.com/wp-content/uploads/2018/11/trailer-tension-album-cover-3d-design-1000x1000.jpg",
            title: "Album cover design",
            subtitle: "CD cover artisit"
        },
        {
            url: "#",
            image: "https://i.ytimg.com/vi/BgfjN6QaQHA/maxresdefault.jpg",
            title: "Контрэволюция",
            subtitle: "Пневмослон"
        },
        {
            url: "#",
            image: "https://www.designformusic.com/wp-content/uploads/2018/11/trailer-tension-album-cover-3d-design-1000x1000.jpg",
            title: "Album cover design",
            subtitle: "CD cover artisit"
        },
    ];


    return (
        <>
            <Header/>
            <Footer/>
            <div class="container">
                <div class="column start-start w100">
                    <Link href={"#"} class={"anchor-link"}>New Albums</Link>
                    <LinksSlider id={"newAlbums1"} slides={newAlbums}/>
                </div>
                <div class="column start-start w100">
                    <Link href={"#"} class={"anchor-link"}>New artists and groups</Link>
                    <LinksSlider id={"newAlbums2"} slides={newAlbums}/>
                </div>


                <div class="column start-start w100">
                    <Link href={"#"} class={"anchor-link"}>New tracks</Link>
                    <MasonTracks/>
                </div>


            </div>
        </>
    );
};


