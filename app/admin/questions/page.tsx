"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import QuestionForm from "@/components/admin/questions/question-form";
import DeleteConfirmDialog from "@/components/admin/common/delete-confirm-dialog";

export default function QuestionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Placeholder data - will be replaced with actual API calls
  const questions = [
    {
      id: "1",
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
      difficulty: 1,
      categoryId: "1",
      category: { name: "Mathematics" },
      isActive: true,
    },
    // Add more sample questions
  ];

  const categories = [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Algebra" },
    // Add more categories
  ];

  const handleCreateQuestion = async (questionData) => {
    // TODO: Implement question creation API call
    setIsCreateModalOpen(false);
  };

  const handleEditQuestion = async (questionData) => {
    // TODO: Implement question update API call
    setIsEditModalOpen(false);
  };

  const handleDeleteQuestion = async () => {
    // TODO: Implement question deletion API call
    setIsDeleteDialogOpen(false);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || q.categoryId === selectedCategory;
    const matchesDifficulty =
      !selectedDifficulty || q.difficulty === parseInt(selectedDifficulty);
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Questions Management
        </h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Question
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="border rounded-md px-3 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="border rounded-md px-3 py-2"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="">All Difficulties</option>
          {[1, 2, 3, 4, 5].map((level) => (
            <option key={level} value={level}>
              Level {level}
            </option>
          ))}
        </select>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {question.category.name}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    Level {question.difficulty}
                  </span>
                  {!question.isActive && (
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-medium">{question.question}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        index === question.correctAnswer
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-50"
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedQuestion(question);
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
                    setSelectedQuestion(question);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <QuestionForm
          question={selectedQuestion}
          categories={categories}
          isOpen={isCreateModalOpen || isEditModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedQuestion(null);
          }}
          onSubmit={
            isCreateModalOpen ? handleCreateQuestion : handleEditQuestion
          }
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteQuestion}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
      />
    </div>
  );
}
