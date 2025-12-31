"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Leaderboard728Ad, MobileBannerAd } from "./ad-placeholder";

export function AdhesiveAd() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-background border-t shadow-lg">
      <div className="relative">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Ad Unit */}
        <div className="p-2">
          {isMobile ? (
            <MobileBannerAd />
          ) : (
            <Leaderboard728Ad />
          )}
        </div>
      </div>
    </div>
  );
}
