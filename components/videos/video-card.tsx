import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoCardProps {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelTitle: string;
}

export function VideoCard({
  videoId,
  title,
  description,
  thumbnailUrl,
  publishedAt,
  channelTitle,
}: VideoCardProps) {
  const publishDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative aspect-video bg-muted">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <svg
                className="w-8 h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-base">
              {title}
            </CardTitle>
          </div>
          <CardDescription className="flex items-center gap-2 text-xs">
            <span>{channelTitle}</span>
            <span>•</span>
            <span>{publishDate}</span>
          </CardDescription>
        </CardHeader>
        {description && (
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </CardContent>
        )}
      </a>
    </Card>
  );
}
