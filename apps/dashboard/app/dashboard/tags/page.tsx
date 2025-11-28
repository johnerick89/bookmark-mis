"use client";

import { useEffect, useState } from "react";
import { tagsService } from "@/app/lib/tags";
import type { Tag, CreateTagDto } from "@/app/types";
import TagFormModal from "@/app/components/TagFormModal";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await tagsService.getAllTags();
      setTags(data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (data: CreateTagDto) => {
    await tagsService.createTag(data);
    await fetchTags();
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Loading tags...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tags
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your tags
          </p>
        </div>
        <button
          onClick={() => setIsTagModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Tag
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tags..."
          className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Tags Grid */}
      {filteredTags.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery
              ? "No tags found matching your search."
              : "No tags yet. Create your first tag!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl dark:bg-blue-900/20">
                  🏷️
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {tag.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tag._count?.bookmarks || 0} bookmark
                  {(tag._count?.bookmarks || 0) !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tag Form Modal */}
      <TagFormModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSubmit={handleCreateTag}
      />
    </div>
  );
}
