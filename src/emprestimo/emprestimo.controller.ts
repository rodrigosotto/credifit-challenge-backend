// src/emprestimo/emprestimo.controller.ts

import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEmprestimoDto } from './../shared/dtos/create-emprestimo.dto';
import { EmprestimoService } from './emprestimo.service';

import { FuncionarioService } from '../funcionario/funcionario.service';
import { EmpresaService } from '../empresa/empresa.service';


@Controller('emprestimos')
export class EmprestimoController {
  constructor(private readonly emprestimoService: EmprestimoService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async solicitarEmprestimo(@Body() dto: CreateEmprestimoDto) {
    return this.emprestimoService.solicitar(dto);
  }

  @Get()
  listarEmprestimos() {
    return this.emprestimoService.listar();
  }
}
