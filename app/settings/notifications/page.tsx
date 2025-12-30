"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getUserPreferences, updateUserPreferences } from "@/app/actions/notifications";
import { useRouter } from "next/navigation";

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [emailOnReply, setEmailOnReply] = useState(true);
  const [emailOnMention, setEmailOnMention] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      const prefs = await getUserPreferences();
      setEmailOnReply(prefs.emailOnReply);
      setEmailOnMention(prefs.emailOnMention);
      setEmailDigest(prefs.emailDigest);
    } catch (err) {
      setError("Failed to load preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateUserPreferences({
        emailOnReply,
        emailOnMention,
        emailDigest,
      });
      setSuccess("Preferences saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage how you receive notifications
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Email Notifications</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Choose which email notifications you want to receive
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <label className="font-medium text-sm">
                      Reply notifications
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when someone replies to your comment
                    </p>
                  </div>
                  <Switch
                    checked={emailOnReply}
                    onCheckedChange={setEmailOnReply}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-0.5">
                    <label className="font-medium text-sm">
                      Mention notifications
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when someone mentions you in a comment
                    </p>
                  </div>
                  <Switch
                    checked={emailOnMention}
                    onCheckedChange={setEmailOnMention}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <label className="font-medium text-sm">
                      Daily digest
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Receive a daily summary of activity
                    </p>
                  </div>
                  <Switch
                    checked={emailDigest}
                    onCheckedChange={setEmailDigest}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {success && (
              <p className="text-sm text-green-600">{success}</p>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
