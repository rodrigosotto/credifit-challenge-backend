import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from '../shared/dtos/create-empresa.dto';
import { BadRequestException } from '@nestjs/common';

describe('EmpresaService', () => {
  let service: EmpresaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpresaService],
    }).compile();

    service = module.get<EmpresaService>(EmpresaService);
  });

  it('deve criar uma nova empresa com dados válidos', async () => {
    const dto: CreateEmpresaDto = {
      cnpj: '12345678000199',
      razaoSocial: 'Credifit Ltda',
      nomeResponsavel: 'Diego Viana',
      cpfResponsavel: '12345678900',
      email: 'contato@credifit.com',
      senha: 'senhaSegura',
    };

    const empresa = await service.criar(dto);

    expect(empresa).toHaveProperty('id');
    expect(empresa.razaoSocial).toBe(dto.razaoSocial);
    expect(empresa.email).toBe(dto.email);
  });

  it('deve lançar erro se CNPJ, e-mail ou CPF já estiverem cadastrados', async () => {
    const dto: CreateEmpresaDto = {
      cnpj: '12345678000199',
      razaoSocial: 'Empresa Original',
      nomeResponsavel: 'Fulano',
      cpfResponsavel: '12345678900',
      email: 'empresa@exemplo.com',
      senha: 'senha123',
    };

    await service.criar(dto);

    const duplicado: CreateEmpresaDto = {
      cnpj: '12345678000199',
      razaoSocial: 'Empresa Duplicada',
      nomeResponsavel: 'Ciclano',
      cpfResponsavel: '98765432100',
      email: 'outro@empresa.com',
      senha: 'outraSenha',
    };

    await expect(service.criar(duplicado)).rejects.toThrow(BadRequestException);
  });

  it('deve listar todas as empresas cadastradas', async () => {
    await service.criar({
      cnpj: '11111111111111',
      razaoSocial: 'Empresa A',
      nomeResponsavel: 'Ana',
      cpfResponsavel: '11111111111',
      email: 'a@empresa.com',
      senha: 'senha123',
    });

    await service.criar({
      cnpj: '22222222222222',
      razaoSocial: 'Empresa B',
      nomeResponsavel: 'Bruno',
      cpfResponsavel: '22222222222',
      email: 'b@empresa.com',
      senha: 'senha456',
    });

    const empresas = service.listar();

    expect(empresas).toHaveLength(2);
    expect(empresas.map((e) => e.razaoSocial)).toEqual(
      expect.arrayContaining(['Empresa A', 'Empresa B']),
    );
  });

  it('deve buscar empresa por ID corretamente', async () => {
    const dto: CreateEmpresaDto = {
      cnpj: '12312312312300',
      razaoSocial: 'Empresa Teste',
      nomeResponsavel: 'Carlos',
      cpfResponsavel: '55555555555',
      email: 'teste@empresa.com',
      senha: 'senha789',
    };

    const empresaCriada = await service.criar(dto);
    const empresaEncontrada = service.buscarPorId(empresaCriada.id);

    expect(empresaEncontrada).toBeDefined();
    expect(empresaEncontrada?.email).toBe('teste@empresa.com');
  });

  it('deve retornar undefined se ID não for encontrado', () => {
    const empresa = service.buscarPorId('id-inexistente');
    expect(empresa).toBeUndefined();
  });
});
