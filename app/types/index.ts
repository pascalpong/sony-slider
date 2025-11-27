export type ContentType = "video" | "image" | "news";

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  description: string;
  thumbnailUrl: string;
  url?: string; // Optional URL for videos/news
}

