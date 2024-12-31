import { createClient } from "@/utils/supabase/server";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function WeeklyOverview() {
  const supabase = await createClient();
  
  const today = new Date();
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; 
  startOfWeek.setDate(today.getDate() + diff);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const { data: completions } = await supabase
    .from('challenge_completions')
    .select('user_id, challenge_date')
    .in('challenge_date', weekDays);

  return (
    <Card className="w-full max-w-md mt-8 p-6">
      <h3 className="text-xl font-bold mb-4">Visão Semanal</h3>
      <div className="space-y-4">
        {weekDays.map((date) => {
          const dayCompletions = completions?.filter(c => c.challenge_date === date) || [];
          const gabrielDone = dayCompletions.some(c => c.user_id === 'gabriel');
          const mateusDone = dayCompletions.some(c => c.user_id === 'mateus');

          return (
            <div key={date} className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {new Date(date).toLocaleDateString('pt-BR', { weekday: 'long' })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-sm">Gabriel</span>
                  {gabrielDone ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">Mateus</span>
                  {mateusDone ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
} 