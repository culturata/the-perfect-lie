import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  width: number;
  height: number;
  className?: string;
  label?: string;
}

export function AdPlaceholder({ width, height, className, label }: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted border-2 border-dashed border-border rounded-md",
        className
      )}
      style={{ width: `${width}px`, height: `${height}px`, maxWidth: "100%" }}
    >
      <div className="text-center text-muted-foreground">
        <div className="text-sm font-medium">Advertisement</div>
        {label && <div className="text-xs mt-1">{label}</div>}
        <div className="text-xs mt-1">
          {width} × {height}
        </div>
      </div>
    </div>
  );
}

// Desktop Ad Units
export function LeaderboardAd({ className }: { className?: string }) {
  return <AdPlaceholder width={970} height={250} label="Leaderboard" className={className} />;
}

export function LargeSkyscraperAd({ className }: { className?: string }) {
  return <AdPlaceholder width={300} height={600} label="Large Skyscraper" className={className} />;
}

export function Leaderboard728Ad({ className }: { className?: string }) {
  return <AdPlaceholder width={728} height={90} label="Leaderboard" className={className} />;
}

// Mobile Ad Units
export function MediumRectangleAd({ className }: { className?: string }) {
  return <AdPlaceholder width={300} height={250} label="Medium Rectangle" className={className} />;
}

export function MobileBannerAd({ className }: { className?: string }) {
  return <AdPlaceholder width={320} height={50} label="Mobile Banner" className={className} />;
}
