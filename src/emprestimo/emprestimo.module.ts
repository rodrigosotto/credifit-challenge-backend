import { Module } from '@nestjs/common';
import { EmprestimoController } from './emprestimo.controller';
import { EmprestimoService } from './emprestimo.service';
import { FuncionarioModule } from 'src/funcionario/funcionario.module';

@Module({
  imports: [FuncionarioModule],
  controllers: [EmprestimoController],
  providers: [EmprestimoService],
})
export class EmprestimoModule {}
