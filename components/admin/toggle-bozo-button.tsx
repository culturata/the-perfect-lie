"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toggleBozoStatus } from "@/app/actions/users";
import { toast } from "sonner";
import { UserX, CheckCircle } from "lucide-react";

interface ToggleBozoButtonProps {
  userId: string;
  userName: string;
  currentStatus: boolean;
}

export function ToggleBozoButton({
  userId,
  userName,
  currentStatus,
}: ToggleBozoButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await toggleBozoStatus(userId);
      toast.success(
        currentStatus
          ? `${userName} is no longer marked as bozo`
          : `${userName} has been marked as bozo`
      );
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error("Error toggling bozo status:", error);
      toast.error("Failed to update user status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {currentStatus ? (
          <Button variant="outline" size="sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            Restore
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <UserX className="mr-2 h-4 w-4" />
            Mark Bozo
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentStatus ? "Restore User" : "Mark User as Bozo"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {currentStatus ? (
              <>
                Are you sure you want to restore <strong>{userName}</strong>? Their
                posts will become visible to all users again.
              </>
            ) : (
              <>
                Are you sure you want to mark <strong>{userName}</strong> as a bozo?
                They will still be able to post, but only they will see their own
                content (shadowban).
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggle} disabled={isLoading}>
            {isLoading
              ? "Updating..."
              : currentStatus
                ? "Restore User"
                : "Mark as Bozo"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
