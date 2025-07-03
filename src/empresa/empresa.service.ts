import { Injectable } from '@nestjs/common';
import { Empresa } from '../shared/interfaces/empresa.interface';
import { CreateEmpresaDto } from '../shared/dtos/create-empresa.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class EmpresaService {
  private empresas: Empresa[] = [];

  async buscarPorId(id: string): Promise<Empresa | undefined> {
    return this.empresas.find((e) => e.id === id);
  }

  async buscarPorEmailOuCnpj(
    email: string,
    cnpj: string,
  ): Promise<Empresa | undefined> {
    return this.empresas.find((e) => e.email === email || e.cnpj === cnpj);
  }

  async criar(dto: CreateEmpresaDto): Promise<Empresa> {
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
}
