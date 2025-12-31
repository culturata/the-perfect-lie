import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Eye, EyeOff, Star, StarOff } from "lucide-react";
import { getAllArticlesAdmin, toggleArticlePublished, toggleArticleFeatured } from "@/app/actions/admin/articles";
import { getCategoryLabel } from "@/lib/articles";
import { DeleteArticleButton } from "@/components/admin/delete-article-button";

export default async function AdminArticlesPage() {
  const articles = await getAllArticlesAdmin();

  // Group by category for better organization
  const articlesByCategory = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, typeof articles>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Build Guide Articles</h1>
          <p className="text-muted-foreground mt-2">
            Manage your golf simulator build guides ({articles.length} total)
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Article
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">{articles.length}</div>
          <div className="text-sm text-muted-foreground">Total Articles</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {articles.filter((a) => a.published).length}
          </div>
          <div className="text-sm text-muted-foreground">Published</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">
            {articles.filter((a) => !a.published).length}
          </div>
          <div className="text-sm text-muted-foreground">Drafts</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {articles.filter((a) => a.featured).length}
          </div>
          <div className="text-sm text-muted-foreground">Featured</div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Read Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No articles yet. Create your first build guide article.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{article.title}</span>
                      <span className="text-xs text-muted-foreground">
                        /guides/{article.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryLabel(article.category)}</Badge>
                  </TableCell>
                  <TableCell>{article.order}</TableCell>
                  <TableCell>
                    <form action={toggleArticlePublished.bind(null, article.id)}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                      >
                        {article.published ? (
                          <>
                            <Eye className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 text-gray-600" />
                            <span className="text-gray-600">Draft</span>
                          </>
                        )}
                      </Button>
                    </form>
                  </TableCell>
                  <TableCell>
                    <form action={toggleArticleFeatured.bind(null, article.id)}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                      >
                        {article.featured ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </form>
                  </TableCell>
                  <TableCell>{article.readTime || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {article.published && (
                        <Link href={`/guides/${article.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteArticleButton articleId={article.id} articleTitle={article.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
