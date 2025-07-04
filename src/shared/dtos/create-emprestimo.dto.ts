import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateEmprestimoDto {
  @IsNotEmpty()
  cpf: string;

  @IsNumber()
  @Min(100)
  valorSolicitado: number;

  @IsNumber()
  @Min(1)
  numeroParcelas: number;
}
