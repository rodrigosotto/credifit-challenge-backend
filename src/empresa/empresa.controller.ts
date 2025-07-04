import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from '../shared/dtos/create-empresa.dto';

@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async criar(@Body() dto: CreateEmpresaDto) {
    return this.empresaService.criar(dto);
  }

  @Get()
  listar() {
    return this.empresaService.listar();
  }
}
