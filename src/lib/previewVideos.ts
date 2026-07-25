export function preparePreviewVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.controls = false;
  video.setAttribute("muted", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("loop", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
}

export function playPreviewVideo(video: HTMLVideoElement) {
  preparePreviewVideo(video);
  if (video.readyState === 0) {
    video.load();
  }
  void video.play().catch(() => undefined);
}

export function playPreviewVideos() {
  if (typeof document === "undefined") return;

  document
    .querySelectorAll<HTMLVideoElement>("video[data-preview-video]")
    .forEach(playPreviewVideo);
}

let wakeRaf = 0;
let wakeTimeoutShort = 0;
let wakeTimeoutLong = 0;

export function wakePreviewVideos() {
  if (typeof window === "undefined") return;

  if (wakeRaf) cancelAnimationFrame(wakeRaf);
  window.clearTimeout(wakeTimeoutShort);
  window.clearTimeout(wakeTimeoutLong);

  playPreviewVideos();
  wakeRaf = requestAnimationFrame(() => {
    wakeRaf = 0;
    playPreviewVideos();
  });
  wakeTimeoutShort = window.setTimeout(playPreviewVideos, 250);
  wakeTimeoutLong = window.setTimeout(playPreviewVideos, 1000);
}
