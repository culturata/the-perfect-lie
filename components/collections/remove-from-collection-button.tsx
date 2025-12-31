"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { removeFromCollection } from "@/app/actions/collections";

interface RemoveFromCollectionButtonProps {
  itemId: string;
}

export function RemoveFromCollectionButton({ itemId }: RemoveFromCollectionButtonProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleRemove() {
    setIsRemoving(true);
    try {
      await removeFromCollection(itemId);
      router.refresh();
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Failed to remove item. Please try again.");
      setIsRemoving(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 shrink-0"
      onClick={handleRemove}
      disabled={isRemoving}
      title="Remove from collection"
    >
      {isRemoving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <X className="h-4 w-4" />
      )}
    </Button>
  );
}
