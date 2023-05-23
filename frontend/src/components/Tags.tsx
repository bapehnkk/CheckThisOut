import {Component, For} from "solid-js";
import {QueueTrackOptions} from "../store/AudioPlayer";
import {Link} from "@solidjs/router";

interface TagsOptions {
    tags: string[]
}

export const Tags: Component<TagsOptions> = (props) => {


    return (
        <>
            {props.tags &&
                <div class="tags">
                    <For each={props.tags}>{(tag, index) =>
                        <Link href={`/search?tags=[${tag}]`} class="tag">
                            {tag}
                        </Link>
                    }</For>
                </div>
            }
        </>
    );
};


export default Tags;