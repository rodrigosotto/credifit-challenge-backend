import { Injectable, BadRequestException } from '@nestjs/common';
import { Empresa } from '../shared/interfaces/empresa.interface';
import { CreateEmpresaDto } from '../shared/dtos/create-empresa.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class EmpresaService {
  private empresas: Empresa[] = [];

  async criar(dto: CreateEmpresaDto): Promise<Empresa> {
    const jaExiste = this.empresas.find(
      (e) =>
        e.cnpj === dto.cnpj ||
        e.cpfResponsavel === dto.cpfResponsavel ||
        e.email === dto.email,
    );

    if (jaExiste) {
      throw new BadRequestException('CNPJ, CPF ou e-mail já cadastrados.');
    }

    const empresa: Empresa = {
      id: randomUUID(),
      ...dto,
    };

    this.empresas.push(empresa);
    return empresa;
  }

  listar(): Empresa[] {
    return this.empresas;
  }

  buscarPorId(id: string): Empresa | undefined {
    return this.empresas.find((e) => e.id === id);
  }
}
