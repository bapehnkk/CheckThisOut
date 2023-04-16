import {Component} from 'solid-js';
import {JSX} from 'solid-js/jsx-runtime';

export const ArtistIcon: Component = () => {
    return (
        <>
            <svg width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="/src/assets/musician-icon-ECEFF4.svg#logo"/>
            </svg>
        </>
    );
};

export default ArtistIcon;
