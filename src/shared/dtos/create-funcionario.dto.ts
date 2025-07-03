import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class CreateFuncionarioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsEmail()
  email: string;

  @IsString()
  senha: string;

  @IsNumber()
  salario: number;

  @IsString()
  empresaId: string;
}
