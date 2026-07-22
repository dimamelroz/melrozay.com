export type WorkOrientation = "horizontal" | "vertical";
export type FilterGroup = "commercial" | "music-video";
export type VideoProvider = "youtube" | "vimeo" | "kinescope";

export interface Work {
  id: string;
  headline?: string;
  subtitle?: string;
  role: string;
  projectType: string;
  filterGroup: FilterGroup;
  orientation: WorkOrientation;
  cover: string;
  previewVideo?: string;
  fullVideo?: { provider: VideoProvider; id: string };
}
