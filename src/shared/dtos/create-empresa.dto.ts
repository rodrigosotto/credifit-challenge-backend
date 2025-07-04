import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateEmpresaDto {
  @IsNotEmpty()
  cnpj: string;

  @IsNotEmpty()
  razaoSocial: string;

  @IsNotEmpty()
  nomeResponsavel: string;

  @IsNotEmpty()
  cpfResponsavel: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6)
  senha: string;
}
