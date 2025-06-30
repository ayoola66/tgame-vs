"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import GameForm from "@/components/admin/games/game-form";
import DeleteConfirmDialog from "@/components/admin/common/delete-confirm-dialog";
import { toast } from "sonner";

interface NestedCategory {
  id: string;
  name: string;
  order: number;
  gameId: string;
}

interface Game {
  id: string;
  name: string;
  description: string;
  type: "STRAIGHT" | "NESTED";
  imageUrl: string;
  isActive: boolean;
  isPremium: boolean;
  nestedCategories: NestedCategory[];
  createdAt: string;
  updatedAt: string;
}

export default function GamesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/games");
      if (!response.ok) throw new Error("Failed to fetch games");
      const data = await response.json();
      setGames(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast.error("Failed to load games");
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGame = async (gameData: FormData) => {
    try {
      const response = await fetch("/api/admin/games", {
        method: "POST",
        body: gameData,
      });

      if (!response.ok) throw new Error("Failed to create game");

      await fetchGames();
      setIsCreateModalOpen(false);
      toast.success("Game created successfully");
    } catch (error) {
      console.error("Error creating game:", error);
      toast.error("Failed to create game");
    }
  };

  const handleEditGame = async (gameData: FormData) => {
    if (!selectedGame) return;

    try {
      const response = await fetch(`/api/admin/games/${selectedGame.id}`, {
        method: "PUT",
        body: gameData,
      });

      if (!response.ok) throw new Error("Failed to update game");

      await fetchGames();
      setIsEditModalOpen(false);
      toast.success("Game updated successfully");
    } catch (error) {
      console.error("Error updating game:", error);
      toast.error("Failed to update game");
    }
  };

  const handleDeleteGame = async () => {
    if (!selectedGame) return;

    try {
      const response = await fetch(`/api/admin/games/${selectedGame.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete game");

      await fetchGames();
      setIsDeleteDialogOpen(false);
      toast.success("Game deleted successfully");
    } catch (error) {
      console.error("Error deleting game:", error);
      toast.error("Failed to delete game");
    }
  };

  const filteredGames = games.filter(
    (game) =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Games Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Game
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Games grid */}
      {isLoading ? (
        <div className="text-center py-10">Loading games...</div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No games available</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Add Your First Game
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <Card key={game.id} className="p-4 space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                {game.imageUrl ? (
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold">{game.name}</h3>
                <p className="text-sm text-gray-500">{game.description}</p>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      game.type === "STRAIGHT"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {game.type}
                  </span>
                  {game.isPremium && (
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      Premium
                    </span>
                  )}
                  {!game.isActive && (
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedGame(game);
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
                    setSelectedGame(game);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <GameForm
          game={selectedGame}
          isOpen={isCreateModalOpen || isEditModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedGame(null);
          }}
          onSubmit={isCreateModalOpen ? handleCreateGame : handleEditGame}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedGame(null);
        }}
        onConfirm={handleDeleteGame}
        title="Delete Game"
        message="Are you sure you want to delete this game? This action cannot be undone."
      />
    </div>
  );
}
