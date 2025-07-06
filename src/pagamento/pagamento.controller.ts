import { Controller, Post } from '@nestjs/common';

@Controller('pagamento')
export class PagamentoController {
  @Post()
  simularPagamento() {
    return { status: 'aprovado' };
  }
}
