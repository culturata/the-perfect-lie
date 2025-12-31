import { getCollection } from "@/app/actions/collections";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, BookOpen, MapPin } from "lucide-react";
import Link from "next/link";
import { EditCollectionDialog } from "@/components/collections/edit-collection-dialog";
import { DeleteCollectionButton } from "@/components/collections/delete-collection-button";
import { RemoveFromCollectionButton } from "@/components/collections/remove-from-collection-button";

interface CollectionPageProps {
  params: {
    id: string;
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collection = await getCollection(params.id);

  const courses = collection.items.filter((item) => item.itemType === "COURSE");
  const articles = collection.items.filter((item) => item.itemType === "ARTICLE");

  return (
    <div className="container px-4 py-12 max-w-6xl">
      <div className="mb-6">
        <Link href="/collections">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{collection.name}</h1>
            {collection.description && (
              <p className="text-muted-foreground max-w-2xl">
                {collection.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created {new Date(collection.createdAt).toLocaleDateString()}
              </span>
              <span>{collection.items.length} items</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <EditCollectionDialog collection={collection}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </EditCollectionDialog>
            <DeleteCollectionButton collectionId={collection.id} />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {collection.items.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Collection is empty</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Start adding courses and articles to this collection by clicking the "Add to Collection" button on any course or article page
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Courses Section */}
            {courses.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  Courses ({courses.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {courses.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              <Link
                                href={`/courses/${encodeURIComponent(
                                  item.course!.name.toLowerCase().replace(/\s+/g, "-")
                                )}`}
                                className="hover:text-primary transition-colors"
                              >
                                {item.course!.name}
                              </Link>
                            </CardTitle>
                            {item.course!.designer && (
                              <CardDescription>
                                by {item.course!.designer}
                              </CardDescription>
                            )}
                          </div>
                          <RemoveFromCollectionButton itemId={item.id} />
                        </div>
                      </CardHeader>
                      {item.course!.location && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {item.course!.location}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Articles Section */}
            {articles.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Articles ({articles.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {articles.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.article!.category.replace(/_/g, " ")}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg">
                              <Link
                                href={`/guides/${item.article!.slug}`}
                                className="hover:text-primary transition-colors"
                              >
                                {item.article!.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {item.article!.excerpt}
                            </CardDescription>
                          </div>
                          <RemoveFromCollectionButton itemId={item.id} />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
