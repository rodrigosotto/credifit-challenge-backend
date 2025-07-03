import { Injectable } from '@nestjs/common';
import { Funcionario } from '../shared/interfaces/funcionario.interface';
import { CreateFuncionarioDto } from '../shared/dtos/create-funcionario.dto';

@Injectable()
export class FuncionarioService {
  private funcionarios: Funcionario[] = [];

  async buscarPorCpf(cpf: string): Promise<Funcionario | undefined> {
    return this.funcionarios.find((f) => f.cpf === cpf);
  }

  async buscarPorCpfOuEmail(
    cpf: string,
    email: string,
  ): Promise<Funcionario | undefined> {
    return this.funcionarios.find((f) => f.cpf === cpf || f.email === email);
  }

  async criar(dto: CreateFuncionarioDto): Promise<Funcionario> {
    const funcionario: Funcionario = {
      ...dto,
    };
    this.funcionarios.push(funcionario);
    return funcionario;
  }

  listar(): Funcionario[] {
    return this.funcionarios;
  }
}
