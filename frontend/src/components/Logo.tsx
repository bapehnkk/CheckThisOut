import {createEffect, createSignal, onMount} from "solid-js";

type Props = {
    text: string;
};

export default function Logo({text}: Props) {
    const [animate, setAnimate] = createSignal(false);

    const repeat = () => {
        setAnimate(false);
        setTimeout(() => {
            setAnimate(true);
        }, 100);
    };


    onMount(() => {
        setAnimate(true);
    });

    return (
        <div class="logo" onClick={repeat}>
            <svg viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg">
                <text
                    x="50%"
                    y="50%"
                    dy=".3em"
                    text-anchor="middle"
                    classList={{
                        "logo-text": true,
                        "animate-logo": animate(),
                    }}
                >
                    {text}
                </text>
            </svg>
        </div>
    );
}
