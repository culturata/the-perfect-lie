import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">
            {name}
          </CardTitle>
        </div>
        <CardDescription className="flex items-center gap-2">
          {designer && (
            <>
              <span className="text-sm">by {designer}</span>
              <span>•</span>
            </>
          )}
          <span className="text-xs">Updated {updateDate}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            GSPro
          </Badge>
        </div>
        <Button asChild className="w-full">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Course
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
