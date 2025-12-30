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
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter } from "lucide-react";

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

type SortField = "name" | "designer" | "location" | "lastUpdated";
type SortDirection = "asc" | "desc" | null;

export function CourseTable({ courses }: CourseTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [designerFilter, setDesignerFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("lastUpdated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Get unique designers for filter
  const designers = useMemo(() => {
    const uniqueDesigners = new Set(
      courses
        .map((c) => c.designer)
        .filter((d): d is string => d !== null)
    );
    return Array.from(uniqueDesigners).sort();
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
          course.location?.toLowerCase().includes(search)
      );
    }

    // Designer filter
    if (designerFilter !== "all") {
      filtered = filtered.filter((course) => course.designer === designerFilter);
    }

    // Tag filter
    if (tagFilter !== "all") {
      filtered = filtered.filter((course) => {
        if (tagFilter === "tourStop") return course.tourStop;
        if (tagFilter === "majorVenue") return course.majorVenue;
        if (tagFilter === "historic") return course.historic;
        return true;
      });
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
  }, [courses, searchTerm, designerFilter, tagFilter, sortField, sortDirection]);

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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, designers, locations..."
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

        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="tourStop">Tour Stops</SelectItem>
            <SelectItem value="majorVenue">Major Venues</SelectItem>
            <SelectItem value="historic">Historic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedCourses.length} of {courses.length} courses
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="hover:bg-transparent p-0 h-auto font-semibold"
                >
                  Course Name
                  <SortIcon field="name" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("designer")}
                  className="hover:bg-transparent p-0 h-auto font-semibold"
                >
                  Designer
                  <SortIcon field="designer" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("location")}
                  className="hover:bg-transparent p-0 h-auto font-semibold"
                >
                  Location
                  <SortIcon field="location" />
                </Button>
              </TableHead>
              <TableHead className="hidden xl:table-cell">Tags</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("lastUpdated")}
                  className="hover:bg-transparent p-0 h-auto font-semibold"
                >
                  Updated
                  <SortIcon field="lastUpdated" />
                </Button>
              </TableHead>
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
                  <TableCell>
                    <Link
                      href={`/courses/${slug}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {course.name}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {course.designer || "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {course.location || "—"}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {course.tourStop && (
                        <Badge variant="default" className="text-xs">
                          Tour
                        </Badge>
                      )}
                      {course.majorVenue && (
                        <Badge variant="default" className="text-xs">
                          Major
                        </Badge>
                      )}
                      {course.historic && (
                        <Badge variant="secondary" className="text-xs">
                          Historic
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {updateDate}
                  </TableCell>
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
