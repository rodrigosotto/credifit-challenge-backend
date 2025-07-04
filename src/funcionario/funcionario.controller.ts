import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from '../shared/dtos/create-funcionario.dto';

@Controller('funcionarios')
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async criar(@Body() dto: CreateFuncionarioDto) {
    return this.funcionarioService.criar(dto);
  }

  @Get()
  listar() {
    return this.funcionarioService.listar();
  }
}
