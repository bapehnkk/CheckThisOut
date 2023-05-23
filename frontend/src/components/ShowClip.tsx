import {Component, createSignal, onCleanup} from "solid-js";

type ShowClipProps = {
  youtubeUrl?: string,
  videoUrl?: string
};

const ShowClip: Component<ShowClipProps> = (props) => {
  // функция для извлечения ID видео из YouTube URL
  function getYouTubeID(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : '';
  }

  // создание сигнала для управления URL видео
  const [videoURL, setVideoURL] = createSignal(props.youtubeUrl ? `https://www.youtube.com/embed/${getYouTubeID(props.youtubeUrl)}` : props.videoUrl || '');

  onCleanup(() => {
    setVideoURL('');
  });

  return (
    <div>
      {props.youtubeUrl && (
        <iframe
          width="560"
          height="315"
          src={videoURL()}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      )}
      {props.videoUrl && (
        <video width="560" height="315" controls>
          <source src={videoURL()} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

export default ShowClip;
