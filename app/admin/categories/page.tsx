"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import CategoryForm from "@/components/admin/categories/category-form";
import DeleteConfirmDialog from "@/components/admin/common/delete-confirm-dialog";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export default function CategoriesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const handleCreateCategory = async (data: Partial<Category>) => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create category");
      await fetchCategories();
      setIsCreateModalOpen(false);
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    }
  };

  const handleUpdateCategory = async (data: Partial<Category>) => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: selectedCategory?.id }),
      });

      if (!response.ok) throw new Error("Failed to update category");
      await fetchCategories();
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      const response = await fetch(
        `/api/admin/categories?id=${selectedCategory.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete category");
      await fetchCategories();
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsEditModalOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  category.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <CategoryForm
        category={null}
        categories={categories}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <CategoryForm
        category={selectedCategory}
        categories={categories}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleUpdateCategory}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
}
