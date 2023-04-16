import {Component, createSignal, onMount} from "solid-js";

import {asideType} from "../App";
import {FooterPlayer} from "./Player";

export const Footer: Component = () => {
    return (
        <footer class={asideType()}>
            <FooterPlayer/>
        </footer>
    );
};