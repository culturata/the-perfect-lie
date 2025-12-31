"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, Settings2, Eye, EyeOff } from "lucide-react";

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
  const [hideBeta, setHideBeta] = useState(false);
  const [sortField, setSortField] = useState<SortField>("lastUpdated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Column visibility configuration
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: "name", label: "Course Name", visible: true, sortable: true },
    { key: "designer", label: "Designer", visible: true, sortable: true, responsive: "hidden md:table-cell" },
    { key: "location", label: "Location", visible: true, sortable: true, responsive: "hidden lg:table-cell" },
    { key: "server", label: "Server", visible: true, sortable: true, responsive: "hidden lg:table-cell" },
    { key: "version", label: "Version", visible: true, sortable: true, responsive: "hidden xl:table-cell" },
    { key: "lastUpdated", label: "Updated", visible: true, sortable: true },
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

    // Hide beta courses filter
    if (hideBeta) {
      filtered = filtered.filter(
        (course) => course.server?.toLowerCase() !== "beta"
      );
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
  }, [courses, searchTerm, designerFilter, serverFilter, hideBeta, sortField, sortDirection]);

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
  const betaCount = courses.filter((c) => c.server?.toLowerCase() === "beta").length;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, designers, locations, server, version..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={designerFilter} onValueChange={setDesignerFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
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
            <SelectTrigger className="w-full md:w-[180px]">
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
              <Button variant="outline" className="w-full md:w-auto">
                <Settings2 className="mr-2 h-4 w-4" />
                Columns
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

        {/* Beta toggle and results count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hide-beta"
                checked={hideBeta}
                onCheckedChange={(checked) => setHideBeta(checked === true)}
              />
              <label
                htmlFor="hide-beta"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
              >
                {hideBeta ? <EyeOff className="inline h-4 w-4 mr-1" /> : <Eye className="inline h-4 w-4 mr-1" />}
                Hide Beta Courses
                <Badge variant="secondary" className="ml-2">
                  {betaCount}
                </Badge>
              </label>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedCourses.length} of {courses.length} courses
          </div>
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
                      return (
                        <TableCell key="server" className={column.responsive || ""}>
                          {course.server ? (
                            <Badge
                              variant={course.server.toLowerCase() === "beta" ? "destructive" : "secondary"}
                              className="whitespace-nowrap"
                            >
                              {course.server}
                            </Badge>
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
