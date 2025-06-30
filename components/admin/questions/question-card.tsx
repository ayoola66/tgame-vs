import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../../../components/ui/badge";

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

interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (question: Question) => void;
}

export default function QuestionCard({
  question,
  onEdit,
  onDelete,
}: QuestionCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {question.text}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(question)}
              title="Edit question"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(question)}
              title="Delete question"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
          <Badge variant="secondary">Card {question.cardNumber}</Badge>
          <Badge variant="outline">{question.game.name}</Badge>
          {question.category && (
            <Badge variant="outline">{question.category.name}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`p-2 rounded-md ${
                index === question.correctOption
                  ? "bg-green-100 border border-green-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
