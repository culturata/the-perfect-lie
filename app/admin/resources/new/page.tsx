import { ResourceForm } from "@/components/admin/resource-form";

export default function NewResourcePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Resource</h1>
        <p className="text-muted-foreground mt-2">
          Add a new resource to the community directory
        </p>
      </div>

      <ResourceForm />
    </div>
  );
}
