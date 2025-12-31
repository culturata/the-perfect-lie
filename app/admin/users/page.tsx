import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserX, CheckCircle } from "lucide-react";
import { getAllUsers } from "@/app/actions/users";
import { ToggleBozoButton } from "@/components/admin/toggle-bozo-button";
import { formatDistanceToNow } from "date-fns";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts and moderation status
          </p>
        </div>
        <Badge variant="outline">{users.length} total users</Badge>
      </div>

      {/* Info Banner */}
      <div className="bg-muted/50 border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <UserX className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">No Bozos Policy</p>
            <p className="text-sm text-muted-foreground">
              Users marked as "bozo" can still post content, but only they can see
              their own posts. This is a shadowban feature for handling problematic
              users without alerting them.
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <p className="text-muted-foreground">No users found</p>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.avatarUrl && (
                        <img
                          src={user.avatarUrl}
                          alt={user.username || user.email}
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                      <div>
                        <div className="font-medium">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username || "Unknown"}
                        </div>
                        {user.username && (
                          <div className="text-sm text-muted-foreground">
                            @{user.username}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user._count.reviews}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user._count.comments}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.isBozo ? (
                      <Badge variant="destructive" className="gap-1">
                        <UserX className="h-3 w-3" />
                        Bozo
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <ToggleBozoButton
                      userId={user.id}
                      userName={
                        user.username ||
                        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                        user.email
                      }
                      currentStatus={user.isBozo}
                    />
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
