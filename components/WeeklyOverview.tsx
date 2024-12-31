'use client'

import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function VisaoSemanal() {
  const [semanaAtual, setSemanaAtual] = useState(new Date());
  const [conclusoes, setConclusoes] = useState<any[]>([]);
  
  const navegarSemana = (direcao: 'anterior' | 'proxima') => {
    setSemanaAtual(dataAtual => {
      const novaData = new Date(dataAtual);
      novaData.setDate(dataAtual.getDate() + (direcao === 'anterior' ? -7 : 7));
      return novaData;
    });
  };

  useEffect(() => {
    const buscarConclusoes = async () => {
      const supabase = createClient();
      
      const inicioDaSemana = new Date(semanaAtual);
      const diaDaSemana = semanaAtual.getDay();
      const diferenca = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
      inicioDaSemana.setDate(semanaAtual.getDate() + diferenca);

      const diasDaSemana = Array.from({ length: 7 }, (_, i) => {
        const data = new Date(inicioDaSemana);
        data.setDate(inicioDaSemana.getDate() + i);
        return data.toISOString().split('T')[0];
      });

      const { data } = await supabase
        .from('challenge_completions')
        .select('user_id, challenge_date')
        .in('challenge_date', diasDaSemana);

      setConclusoes(data || []);
    };

    buscarConclusoes();
  }, [semanaAtual]);

  const inicioDaSemana = new Date(semanaAtual);
  const diaDaSemana = semanaAtual.getDay();
  const diferenca = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
  inicioDaSemana.setDate(semanaAtual.getDate() + diferenca);

  const diasDaSemana = Array.from({ length: 7 }, (_, i) => {
    const data = new Date(inicioDaSemana);
    data.setDate(inicioDaSemana.getDate() + i);
    return data.toISOString().split('T')[0];
  });

  return (
    <Card className="w-full max-w-md mt-8 p-6">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navegarSemana('anterior')}
          className="p-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h3 className="text-xl font-bold">Visão Semanal</h3>
        <Button 
          variant="ghost" 
          onClick={() => navegarSemana('proxima')}
          className="p-2"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="space-y-4">
        {diasDaSemana.map((data) => {
          const conclusoesDoDia = conclusoes?.filter(c => c.challenge_date === data) || [];
          const gabrielConcluiu = conclusoesDoDia.some(c => c.user_id === 'gabriel');
          const mateusConcluiu = conclusoesDoDia.some(c => c.user_id === 'mateus');

          return (
            <div key={data} className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {new Date(data).toLocaleDateString('pt-BR', { weekday: 'long' })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-sm">Gabriel</span>
                  {gabrielConcluiu ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">Mateus</span>
                  {mateusConcluiu ? (
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