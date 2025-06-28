"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Search, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import CategoryForm from "@/components/admin/categories/category-form";
import DeleteConfirmDialog from "@/components/admin/common/delete-confirm-dialog";

export default function CategoriesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Placeholder data - will be replaced with actual API calls
  const categories = [
    {
      id: "1",
      name: "Mathematics",
      description: "Math-related games and questions",
      imageUrl: "/math.jpg",
      isActive: true,
      parentId: null,
    },
    {
      id: "2",
      name: "Algebra",
      description: "Algebraic concepts and problems",
      imageUrl: "/algebra.jpg",
      isActive: true,
      parentId: "1",
    },
    // Add more sample categories
  ];

  const handleCreateCategory = async (categoryData) => {
    // TODO: Implement category creation API call
    setIsCreateModalOpen(false);
  };

  const handleEditCategory = async (categoryData) => {
    // TODO: Implement category update API call
    setIsEditModalOpen(false);
  };

  const handleDeleteCategory = async () => {
    // TODO: Implement category deletion API call
    setIsDeleteDialogOpen(false);
  };

  const renderCategoryCard = (category) => {
    const hasChildren = categories.some((c) => c.parentId === category.id);
    const parent = categories.find((c) => c.id === category.parentId);

    return (
      <Card key={category.id} className="p-4 space-y-4">
        <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <FolderTree className="h-12 w-12" />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.description}</p>
          {parent && (
            <p className="text-sm text-gray-400 mt-1">Parent: {parent.name}</p>
          )}
          {hasChildren && (
            <span className="inline-block px-2 py-1 mt-2 text-xs bg-blue-100 text-blue-800 rounded-full">
              Has subcategories
            </span>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory(category);
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setSelectedCategory(category);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Categories Management
        </h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(renderCategoryCard)}
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <CategoryForm
          category={selectedCategory}
          categories={categories}
          isOpen={isCreateModalOpen || isEditModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedCategory(null);
          }}
          onSubmit={
            isCreateModalOpen ? handleCreateCategory : handleEditCategory
          }
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone and will affect all associated games and questions."
      />
    </div>
  );
}
