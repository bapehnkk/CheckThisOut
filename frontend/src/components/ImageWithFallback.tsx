import {Component, createSignal} from 'solid-js';


type ImageWithFallbackProps = {
  src: string;
  alt: string;
  fallbackSrc: string;
  className?: string;
};

export const ImageWithFallback: Component<ImageWithFallbackProps> = (props) => {

  const [currentSrc, setCurrentSrc] = createSignal(props.src);

  function handleError() {
    setCurrentSrc(props.fallbackSrc);
  }

  return (
    <img
      src={currentSrc()}
      alt={props.alt}
      onError={handleError}
      class={props.className}
    />
  );
}
