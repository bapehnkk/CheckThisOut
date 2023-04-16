import {Component, createEffect, createSignal, onCleanup, JSX} from 'solid-js';

type FitTextProps = {
    text: string;
    class?: string,
    scale?: number,
};

export const FitText: Component<FitTextProps> = (props) => {
    const [el, setEl] = createSignal<HTMLElement | undefined>();

    createEffect(() => {
        if (el()) {
            el()!.style.setProperty('--length', props.text.length.toString());
        }
    });

    createEffect(() => {
        if (!el()) return;
        const element = el();

        const resizeObserver = new ResizeObserver(([entry]) => {
            let width = entry.contentRect.width * 0.8;
            if (props.scale) width = width * props.scale;
            element!.style.setProperty('--width', `${width}px`);
        });

        resizeObserver.observe(element!.parentElement!);
        onCleanup(() => resizeObserver.disconnect());
    });

    return (
        <div
            data-fit-text
            ref={setEl}
            style={`font-size: calc(var(--width) / (var(--length, 1) * 0.5) * var(--scale, 1));`}
            class={props.class}
        >
            {props.text}
        </div>
    );
};
