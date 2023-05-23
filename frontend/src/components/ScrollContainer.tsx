import {ParentComponent, JSX, splitProps} from 'solid-js';


const ScrollContainer: ParentComponent = (props) => {

    return (
        <div class={"scroll-container"}>
            <swiper-container class="mySwiper" scrollbar="true" direction="vertical" slides-per-view="auto"
                              free-mode="true"
                              mousewheel="true">

                <swiper-slide>
                    <div>
                        {props.children}
                    </div>
                </swiper-slide>
            </swiper-container>
        </div>
    );
}

export default ScrollContainer;
