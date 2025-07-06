import axios from 'axios';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateEmprestimoDto } from '../shared/dtos/create-emprestimo.dto';
import { Emprestimo } from '../shared/interfaces/emprestimo.interface';
import { FuncionarioService } from '../funcionario/funcionario.service';
import { randomUUID } from 'crypto';

import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmprestimoService {
  private emprestimos: Emprestimo[] = [];

  constructor(private readonly funcionarioService: FuncionarioService) {}

  async solicitar(dto: CreateEmprestimoDto): Promise<Emprestimo> {
    const funcionario = this.funcionarioService.buscarPorCpf(dto.cpf);
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    const valorParcela = dto.valorSolicitado / dto.numeroParcelas;
    const limiteParcela = funcionario.salario * 0.3;

    if (valorParcela > limiteParcela) {
      return this.registrarRejeicao(dto, 'Parcela excede 30% do salário');
    }

    const score = await this.obterScoreExternamente();
    const scoreMinimo = this.calcularScoreMinimo(funcionario.salario);

    if (score < scoreMinimo) {
      return this.registrarRejeicao(
        dto,
        `Score insuficiente (mínimo necessário: ${scoreMinimo})`,
      );
    }
    try {
      const response = await axios.post(
        'https://mocki.io/v1/386c594b-d42f-4d14-8036-508a0cf1264c',
      );

      if (response.data.status !== 'aprovado') {
        throw new Error('Falha no pagamento');
      }
    } catch (error) {
      const resultado: Emprestimo = {
        id: randomUUID(),
        cpf: dto.cpf,
        valorSolicitado: dto.valorSolicitado,
        numeroParcelas: dto.numeroParcelas,
        status: 'rejeitado',
        motivo: 'Falha no pagamento',
        criadoEm: new Date().toISOString(),
      };
      this.emprestimos.push(resultado);
      return resultado;
    }

    const emprestimo: Emprestimo = {
      id: randomUUID(),
      cpf: dto.cpf,
      valorSolicitado: dto.valorSolicitado,
      numeroParcelas: dto.numeroParcelas,
      status: 'aprovado',
      criadoEm: new Date().toISOString(),
    };

    this.emprestimos.push(emprestimo);

    return emprestimo;
  }

  private async obterScoreExternamente(): Promise<number> {
    try {
      const { data } = await axios.get(
        'https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf',
      );
      return data.score || 0;
    } catch (err) {
      console.error('Erro ao obter score externo:', err);
      return 0;
    }
  }

  private calcularScoreMinimo(salario: number): number {
    if (salario <= 2000) return 400;
    if (salario <= 4000) return 500;
    if (salario <= 8000) return 600;
    if (salario <= 12000) return 700;
    return 700;
  }

  private registrarRejeicao(
    dto: CreateEmprestimoDto,
    motivo: string,
  ): Emprestimo {
    const emprestimo: Emprestimo = {
      id: randomUUID(),
      cpf: dto.cpf,
      valorSolicitado: dto.valorSolicitado,
      numeroParcelas: dto.numeroParcelas,
      status: 'rejeitado',
      motivo,
      criadoEm: new Date().toISOString(),
    };

    this.emprestimos.push(emprestimo);
    return emprestimo;
  }

  listar(): Emprestimo[] {
    return this.emprestimos;
  }
  listarPorCpf(cpf: string): Emprestimo[] {
    return this.emprestimos.filter((e) => e.cpf === cpf);
  }
}
