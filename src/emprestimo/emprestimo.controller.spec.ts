import { Test, TestingModule } from '@nestjs/testing';
import { EmprestimoService } from './emprestimo.service';
import { FuncionarioService } from '../funcionario/funcionario.service';
import { CreateEmprestimoDto } from '../shared/dtos/create-emprestimo.dto';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EmprestimoService', () => {
  let service: EmprestimoService;
  let funcionarioService: Partial<FuncionarioService>;

  beforeEach(async () => {
    funcionarioService = {
      buscarPorCpf: jest.fn().mockReturnValue({
        nome: 'João',
        cpf: '12345678900',
        salario: 5000,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmprestimoService,
        { provide: FuncionarioService, useValue: funcionarioService },
      ],
    }).compile();

    service = module.get<EmprestimoService>(EmprestimoService);
  });

  it('deve aprovar empréstimo com score e pagamento válidos', async () => {
    // Mock de score
    mockedAxios.get.mockResolvedValueOnce({ data: { score: 600 } });
    // Mock do gateway de pagamento
    mockedAxios.post.mockResolvedValueOnce({ data: { status: 'aprovado' } });

    const dto: CreateEmprestimoDto = {
      cpf: '12345678900',
      valorSolicitado: 1000,
      numeroParcelas: 3,
    };

    const resultado = await service.solicitar(dto);

    expect(resultado.status).toBe('aprovado');
    expect(resultado.cpf).toBe(dto.cpf);
    expect(resultado.valorSolicitado).toBe(dto.valorSolicitado);
  });

  it('deve rejeitar se score for insuficiente', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { score: 400 } });

    const dto: CreateEmprestimoDto = {
      cpf: '12345678900',
      valorSolicitado: 3000,
      numeroParcelas: 3,
    };

    const resultado = await service.solicitar(dto);
    expect(resultado.status).toBe('rejeitado');
    expect(resultado.motivo).toMatch(/Score insuficiente/i);
  });

  it('deve rejeitar se parcela ultrapassar 30% do salário', async () => {
    const dto: CreateEmprestimoDto = {
      cpf: '12345678900',
      valorSolicitado: 10000,
      numeroParcelas: 1,
    };

    const resultado = await service.solicitar(dto);
    expect(resultado.status).toBe('rejeitado');
    expect(resultado.motivo).toMatch('Parcela excede 30% do salário');
  });

  it('deve rejeitar se gateway de pagamento falhar', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { score: 600 } });
    mockedAxios.post.mockResolvedValueOnce({ data: { status: 'falhou' } });

    const dto: CreateEmprestimoDto = {
      cpf: '12345678900',
      valorSolicitado: 3000,
      numeroParcelas: 3,
    };

    const resultado = await service.solicitar(dto);
    expect(resultado.status).toBe('rejeitado');
    expect(resultado.motivo).toBe('Falha no pagamento');
  });
});
