import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  question: Question;
}

export default function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  question,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Question</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this question?
            <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
              {question.text}
            </div>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
