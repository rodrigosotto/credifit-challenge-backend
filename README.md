# 🧠 Credifit Challenge — Backend

API RESTful desenvolvida com NestJS e TypeScript para gerenciar o fluxo de empréstimos consignados via plataforma Credifit.

---

## 🚀 Funcionalidades

- Cadastro de empresas parceiras
- Cadastro de funcionários vinculados às empresas
- Solicitação de empréstimos por CPF
- Simulação de score de crédito via API externa
- Regra de aprovação automática baseada em salário + score
- Armazenamento em memória (sem banco de dados)

---

## 📦 Tecnologias

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/) (para chamada de score mockado)
- [Class-validator](https://github.com/typestack/class-validator)
- [UUID](https://www.npmjs.com/package/uuid) (para gerar IDs)

---

## 📁 Estrutura do Projeto

```
src/
├── app.module.ts          # Módulo principal
├── empresa/               # EmpresaModule - CRUD de empresas
├── funcionario/           # FuncionarioModule - CRUD de funcionários
├── emprestimo/            # EmprestimoModule - lógica de simulação
├── shared/                # Módulo compartilhado com interfaces
└── main.ts                # Bootstrap do NestJS + CORS
```

---

## ⚙️ Regras de negócio

- O empréstimo **só é aprovado** se:
  - O funcionário tiver score suficiente, conforme sua faixa salarial:
    | Faixa Salarial       | Score Mínimo |
    |----------------------|--------------|
    | Até R$ 2.000         | 400          |
    | Até R$ 4.000         | 500          |
    | Até R$ 8.000         | 600          |
    | Até R$ 12.000        | 700          |
- A validação de score é feita com base em uma **API externa mockada**:

```url
GET https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf
```

---

## 🛠️ Como executar localmente

### Pré-requisitos

- Node.js `>=18`
- npm `>=9`

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/credifit-challenge-backend.git
cd credifit-challenge-backend

# 2. Instale as dependências
npm install

# 3. Rode o projeto em modo dev
npm run start:dev

# 4. A API estará disponível em:
http://localhost:3000
```

---

## 📮 Endpoints principais

### Empresas

- `POST /empresas` — cria uma nova empresa

### Funcionários

- `POST /funcionarios` — cria um funcionário vinculado a uma empresa
- `GET /funcionarios` — lista todos

### Empréstimos

- `POST /emprestimos` — simula e solicita um empréstimo
- `GET /emprestimos/:cpf` — retorna todos os empréstimos de um funcionário
- `GET /emprestimos` — lista geral

---

## ⚠️ Observações

- Todos os dados são mantidos **em memória**
- Reiniciar a aplicação limpa todos os dados (sem banco)
- Utilizado exclusivamente para fins de **avaliação técnica**

---

## 📄 Licença e Direitos

Este projeto é de uso exclusivo para fins avaliativos e de aprendizado.  
**Todos os direitos sobre o código, lógica e estrutura pertencem ao autor.**  
Reprodução, cópia ou redistribuição total/parcial sem autorização prévia é proibida.

---

## ✍️ Autor

Desenvolvido por **Jefferson (Rodrigo)**  
🌍 [LinkedIn](https://www.linkedin.com/in/seu-usuario)
