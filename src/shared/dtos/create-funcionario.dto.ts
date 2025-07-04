import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateFuncionarioDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  cpf: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  senha: string;

  @IsNumber()
  @Min(0)
  salario: number;

  @IsNotEmpty()
  empresaId: string;
}
