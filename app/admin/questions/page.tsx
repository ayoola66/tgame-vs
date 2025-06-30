"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuestionCard from "@/components/admin/questions/question-card";
import QuestionForm from "@/components/admin/questions/question-form";
import { useToast } from "@/components/ui/use-toast";
import EditDialog from "@/components/admin/questions/edit-dialog";
import DeleteDialog from "@/components/admin/questions/delete-dialog";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  cardNumber: number;
  isActive: boolean;
  gameId: string;
  game: {
    id: string;
    name: string;
    type: "STRAIGHT" | "NESTED";
  };
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        search: searchQuery,
      });

      const gameId = searchParams.get("gameId");
      const categoryId = searchParams.get("categoryId");
      if (gameId) params.append("gameId", gameId);
      if (categoryId) params.append("categoryId", categoryId);

      const response = await fetch(`/api/admin/questions?${params}`);
      if (!response.ok) throw new Error("Failed to fetch questions");

      const data = await response.json();
      setQuestions(data.questions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, searchQuery, searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (question: Question) => {
    setSelectedQuestion(question);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSave = async (updatedQuestion: Question) => {
    try {
      const response = await fetch(
        `/api/admin/questions/${updatedQuestion.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedQuestion),
        }
      );

      if (!response.ok) throw new Error("Failed to update question");

      toast({
        title: "Success",
        description: "Question updated successfully",
      });
      setIsEditDialogOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error("Error updating question:", error);
      toast({
        title: "Error",
        description: "Failed to update question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedQuestion) return;

    try {
      const response = await fetch(
        `/api/admin/questions/${selectedQuestion.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete question");

      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <QuestionForm onSuccess={fetchQuestions} />
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-10">No questions found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {selectedQuestion && (
        <>
          <EditDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSave={handleEditSave}
            question={selectedQuestion}
          />
          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            question={selectedQuestion}
          />
        </>
      )}
    </div>
  );
}
