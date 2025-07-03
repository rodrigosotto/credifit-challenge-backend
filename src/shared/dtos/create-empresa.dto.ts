import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  razaoSocial: string;

  @IsString()
  @IsNotEmpty()
  nomeResponsavel: string;

  @IsString()
  cpfResponsavel: string;

  @IsEmail()
  email: string;

  @IsString()
  senha: string;
}
