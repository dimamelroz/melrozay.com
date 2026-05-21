export type WorkOrientation = "horizontal" | "vertical";
export type FilterGroup = "commercial" | "music-video";
export type VideoProvider = "youtube" | "vimeo" | "kinescope";

export interface Work {
  id: string;
  title: string;
  role: string;
  projectType: string;
  filterGroup: FilterGroup;
  orientation: WorkOrientation;
  cover: string;
  fullVideo: { provider: VideoProvider; id: string };
}
