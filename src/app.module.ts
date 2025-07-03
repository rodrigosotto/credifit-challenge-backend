import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './empresa/empresa.module';
import { FuncionarioModule } from './funcionario/funcionario.module';
import { EmprestimoModule } from './emprestimo/emprestimo.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [EmpresaModule, FuncionarioModule, EmprestimoModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
