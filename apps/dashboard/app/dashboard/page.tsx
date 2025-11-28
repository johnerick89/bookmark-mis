"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import api from "@/app/lib/api";
import type { Stats, Bookmark } from "@/app/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalBookmarks: 0,
    totalTags: 0,
    recentBookmarks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [bookmarksRes, tagsRes] = await Promise.all([
          api.get("/bookmarks"),
          api.get("/tags"),
        ]);

        const bookmarks = bookmarksRes.data || [];
        const tags = tagsRes.data || [];

        // Get recent bookmarks (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentBookmarks = bookmarks.filter((bookmark: Bookmark) => {
          const createdAt = new Date(bookmark.created_at);
          return createdAt >= sevenDaysAgo;
        });

        setStats({
          totalBookmarks: bookmarks.length,
          totalTags: tags.length,
          recentBookmarks: recentBookmarks.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Loading stats...
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Bookmarks",
      value: stats.totalBookmarks,
      icon: "🔖",
      color: "bg-blue-500",
    },
    {
      title: "Total Tags",
      value: stats.totalTags,
      icon: "🏷️",
      color: "bg-green-500",
    },
    {
      title: "Recent Bookmarks",
      value: stats.recentBookmarks,
      icon: "📅",
      color: "bg-purple-500",
      subtitle: "Last 7 days",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your bookmark management dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div
                  className={`${stat.color} flex h-12 w-12 items-center justify-center rounded-lg text-2xl`}
                >
                  {stat.icon}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <a
            href="/dashboard/bookmarks"
            className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <span className="text-2xl">🔖</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Manage Bookmarks
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View and organize your bookmarks
              </p>
            </div>
          </a>
          <a
            href="/dashboard/tags"
            className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <span className="text-2xl">🏷️</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Manage Tags
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Organize your bookmarks with tags
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
