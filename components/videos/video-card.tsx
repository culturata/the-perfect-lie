import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Calendar, MapPin, Star } from "lucide-react";

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
    <Card className="overflow-hidden hover:shadow-lg transition-all hover:border-primary/50 border-2 group">
      <div className="relative aspect-video bg-muted">
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </div>
          <Badge className="absolute top-2 right-2 bg-black/70">
            YouTube
          </Badge>
        </a>
      </div>

      <CardHeader>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </a>
        <CardDescription className="flex items-center gap-1.5 text-xs">
          <Calendar className="w-3 h-3" />
          <span>{publishDate}</span>
          <span>•</span>
          <span>{channelTitle}</span>
        </CardDescription>
      </CardHeader>

      {description && (
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" asChild>
              <Link href="/courses">
                <MapPin className="w-3 h-3 mr-1" />
                Find Course
              </Link>
            </Button>
            <Button size="sm" variant="ghost" className="flex-1" asChild>
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="w-3 h-3 mr-1" />
                Watch
              </a>
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
