"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GameFormProps {
  game?: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function GameForm({
  game,
  isOpen,
  onClose,
  onSubmit,
}: GameFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "STRAIGHT",
    image: null as File | null,
    imageUrl: "",
    categoryId: "",
    isActive: true,
    isPremium: false,
    nestedCategories: ["", "", "", "", ""] as string[],
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (game) {
      setFormData({
        ...game,
        image: null,
        nestedCategories: game.nestedCategories || ["", "", "", "", ""],
      });
      if (game.imageUrl) {
        setImagePreview(game.imageUrl);
      }
    }
  }, [game]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        alert("Image size must be less than 2MB");
        return;
      }
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNestedCategoryChange = (index: number, value: string) => {
    const newCategories = [...formData.nestedCategories];
    newCategories[index] = value;
    setFormData({ ...formData, nestedCategories: newCategories });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData for multipart/form-data submission
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image" && value instanceof File) {
        submitData.append("image", value);
      } else if (key === "nestedCategories") {
        submitData.append("nestedCategories", JSON.stringify(value));
      } else if (typeof value === "boolean") {
        submitData.append(key, value.toString());
      } else if (value !== null) {
        submitData.append(key, String(value));
      }
    });

    onSubmit(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{game ? "Edit Game" : "Create New Game"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Game Name</Label>
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
              <Label htmlFor="type">Game Type</Label>
              <select
                id="type"
                className="w-full border rounded-md p-2"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                <option value="STRAIGHT">Straight</option>
                <option value="NESTED">Nested</option>
              </select>
            </div>
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
            <Label htmlFor="image">Game Image (Max 2MB)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-2"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-xs h-auto rounded"
                />
              </div>
            )}
          </div>

          {formData.type === "NESTED" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Nested Game Categories</h3>
              <p className="text-sm text-gray-500">
                Define 5 categories for cards 1-5 (card 6 is reserved for
                special gameplay)
              </p>
              {formData.nestedCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`category-${index}`}>
                    Category {index + 1}
                  </Label>
                  <Input
                    id={`category-${index}`}
                    value={category}
                    onChange={(e) =>
                      handleNestedCategoryChange(index, e.target.value)
                    }
                    required={formData.type === "NESTED"}
                    placeholder={`Enter category ${index + 1} name`}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPremium}
                onChange={(e) =>
                  setFormData({ ...formData, isPremium: e.target.checked })
                }
              />
              Premium
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {game ? "Update Game" : "Create Game"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
