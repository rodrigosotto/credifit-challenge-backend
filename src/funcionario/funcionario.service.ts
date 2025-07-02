import { Injectable } from '@nestjs/common';
import { Funcionario } from '../shared/interfaces/funcionario.interface';

@Injectable()
export class FuncionarioService {
  private funcionarios: Funcionario[] = [
    {
      nome: 'João da Silva',
      cpf: '12345678900',
      email: 'joao@empresa.com',
      senha: '123456',
      salario: 3000,
      empresaId: 'empresa-1',
    },
  ];

  async buscarPorCpf(cpf: string): Promise<Funcionario | undefined> {
    return this.funcionarios.find((f) => f.cpf === cpf);
  }
}
