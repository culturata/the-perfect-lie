import { getUserCollections } from "@/app/actions/collections";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog";

export default async function CollectionsPage() {
  const collections = await getUserCollections();

  return (
    <div className="container px-4 py-12 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Collections</h1>
          <p className="text-muted-foreground">
            Organize and save your favorite courses and articles
          </p>
        </div>
        <CreateCollectionDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </CreateCollectionDialog>
      </div>

      {collections.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create your first collection to start organizing courses and articles you want to reference later
            </p>
            <CreateCollectionDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Collection
              </Button>
            </CreateCollectionDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.id}`}>
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="line-clamp-2">{collection.name}</span>
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      {collection._count.items}
                    </span>
                  </CardTitle>
                  {collection.description && (
                    <CardDescription className="line-clamp-2">
                      {collection.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
