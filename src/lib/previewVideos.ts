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

export function wakePreviewVideos() {
  if (typeof window === "undefined") return;

  playPreviewVideos();
  requestAnimationFrame(playPreviewVideos);
  window.setTimeout(playPreviewVideos, 250);
  window.setTimeout(playPreviewVideos, 1000);
}
