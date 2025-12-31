import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleForm } from "@/components/admin/article-form";

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create New Article</h1>
        <p className="text-muted-foreground mt-2">
          Add a new build guide article to your knowledge base
        </p>
      </div>

      {/* Form */}
      <ArticleForm />
    </div>
  );
}
