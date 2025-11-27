"use client";

import { ContentItem } from "../types";
import Image from "next/image";
import { useRef, useEffect } from "react";

interface ContentCardProps {
  content: ContentItem;
}

/**
 * ContentCard component displays a single content item in full-page format.
 * Shows different UI based on content type (video, image, news).
 * Videos autoplay muted.
 */
export default function ContentCard({ content }: ContentCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video URL for all video types
  const videoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Autoplay video when component mounts or content changes
  useEffect(() => {
    if (content.type === "video" && videoRef.current) {
      videoRef.current.play().catch((error) => {
        // Autoplay might be blocked by browser, log error but don't break
        console.log("Autoplay prevented:", error);
      });
    }
  }, [content.type, content.id]);

  const getTypeIcon = () => {
    switch (content.type) {
      case "video":
        return "▶️";
      case "image":
        return "🖼️";
      case "news":
        return "📰";
      default:
        return "";
    }
  };

  const getTypeLabel = () => {
    switch (content.type) {
      case "video":
        return "Video";
      case "image":
        return "Image";
      case "news":
        return "News";
      default:
        return "";
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Full-page Video/Image/Thumbnail */}
      <div className="relative flex-1 w-full bg-gray-900">
        {content.type === "video" ? (
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={content.thumbnailUrl}
            alt={content.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        {/* Type badge */}
        <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 z-10">
          <span>{getTypeIcon()}</span>
          <span>{getTypeLabel()}</span>
        </div>
      </div>

      {/* Content Info - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 md:p-8 md:pb-16 z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
          {content.title}
        </h2>
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl">
          {content.description}
        </p>
      </div>
    </div>
  );
}

