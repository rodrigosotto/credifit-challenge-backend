import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateEmprestimoDto } from './../shared/dtos/create-emprestimo.dto';
import { Funcionario } from '../shared/interfaces/funcionario.interface';
import { Empresa } from '../shared/interfaces/empresa.interface';
import { REGRAS_SCORE } from '../shared/constants/score-regras.constant';
import { calcularVencimentos } from '../shared/utils/vencimentos.util';
import { StatusEmprestimo } from '../shared/enums/status-emprestimo.enum';
import axios from 'axios';
import dayjs from 'dayjs';

@Injectable()
export class EmprestimoService {
  private emprestimos: any[] = [];

  async solicitar(dto: CreateEmprestimoDto) {
    const funcionario = await this.buscarFuncionarioPorCpf(dto.cpf);
    if (!funcionario) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    const empresa = await this.buscarEmpresaPorFuncionario(funcionario);
    if (!empresa) {
      throw new BadRequestException('Empresa não conveniada');
    }

    const parcela = dto.valorSolicitado / dto.numeroParcelas;
    const maxParcelaPermitida = funcionario.salario * 0.35;
    if (parcela > maxParcelaPermitida) {
      throw new BadRequestException('Margem consignável excedida');
    }
    const score = await this.consultarScore(funcionario.cpf);

    const scoreMinimo = this.obterScoreMinimo(funcionario.salario);
    if (score < scoreMinimo) {
      const resultado = {
        status: 'rejeitado',
        cpf: dto.cpf,
        valor: dto.valorSolicitado,
        motivo: 'Score insuficiente', // ou "Falha no pagamento"
        criadoEm: new Date().toISOString(),
      };

      this.emprestimos.push(resultado);
      return resultado;
    }

    const datas = this.calcularVencimentos(dto.numeroParcelas);

    const pagamento = await this.simularPagamento();
    if (pagamento.status !== 'aprovado') {
      const resultado = {
        status: 'rejeitado',
        cpf: dto.cpf,
        valor: dto.valorSolicitado,
        motivo: 'Score insuficiente', // ou "falha no pagamento"
        criadoEm: new Date().toISOString(),
      };

      this.emprestimos.push(resultado);
      return resultado;
    }

    const resultado = {
      status: 'aprovado',
      cpf: dto.cpf,
      valor: dto.valorSolicitado,
      parcelas: dto.numeroParcelas,
      valorParcela: parcela,
      vencimentos: datas,
      criadoEm: new Date().toISOString(),
    };

    this.emprestimos.push(resultado);
    return resultado;
  }
  
  listar() {
    return this.emprestimos;
  }

  // metodos auxiliares

private async buscarFuncionarioPorCpf(cpf: string): Promise<Funcionario | null> {
  return {
    nome: 'João da Silva',
    cpf,
    salario: 3000,
    empresaId: 'empresa-1',
    email: 'joao.silva@example.com',
    senha: '123456'
  };
}


  private async buscarEmpresaPorFuncionario(funcionario: any) {
    // mock temporario
    if (funcionario.empresaId === 'empresa-1') {
      return {
        id: 'empresa-1',
        nome: 'Empresa XPTO',
        cnpj: '00000000000100',
      };
    }
    return null;
  }

  private async consultarScore(cpf: string): Promise<number> {
    try {
      const { data } = await axios.get(
        'https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf',
      );
      return data.score ?? 0;
    } catch {
      return 0; // score invalido se mock falhar
    }
  }

  private obterScoreMinimo(salario: number): number {
    if (salario <= 2000) return 400;
    if (salario <= 4000) return 500;
    if (salario <= 8000) return 600;
    return 700;
  }

  private calcularVencimentos(parcelas: number): string[] {
    const vencimentos: string[] = [];
    const hoje = dayjs();

    for (let i = 1; i <= parcelas; i++) {
      vencimentos.push(hoje.add(i, 'month').format('DD/MM/YYYY'));
    }

    return vencimentos;
  }

  private async simularPagamento(): Promise<{ status: string }> {
    try {
      const { data } = await axios.get(
        'https://mocki.io/v1/386c594b-d42f-4d14-8036-508a0cf1264c',
      );
      return data;
    } catch {
      return { status: 'rejeitado' };
    }
  }
}
