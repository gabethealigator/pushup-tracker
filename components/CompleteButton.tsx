'use client'

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface CompleteButtonProps {
  userId: string;
  isCompleted: boolean;
  onComplete: (userId: string) => Promise<void>;
}

export function CompleteButton({ userId, isCompleted, onComplete }: CompleteButtonProps) {
  const userName = userId === 'gabriel' ? 'Gabriel' : 'Mateus';
  
  return (
    <Button 
      className={`w-full ${isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
      onClick={async () => {
        if (!isCompleted) {
          await onComplete(userId);
        }
      }}
      disabled={isCompleted}
    >
      <div className="flex items-center gap-2">
        <span className="text-white">{userName}</span>
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-white" />
        ) : (
          <XCircle className="w-5 h-5 text-white" />
        )}
      </div>
    </Button>
  );
} 