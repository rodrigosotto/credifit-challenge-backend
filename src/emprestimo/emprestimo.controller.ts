import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmprestimoService } from './emprestimo.service';
import { CreateEmprestimoDto } from '../shared/dtos/create-emprestimo.dto';

@Controller('emprestimos')
export class EmprestimoController {
  constructor(private readonly emprestimoService: EmprestimoService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async solicitarEmprestimo(@Body() dto: CreateEmprestimoDto) {
    return this.emprestimoService.solicitar(dto);
  }

  @Get()
  listar() {
    return this.emprestimoService.listar();
  }

  @Get(':cpf')
  buscarPorCpf(@Param('cpf') cpf: string) {
    return this.emprestimoService.listarPorCpf(cpf);
  }
}
