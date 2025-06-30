"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Game {
  id: string;
  name: string;
  type: "STRAIGHT" | "NESTED";
  Category?: Array<{
    id: string;
    name: string;
    cardNumber: number;
  }>;
}

interface Question {
  id?: string;
  text: string;
  options: string[];
  correctOption: number;
  cardNumber: number;
  isActive: boolean;
  gameId: string;
  categoryId?: string;
}

interface QuestionEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  question?: Question;
}

export default function QuestionEditForm({
  isOpen,
  onClose,
  onRefresh,
  question,
}: QuestionEditFormProps) {
  const [gameType, setGameType] = useState<"STRAIGHT" | "NESTED">("STRAIGHT");
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<number>(1);
  const [text, setText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string>("");
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (question) {
      setText(question.text);
      setOptions(question.options);
      setCorrectOption(question.correctOption);
      setCardNumber(question.cardNumber);
      setSelectedGame(question.gameId);
      setSelectedCategory(question.categoryId || "");
      setIsActive(question.isActive);
    }
  }, [question]);

  useEffect(() => {
    const game = games.find((g) => g.id === selectedGame);
    if (game) {
      setGameType(game.type);
      if (game.type === "NESTED" && !selectedCategory) {
        const firstCategory = game.Category?.[0];
        if (firstCategory) {
          setSelectedCategory(firstCategory.id);
          setCardNumber(firstCategory.cardNumber);
        }
      }
    }
  }, [selectedGame, games]);

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/admin/games");
      if (!response.ok) throw new Error("Failed to fetch games");
      const data = await response.json();
      setGames(data.games);
    } catch (error) {
      console.error("Error fetching games:", error);
      setError("Failed to load games");
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame || !text || options.some((opt) => !opt)) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    const questionData: Question = {
      text,
      options,
      correctOption,
      cardNumber,
      isActive,
      gameId: selectedGame,
      ...(selectedCategory && { categoryId: selectedCategory }),
    };

    if (question?.id) {
      questionData.id = question.id;
    }

    try {
      const response = await fetch(
        question?.id
          ? `/api/admin/questions/${question.id}`
          : "/api/admin/questions",
        {
          method: question?.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save question");
      }

      toast.success(
        question?.id
          ? "Question updated successfully"
          : "Question created successfully"
      );
      onClose();
      onRefresh();
    } catch (error) {
      console.error("Error saving question:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save question"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedGameData = games.find((g) => g.id === selectedGame);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {question ? "Edit Question" : "Create Question"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="game">Select Game</Label>
            <select
              id="game"
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              disabled={!!question}
            >
              <option value="">Select a game</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name} ({game.type})
                </option>
              ))}
            </select>
          </div>

          {selectedGameData?.type === "NESTED" && (
            <div className="space-y-2">
              <Label htmlFor="category">Select Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  const category = selectedGameData.Category?.find(
                    (c) => c.id === e.target.value
                  );
                  if (category) {
                    setCardNumber(category.cardNumber);
                  }
                }}
                className="w-full border rounded-md px-3 py-2"
                disabled={!!question}
              >
                <option value="">Select a category</option>
                {selectedGameData.Category?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} (Card {category.cardNumber})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedGameData?.type === "STRAIGHT" && (
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <select
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(Number(e.target.value))}
                className="w-full border rounded-md px-3 py-2"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    Card {num}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="text">Question Text</Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full"
              placeholder="Enter the question text"
            />
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => (
                <div key={index} className="space-y-1">
                  <Label htmlFor={`option${index + 1}`}>
                    Option {index + 1}
                  </Label>
                  <Input
                    id={`option${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full"
                    placeholder={`Enter option ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctOption">Correct Option</Label>
            <select
              id="correctOption"
              value={correctOption}
              onChange={(e) => setCorrectOption(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2"
            >
              {options.map((_, index) => (
                <option key={index} value={index}>
                  Option {index + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          {error && (
            <div className="flex items-center text-red-600 text-sm mt-2">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Question
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
