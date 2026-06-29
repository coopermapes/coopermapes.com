declare namespace JSX {
  interface IntrinsicElements {
    "image-slot": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      id?: string;
      shape?: string;
      placeholder?: string;
      fit?: string;
      src?: string;
    }, HTMLElement>;
  }
}
