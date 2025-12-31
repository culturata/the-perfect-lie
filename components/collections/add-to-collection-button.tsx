"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FolderPlus, Loader2, Check, Plus } from "lucide-react";
import { getUserCollections, addToCollection, checkItemInCollections } from "@/app/actions/collections";
import { CollectionItemType } from "@prisma/client";
import { CreateCollectionDialog } from "./create-collection-dialog";

interface AddToCollectionButtonProps {
  itemType: CollectionItemType;
  courseId?: string;
  articleId?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function AddToCollectionButton({
  itemType,
  courseId,
  articleId,
  variant = "outline",
  size = "default",
}: AddToCollectionButtonProps) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [collections, setCollections] = useState<any[]>([]);
  const [collectionIdsWithItem, setCollectionIdsWithItem] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;

    async function loadData() {
      setIsLoading(true);
      try {
        const [userCollections, existingCollections] = await Promise.all([
          getUserCollections(),
          checkItemInCollections({ itemType, courseId, articleId }),
        ]);
        setCollections(userCollections);
        setCollectionIdsWithItem(existingCollections);
      } catch (error) {
        console.error("Failed to load collections:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [isSignedIn, itemType, courseId, articleId]);

  async function handleAddToCollection(collectionId: string) {
    setIsAdding(collectionId);
    try {
      await addToCollection({
        collectionId,
        itemType,
        courseId,
        articleId,
      });
      setCollectionIdsWithItem((prev) => [...prev, collectionId]);
      router.refresh();
    } catch (error) {
      console.error("Failed to add to collection:", error);
      alert("Failed to add to collection. Please try again.");
    } finally {
      setIsAdding(null);
    }
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <FolderPlus className="h-4 w-4 mr-2" />
              Save to Collection
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Add to Collection</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {collections.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            <p className="mb-2">No collections yet</p>
            <CreateCollectionDialog>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Collection
              </Button>
            </CreateCollectionDialog>
          </div>
        ) : (
          <>
            {collections.map((collection) => {
              const isInCollection = collectionIdsWithItem.includes(collection.id);
              const isCurrentlyAdding = isAdding === collection.id;

              return (
                <DropdownMenuItem
                  key={collection.id}
                  onClick={() => {
                    if (!isInCollection && !isCurrentlyAdding) {
                      handleAddToCollection(collection.id);
                    }
                  }}
                  disabled={isInCollection || isCurrentlyAdding}
                  className="flex items-center justify-between"
                >
                  <span className="truncate">{collection.name}</span>
                  {isCurrentlyAdding ? (
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  ) : isInCollection ? (
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                  ) : null}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <CreateCollectionDialog>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </DropdownMenuItem>
            </CreateCollectionDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
