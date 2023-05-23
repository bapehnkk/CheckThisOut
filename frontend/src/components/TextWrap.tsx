import { Component, JSX, splitProps } from 'solid-js';

interface TextComponentProps {
  text: string;
}

const TextWrap: Component<TextComponentProps> = (props: TextComponentProps) => {

  return (
    <div class={"text-wrap"}>
      {() => props.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
    </div>
  );
}

export default TextWrap;
