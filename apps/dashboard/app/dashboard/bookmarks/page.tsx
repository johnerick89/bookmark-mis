"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { bookmarksService } from "@/app/lib/bookmarks";
import type { Bookmark, CreateBookmarkDto } from "@/app/types";
import BookmarkFormModal from "@/app/components/BookmarkFormModal";
import ConfirmModal from "@/app/components/ConfirmModal";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Modal states
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const data = await bookmarksService.getAllBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBookmark = async (data: CreateBookmarkDto) => {
    await bookmarksService.createBookmark(data);
    await fetchBookmarks();
  };

  const handleDeleteBookmark = async () => {
    if (selectedBookmark) {
      await bookmarksService.deleteBookmark(selectedBookmark.id);
      await fetchBookmarks();
    }
  };

  const columns = useMemo<ColumnDef<Bookmark>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => {
          const bookmark = info.row.original;
          return (
            <div>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {info.getValue() as string}
              </a>
            </div>
          );
        },
      },
      {
        accessorKey: "url",
        header: "URL",
        cell: (info) => {
          const url = info.getValue() as string;
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {url.length > 50 ? `${url.substring(0, 50)}...` : url}
            </a>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (info) => {
          const description = info.getValue() as string | undefined;
          return (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {description || "—"}
            </span>
          );
        },
      },
      {
        accessorKey: "tags",
        header: "Tags",
        cell: (info) => {
          const tags = info.getValue() as
            | { id: string; name: string }[]
            | undefined;
          if (!tags || tags.length === 0) {
            return <span className="text-sm text-gray-400">—</span>;
          }
          return (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Created",
        cell: (info) => {
          const date = info.getValue() as string;
          return date ? new Date(date).toLocaleDateString() : "—";
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const bookmark = info.row.original;
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setSelectedBookmark(bookmark);
                  setIsDeleteModalOpen(true);
                }}
                className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: bookmarks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Loading bookmarks...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bookmarks
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your bookmarks
          </p>
        </div>
        <button
          onClick={() => setIsBookmarkModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Bookmark
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search bookmarks..."
          className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No bookmarks found. Create your first bookmark!
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {table.getFilteredRowModel().rows.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} bookmarks
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <BookmarkFormModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        onSubmit={handleCreateBookmark}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBookmark(null);
        }}
        onConfirm={handleDeleteBookmark}
        title="Delete Bookmark"
        message={`Are you sure you want to delete "${selectedBookmark?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
