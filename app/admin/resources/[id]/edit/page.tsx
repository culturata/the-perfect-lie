import { notFound } from "next/navigation";
import { ResourceForm } from "@/components/admin/resource-form";
import { getResource } from "@/app/actions/resources";

interface EditResourcePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditResourcePage({ params }: EditResourcePageProps) {
  const { id } = await params;
  const resource = await getResource(id);

  if (!resource) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Resource</h1>
        <p className="text-muted-foreground mt-2">
          Update resource information
        </p>
      </div>

      <ResourceForm resource={resource} />
    </div>
  );
}
