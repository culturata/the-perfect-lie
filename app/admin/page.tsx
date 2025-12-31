import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  // Get counts
  const resourceCount = await db.resource.count();
  const courseCount = await db.course.count();
  const userCount = await db.user.count();

  const stats = [
    {
      title: "Resources",
      value: resourceCount,
      href: "/admin/resources",
      icon: Package,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your GSPro Community App content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Link href={stat.href}>
                <Button variant="link" className="px-0 mt-2">
                  Manage <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resource Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/resources/new">
                <Button variant="outline" className="w-full justify-start">
                  Add New Resource
                </Button>
              </Link>
              <Link href="/admin/resources">
                <Button variant="outline" className="w-full justify-start">
                  View All Resources
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
