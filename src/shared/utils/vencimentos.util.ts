import dayjs from 'dayjs';

export function calcularVencimentos(parcelas: number): string[] {
  const vencimentos: string[] = [];
  const hoje = dayjs();

  for (let i = 1; i <= parcelas; i++) {
    vencimentos.push(hoje.add(i, 'month').format('DD/MM/YYYY'));
  }

  return vencimentos;
}