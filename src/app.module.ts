import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './empresa/empresa.module';
import { FuncionarioModule } from './funcionario/funcionario.module';
import { EmprestimoModule } from './emprestimo/emprestimo.module';
import { SharedModule } from './shared/shared.module';
import { PagamentoController } from './pagamento/pagamento.controller';
import { PagamentoService } from './pagamento/pagamento.service';
import { PagamentoModule } from './pagamento/pagamento.module';

@Module({
  imports: [EmpresaModule, FuncionarioModule, EmprestimoModule, SharedModule, PagamentoModule],
  controllers: [AppController, PagamentoController],
  providers: [AppService, PagamentoService],
})
export class AppModule {}
