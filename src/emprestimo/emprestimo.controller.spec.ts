import { Test, TestingModule } from '@nestjs/testing';
import { EmprestimoController } from './emprestimo.controller';

describe('EmprestimoController', () => {
  let controller: EmprestimoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmprestimoController],
    }).compile();

    controller = module.get<EmprestimoController>(EmprestimoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
