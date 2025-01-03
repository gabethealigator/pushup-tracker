import { createClient } from "@/utils/supabase/server";
import { Card } from "@/components/ui/card";
import WeeklyOverview from "@/components/WeeklyOverview";
import { CompleteButton } from "@/components/CompleteButton";
import { revalidatePath } from "next/cache";

async function markComplete(userId: string) {
  'use server'
  
  const supabase = await createClient();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const { error } = await supabase
    .from('challenge_completions')
    .upsert({
      user_id: userId,
      challenge_date: tomorrow.toISOString().split('T')[0]
    }, {
      onConflict: 'user_id,challenge_date'
    });

  if (error) {
    console.error('Error marking complete:', error);
    return;
  }

  revalidatePath('/');
}

export default async function App() {
  const supabase = await createClient();
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formattedDate = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const tomorrowISO = tomorrow.toISOString().split('T')[0];

  const { data: completions } = await supabase
    .from('challenge_completions')
    .select('user_id, challenge_date')
    .eq('challenge_date', tomorrowISO);

  const gabrielCompleted = completions?.some(c => c.user_id === 'gabriel') ?? false;
  const mateusCompleted = completions?.some(c => c.user_id === 'mateus') ?? false;

  const startDate = new Date('2024-12-19');
  const daysDifference = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const pushupCount = daysDifference + 1;

  return (
    <main className="flex min-h-screen flex-col items-center p-3 justify-center">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{formattedDate}</h2>
          <p className="text-4xl font-bold">{pushupCount} Flexões Hoje</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CompleteButton 
            userId="gabriel" 
            onComplete={markComplete} 
            isCompleted={gabrielCompleted}
          />
          <CompleteButton 
            userId="mateus" 
            onComplete={markComplete} 
            isCompleted={mateusCompleted}
          />
        </div>
      </Card>

      <WeeklyOverview />
    </main>
  );
}
