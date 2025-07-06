import { Test, TestingModule } from '@nestjs/testing';
import { FuncionarioService } from './funcionario.service';
import { EmpresaService } from '../empresa/empresa.service';
import { CreateFuncionarioDto } from '../shared/dtos/create-funcionario.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('FuncionarioService', () => {
  let service: FuncionarioService;
  let empresaServiceMock: Partial<EmpresaService>;

  beforeEach(async () => {
    empresaServiceMock = {
      buscarPorId: jest
        .fn()
        .mockReturnValue({ id: 'empresa-1', nome: 'Empresa Teste' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuncionarioService,
        { provide: EmpresaService, useValue: empresaServiceMock },
      ],
    }).compile();

    service = module.get<FuncionarioService>(FuncionarioService);
  });

  it('deve criar um funcionário com dados válidos', async () => {
    const dto: CreateFuncionarioDto = {
      nome: 'Carlos',
      cpf: '12345678900',
      email: 'carlos@email.com',
      senha: 'senha123',
      salario: 2500,
      empresaId: 'empresa-1',
    };

    const resultado = await service.criar(dto);
    expect(resultado).toHaveProperty('id');
    expect(resultado.nome).toBe(dto.nome);
    expect(resultado.cpf).toBe(dto.cpf);
  });

  it('deve lançar erro se empresa não existir', async () => {
    (empresaServiceMock.buscarPorId as jest.Mock).mockReturnValueOnce(
      undefined,
    );

    const dto: CreateFuncionarioDto = {
      nome: 'Carlos',
      cpf: '12345678900',
      email: 'carlos@email.com',
      senha: 'senha123',
      salario: 2500,
      empresaId: 'empresa-invalida',
    };

    await expect(service.criar(dto)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar erro se CPF ou e-mail já estiverem cadastrados', async () => {
    const dto: CreateFuncionarioDto = {
      nome: 'Carlos',
      cpf: '12345678900',
      email: 'carlos@email.com',
      senha: 'senha123',
      salario: 2500,
      empresaId: 'empresa-1',
    };

    await service.criar(dto);

    const duplicado: CreateFuncionarioDto = {
      nome: 'Outro',
      cpf: '12345678900',
      email: 'outro@email.com',
      senha: 'outraSenha',
      salario: 2000,
      empresaId: 'empresa-1',
    };

    await expect(service.criar(duplicado)).rejects.toThrow(BadRequestException);
  });

  it('deve buscar funcionário por CPF corretamente', async () => {
    const dto: CreateFuncionarioDto = {
      nome: 'Joana',
      cpf: '98765432100',
      email: 'joana@email.com',
      senha: 'senhaJoana',
      salario: 3200,
      empresaId: 'empresa-1',
    };

    await service.criar(dto);

    const encontrado = service.buscarPorCpf('98765432100');
    expect(encontrado).toBeDefined();
    expect(encontrado?.email).toBe('joana@email.com');
  });

  it('deve listar todos os funcionários', async () => {
    await service.criar({
      nome: 'Um',
      cpf: '11111111111',
      email: 'um@email.com',
      senha: 'senha',
      salario: 1500,
      empresaId: 'empresa-1',
    });

    await service.criar({
      nome: 'Dois',
      cpf: '22222222222',
      email: 'dois@email.com',
      senha: 'senha',
      salario: 1800,
      empresaId: 'empresa-1',
    });

    const lista = service.listar();
    expect(lista.length).toBe(2);
    expect(lista.map((f) => f.nome)).toEqual(
      expect.arrayContaining(['Um', 'Dois']),
    );
  });
});
