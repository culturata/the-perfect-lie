"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { toast } from "sonner";

interface NewsletterWidgetProps {
  userEmail?: string | null;
  isSubscribed?: boolean;
}

export function NewsletterWidget({ userEmail, isSubscribed = false }: NewsletterWidgetProps) {
  const [email, setEmail] = useState(userEmail || "");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(isSubscribed);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await subscribeToNewsletter(email, name || undefined);

      if (result.success) {
        setSubscribed(true);
        toast.success(result.message);
        setEmail("");
        setName("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (subscribed) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">You're Subscribed!</CardTitle>
          </div>
          <CardDescription>
            Thanks for subscribing to our newsletter. You'll receive updates about new courses, articles, and community news.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Newsletter
        </CardTitle>
        <CardDescription>
          Get the latest GSPro news, course releases, and community updates delivered to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubscribe} className="space-y-3">
          {!userEmail && (
            <>
              <Input
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </>
          )}
          {userEmail && (
            <div className="text-sm text-muted-foreground mb-2">
              Subscribe with: <span className="font-medium text-foreground">{userEmail}</span>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
