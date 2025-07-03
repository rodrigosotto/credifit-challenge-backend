import {
  Body,
  Controller,
  Post,
  Get,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from '../shared/dtos/create-funcionario.dto';
import { EmpresaService } from '../empresa/empresa.service';

@Controller('funcionarios')
export class FuncionarioController {
  constructor(
    private readonly funcionarioService: FuncionarioService,
    private readonly empresaService: EmpresaService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async criarFuncionario(@Body() dto: CreateFuncionarioDto) {
    const existe = await this.funcionarioService.buscarPorCpf(dto.cpf);
    if (existe) {
      throw new BadRequestException('Funcionário já cadastrado');
    }

    const empresa = await this.empresaService.buscarPorId(dto.empresaId);
    if (!empresa) {
      throw new BadRequestException('Empresa não encontrada');
    }

    return this.funcionarioService.criar(dto);
  }

  @Get()
  async listarFuncionarios() {
    return this.funcionarioService.listar();
  }
}
