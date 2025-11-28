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
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  usersService,
  type CreateUserData,
  type UpdateUserData,
} from "@/app/lib/users";
import type { User } from "@/app/types";
import UserFormModal from "@/app/components/UserFormModal";
import ConfirmModal from "@/app/components/ConfirmModal";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: CreateUserData | UpdateUserData) => {
    if (isEditMode && selectedUser) {
      await usersService.updateUser(selectedUser.id, data as UpdateUserData);
    } else {
      await usersService.createUser(data as CreateUserData);
    }
    await fetchUsers();
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await usersService.deleteUser(selectedUser.id);
      await fetchUsers();
    }
  };

  const handleBlockUser = async () => {
    if (selectedUser) {
      await usersService.blockUser(selectedUser.id);
      await fetchUsers();
    }
  };

  const handleActivateToggle = async (user: User) => {
    try {
      if (user.status === "ACTIVE") {
        await usersService.deactivateUser(user.id);
      } else if (user.status === "INACTIVE" || user.status === "PENDING") {
        await usersService.activateUser(user.id);
      }
      await fetchUsers();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const handleUnblock = async (user: User) => {
    try {
      await usersService.unblockUser(user.id);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to unblock user:", error);
    }
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "status",
        header: "Status",
        enableColumnFilter: true,
        cell: (info) => {
          const status = info.getValue() as string;
          const statusColors: Record<string, string> = {
            ACTIVE:
              "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
            INACTIVE:
              "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
            PENDING:
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
            BLOCKED:
              "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
          };
          return (
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                statusColors[status] || statusColors.INACTIVE
              }`}
            >
              {status}
            </span>
          );
        },
        filterFn: (row, id, value) => {
          const rowValue = row.getValue(id) as string;
          if (!value || value === "all") return true;
          return rowValue === value;
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
          const user = info.row.original;
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setIsEditMode(true);
                  setIsUserModalOpen(true);
                }}
                className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setIsDeleteModalOpen(true);
                }}
                className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                title="Delete"
              >
                🗑️
              </button>
              {user.status === "BLOCKED" ? (
                <button
                  onClick={() => handleUnblock(user)}
                  className="rounded-md bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                  title="Unblock"
                >
                  🔓
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsBlockModalOpen(true);
                  }}
                  className="rounded-md bg-orange-600 px-2 py-1 text-xs text-white hover:bg-orange-700"
                  title="Block"
                >
                  🚫
                </button>
              )}
              {(user.status === "ACTIVE" ||
                user.status === "INACTIVE" ||
                user.status === "PENDING") && (
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={user.status === "ACTIVE"}
                    onChange={() => handleActivateToggle(user)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </label>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  // Update column filters when status filter changes
  useEffect(() => {
    if (statusFilter === "all") {
      setColumnFilters([]);
    } else {
      setColumnFilters([{ id: "status", value: statusFilter }]);
    }
  }, [statusFilter]);

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      globalFilter,
      columnFilters,
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
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage users and their access
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsEditMode(false);
            setIsUserModalOpen(true);
          }}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create User
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
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
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
          of {table.getFilteredRowModel().rows.length} users
          {statusFilter !== "all" && (
            <span className="ml-2 text-gray-500">
              (filtered from {users.length} total)
            </span>
          )}
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

      {/* Modals */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
          setIsEditMode(false);
        }}
        onSubmit={handleCreateUser}
        user={selectedUser}
        isEdit={isEditMode}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete user "${selectedUser?.email}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

      <ConfirmModal
        isOpen={isBlockModalOpen}
        onClose={() => {
          setIsBlockModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleBlockUser}
        title="Block User"
        message={`Are you sure you want to block user "${selectedUser?.email}"?`}
        confirmText="Block"
        confirmColor="bg-orange-600 hover:bg-orange-700"
      />
    </div>
  );
}
