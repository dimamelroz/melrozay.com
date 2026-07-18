interface VideoEmbedProps {
  provider: "youtube" | "vimeo" | "kinescope";
  id: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export function VideoEmbed({
  provider,
  id,
  autoplay = false,
  muted = false,
  loop = false,
  controls = true,
}: VideoEmbedProps) {
  const a = autoplay ? 1 : 0;
  const m = muted ? 1 : 0;
  const l = loop ? 1 : 0;
  const c = controls ? 1 : 0;

  let src = "";
  if (provider === "youtube") {
    src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=${a}&mute=${m}&loop=${l}&controls=${c}&rel=0&modestbranding=1`;
  } else if (provider === "vimeo") {
    src = `https://player.vimeo.com/video/${id}?autoplay=${a}&loop=${l}&muted=${m}&dnt=1`;
  } else if (provider === "kinescope") {
    src = `https://kinescope.io/embed/${id}?autoplay=${a}&muted=${m}&loop=${l}`;
  }

  return (
    <iframe
      src={src}
      width="100%"
      height="100%"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-same-origin allow-presentation"
      style={{ border: "none", display: "block" }}
    />
  );
}
