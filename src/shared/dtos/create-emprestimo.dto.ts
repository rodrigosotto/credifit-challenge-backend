import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateEmprestimoDto {
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsNumber()
  @Min(1)
  valorSolicitado: number;

  @IsNumber()
  @Min(1)
  @Max(4)
  numeroParcelas: number;
}
