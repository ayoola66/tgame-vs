import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
  question: Question;
}

export default function EditDialog({
  isOpen,
  onClose,
  onSave,
  question: initialQuestion,
}: EditDialogProps) {
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [options, setOptions] = useState<string[]>(initialQuestion.options);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    setQuestion({ ...question, options: newOptions });
  };

  const handleSave = () => {
    onSave(question);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="question">Question Text</Label>
            <Input
              id="question"
              value={question.text}
              onChange={(e) =>
                setQuestion({ ...question, text: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          {options.map((option, index) => (
            <div key={index} className="grid gap-2">
              <Label htmlFor={`option-${index}`}>
                Option {String.fromCharCode(65 + index)}
                {index === question.correctOption && " (Correct)"}
              </Label>
              <Input
                id={`option-${index}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            </div>
          ))}
          <div className="grid gap-2">
            <Label htmlFor="correctOption">Correct Option</Label>
            <select
              id="correctOption"
              value={question.correctOption}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  correctOption: parseInt(e.target.value),
                })
              }
              className="border rounded-md px-3 py-2"
            >
              {options.map((_, index) => (
                <option key={index} value={index}>
                  Option {String.fromCharCode(65 + index)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <select
              id="cardNumber"
              value={question.cardNumber}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  cardNumber: parseInt(e.target.value),
                })
              }
              className="border rounded-md px-3 py-2"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  Card {num}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
