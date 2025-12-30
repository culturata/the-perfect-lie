import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, User, Calendar, Eye } from "lucide-react";

interface CourseCardProps {
  name: string;
  designer: string | null;
  dateAdded: string;
  lastUpdated: string;
  downloadUrl: string;
}

export function CourseCard({
  name,
  designer,
  lastUpdated,
  downloadUrl,
}: CourseCardProps) {
  const updateDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Create slug from course name
  const slug = encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"));

  return (
    <Card className="hover:shadow-lg transition-all hover:border-primary/50 border-2 group">
      <CardHeader>
        <Link href={`/courses/${slug}`} className="space-y-2">
          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          <CardDescription className="flex flex-col gap-1">
            {designer && (
              <div className="flex items-center gap-1.5 text-xs">
                <User className="w-3 h-3" />
                <span>{designer}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="w-3 h-3" />
              <span>{updateDate}</span>
            </div>
          </CardDescription>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            GSPro
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/courses/${slug}`}>
              <Eye className="w-3 h-3 mr-1" />
              View
            </Link>
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-3 h-3 mr-1" />
              Download
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
