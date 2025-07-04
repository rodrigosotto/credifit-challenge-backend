export interface Emprestimo {
  id: string;
  cpf: string;
  valorSolicitado: number;
  numeroParcelas: number;
  status: 'aprovado' | 'rejeitado';
  motivo?: string;
  criadoEm: string;
}
