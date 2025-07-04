import axios from 'axios';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateEmprestimoDto } from '../shared/dtos/create-emprestimo.dto';
import { Emprestimo } from '../shared/interfaces/emprestimo.interface';
import { FuncionarioService } from '../funcionario/funcionario.service';
import { randomUUID } from 'crypto';

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

    // ✅ Nova lógica de validação por score
    const score = await this.obterScoreExternamente();
    const scoreMinimo = this.calcularScoreMinimo(funcionario.salario);

    if (score < scoreMinimo) {
      return this.registrarRejeicao(
        dto,
        `Score insuficiente (mínimo necessário: ${scoreMinimo})`,
      );
    }

    // ✅ Aprovado
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
    return 700; // Acima de 12 mil
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
}
