"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  parentId?: string | null;
}

interface CategoryFormProps {
  category?: Category | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Category>) => void;
}

export default function CategoryForm({
  category,
  categories,
  isOpen,
  onClose,
  onSubmit,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    description: "",
    imageUrl: "",
    isActive: true,
    parentId: null,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        ...category,
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  // Filter out the current category and its children from parent options
  const getAvailableParents = () => {
    const isChildOf = (parentId: string, childId: string): boolean => {
      const child = categories.find((c) => c.id === childId);
      if (!child) return false;
      if (child.parentId === parentId) return true;
      if (child.parentId) return isChildOf(parentId, child.parentId);
      return false;
    };

    return categories.filter((c) => {
      if (category && c.id === category.id) return false;
      if (category && isChildOf(category.id, c.id)) return false;
      return true;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {category ? "Edit Category" : "Create New Category"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full border rounded-md p-2 min-h-[100px]"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Category</Label>
            <select
              id="parentId"
              className="w-full border rounded-md p-2"
              value={formData.parentId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parentId: e.target.value || null,
                })
              }
            >
              <option value="">None (Top Level)</option>
              {getAvailableParents().map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {category ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
