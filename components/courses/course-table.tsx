"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, Settings2 } from "lucide-react";

// Server to Patreon URL mapping
const SERVER_URLS: Record<string, string> = {
  "Pakman Tier 1": "https://www.patreon.com/cw/pakgolfstudios",
  "RunPuddRun Birdie": "https://www.patreon.com/c/runpuddrun/home?vanity=runpuddrun",
  "RunPuddRun Eagle": "https://www.patreon.com/c/runpuddrun/home?vanity=runpuddrun",
  "TekBud": "https://www.patreon.com/c/tekbud/home",
  "TheGolfBoy": "https://www.patreon.com/thegolfboy",
};

interface Course {
  id: string;
  name: string;
  designer: string | null;
  location: string | null;
  server: string | null;
  version: string | null;
  lastUpdated: Date;
  tourStop: boolean;
  majorVenue: boolean;
  historic: boolean;
}

interface CourseTableProps {
  courses: Course[];
}

type SortField = "name" | "designer" | "location" | "server" | "version" | "lastUpdated";
type SortDirection = "asc" | "desc" | null;

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  responsive?: string; // Tailwind class for responsive hiding
}

export function CourseTable({ courses }: CourseTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [designerFilter, setDesignerFilter] = useState<string>("all");
  const [serverFilter, setServerFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("lastUpdated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Column visibility configuration
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: "name", label: "Course Name", visible: true, sortable: true },
    { key: "designer", label: "Designer", visible: true, sortable: true },
    { key: "location", label: "Location", visible: true, sortable: true, responsive: "hidden md:table-cell" },
    { key: "server", label: "Server", visible: true, sortable: true, responsive: "hidden md:table-cell" },
    { key: "version", label: "Version", visible: true, sortable: true, responsive: "hidden lg:table-cell" },
    { key: "lastUpdated", label: "Updated", visible: true, sortable: true, responsive: "hidden md:table-cell" },
  ]);

  // Toggle column visibility
  const toggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  // Get unique designers for filter
  const designers = useMemo(() => {
    const uniqueDesigners = new Set(
      courses
        .map((c) => c.designer)
        .filter((d): d is string => d !== null)
    );
    return Array.from(uniqueDesigners).sort();
  }, [courses]);

  // Get unique servers for filter
  const servers = useMemo(() => {
    const uniqueServers = new Set(
      courses
        .map((c) => c.server)
        .filter((s): s is string => s !== null)
    );
    return Array.from(uniqueServers).sort();
  }, [courses]);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(search) ||
          course.designer?.toLowerCase().includes(search) ||
          course.location?.toLowerCase().includes(search) ||
          course.server?.toLowerCase().includes(search) ||
          course.version?.toLowerCase().includes(search)
      );
    }

    // Designer filter
    if (designerFilter !== "all") {
      filtered = filtered.filter((course) => course.designer === designerFilter);
    }

    // Server filter
    if (serverFilter !== "all") {
      filtered = filtered.filter((course) => course.server === serverFilter);
    }

    // Sort
    if (sortField && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];

        // Handle nulls
        if (aVal === null) return 1;
        if (bVal === null) return -1;

        // Handle dates
        if (sortField === "lastUpdated") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        } else {
          // String comparison
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();
        }

        if (sortDirection === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [courses, searchTerm, designerFilter, serverFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField("lastUpdated");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
  };

  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <div className="space-y-4">
      {/* Filters - Single Line */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, designers, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 items-center">
            <Select value={designerFilter} onValueChange={setDesignerFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Designer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designers</SelectItem>
                {designers.map((designer) => (
                  <SelectItem key={designer} value={designer}>
                    {designer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={serverFilter} onValueChange={setServerFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Server" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Servers</SelectItem>
                {servers.map((server) => (
                  <SelectItem key={server} value={server}>
                    {server}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Column Customizer */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={column.visible}
                    onCheckedChange={() => toggleColumn(column.key)}
                    disabled={column.key === "name"} // Always show name
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Results Count - Right aligned */}
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          Showing {filteredAndSortedCourses.length} of {courses.length} courses
        </div>
      </div>

      {/* Table with horizontal scroll */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.responsive || ""}
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key as SortField)}
                      className="hover:bg-transparent p-0 h-auto font-semibold whitespace-nowrap"
                    >
                      {column.label}
                      <SortIcon field={column.key as SortField} />
                    </Button>
                  ) : (
                    <span className="font-semibold">{column.label}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCourses.map((course) => {
              const slug = encodeURIComponent(
                course.name.toLowerCase().replace(/\s+/g, "-")
              );
              const updateDate = new Date(course.lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <TableRow key={course.id} className="cursor-pointer hover:bg-muted/50">
                  {visibleColumns.map((column) => {
                    // Render each column based on its key
                    if (column.key === "name") {
                      return (
                        <TableCell key="name" className={column.responsive || ""}>
                          <Link
                            href={`/courses/${slug}`}
                            className="font-medium hover:text-primary hover:underline whitespace-nowrap"
                          >
                            {course.name}
                          </Link>
                        </TableCell>
                      );
                    }

                    if (column.key === "designer") {
                      return (
                        <TableCell key="designer" className={column.responsive || ""}>
                          {course.designer ? (
                            <Link
                              href={`/designers/${encodeURIComponent(course.designer)}`}
                              className="text-muted-foreground hover:text-primary hover:underline whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {course.designer}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      );
                    }

                    if (column.key === "location") {
                      return (
                        <TableCell key="location" className={`text-muted-foreground ${column.responsive || ""}`}>
                          {course.location || "—"}
                        </TableCell>
                      );
                    }

                    if (column.key === "server") {
                      const serverUrl = course.server ? SERVER_URLS[course.server] : null;

                      return (
                        <TableCell key="server" className={column.responsive || ""}>
                          {course.server ? (
                            serverUrl ? (
                              <a
                                href={serverUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-block hover:opacity-80 transition-opacity"
                              >
                                <Badge
                                  variant={course.server.toLowerCase() === "beta" ? "destructive" : "secondary"}
                                  className="whitespace-nowrap cursor-pointer"
                                >
                                  {course.server}
                                </Badge>
                              </a>
                            ) : (
                              <Badge
                                variant={course.server.toLowerCase() === "beta" ? "destructive" : "secondary"}
                                className="whitespace-nowrap"
                              >
                                {course.server}
                              </Badge>
                            )
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      );
                    }

                    if (column.key === "version") {
                      return (
                        <TableCell key="version" className={`text-muted-foreground text-sm ${column.responsive || ""}`}>
                          {course.version || "—"}
                        </TableCell>
                      );
                    }

                    if (column.key === "lastUpdated") {
                      return (
                        <TableCell key="lastUpdated" className={`text-muted-foreground text-sm whitespace-nowrap ${column.responsive || ""}`}>
                          {updateDate}
                        </TableCell>
                      );
                    }

                    return null;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedCourses.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No courses found matching your filters.
        </div>
      )}
    </div>
  );
}
