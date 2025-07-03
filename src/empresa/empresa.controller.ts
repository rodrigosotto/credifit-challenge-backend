import {
  Body,
  Controller,
  Post,
  BadRequestException,
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
  async criarEmpresa(@Body() dto: CreateEmpresaDto) {
    const exists = await this.empresaService.buscarPorEmailOuCnpj(dto.email, dto.cnpj);
    if (exists) {
      throw new BadRequestException('Empresa já cadastrada com este e-mail ou CNPJ');
    }

    const empresa = await this.empresaService.criar(dto);
    return empresa;
  }
}
