import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFuncionarioDto } from '../shared/dtos/create-funcionario.dto';
import { Funcionario } from '../shared/interfaces/funcionario.interface';
import { EmpresaService } from '../empresa/empresa.service';
import { randomUUID } from 'crypto';

@Injectable()
export class FuncionarioService {
  private funcionarios: Funcionario[] = [];

  constructor(private readonly empresaService: EmpresaService) {}

  async criar(dto: CreateFuncionarioDto): Promise<Funcionario> {
    const empresa = this.empresaService.buscarPorId(dto.empresaId);
    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const cpfOuEmailExiste = this.funcionarios.find(
      (f) => f.cpf === dto.cpf || f.email === dto.email,
    );

    if (cpfOuEmailExiste) {
      throw new BadRequestException(
        'Funcionário já cadastrado (CPF ou e-mail duplicado)',
      );
    }

    const funcionario: Funcionario = {
      id: randomUUID(),
      ...dto,
    };

    this.funcionarios.push(funcionario);
    return funcionario;
  }

  listar(): Funcionario[] {
    return this.funcionarios;
  }

  buscarPorCpf(cpf: string): Funcionario | undefined {
    return this.funcionarios.find((f) => f.cpf === cpf);
  }
}
