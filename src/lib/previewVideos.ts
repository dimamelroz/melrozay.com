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

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout?: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type NetworkAwareNavigator = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

export function warmPreviewVideoCache(urls: string[]) {
  if (typeof window === "undefined") return () => undefined;

  const win = window as IdleWindow;
  const nav = navigator as NetworkAwareNavigator;
  const connection = nav.connection;
  const isSlowConnection = /2g/.test(connection?.effectiveType ?? "");

  if (connection?.saveData || isSlowConnection) {
    return () => undefined;
  }

  let cancelled = false;
  const uniqueUrls = Array.from(new Set(urls));

  const warm = async () => {
    for (const url of uniqueUrls) {
      if (cancelled) break;
      try {
        await fetch(`${url}?v=noaudio-2`, { cache: "force-cache" });
      } catch {
        // Best effort only: browser cache warm-up should never affect the page.
      }
    }
  };

  const start = () => {
    void warm();
  };

  const useIdleCallback = Boolean(win.requestIdleCallback);
  const handle = useIdleCallback
    ? win.requestIdleCallback?.(start, { timeout: 3000 }) ?? 0
    : win.setTimeout(start, 2500);

  return () => {
    cancelled = true;
    if (useIdleCallback && win.cancelIdleCallback) {
      win.cancelIdleCallback(handle);
    } else {
      win.clearTimeout(handle);
    }
  };
}
