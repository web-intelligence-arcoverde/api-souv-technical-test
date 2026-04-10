# 🚀 API de Lista de Compras - Arquitetura Backend Avançada

API de Lista de Compras moderna e robusta construída com **Node.js**, **Express**, **Firebase** e **Redis**. Projetada com uma arquitetura modular (Clean Architecture Lite) e um padrão de proxy seguro Backend-for-Frontend (BFF).

---

## 🏗️ Arquitetura & Segurança
- **Arquitetura Modular em Camadas**: Lógica separada por domínio (Auth, Produto, Lista de Compras) com camadas claramente definidas (Entidades, Casos de Uso, Repositórios).
- **BFF (Backend-for-Frontend)**: Fluxo de autenticação seguro usando **Cookies HttpOnly**, movendo o gerenciamento de sessão do `localStorage` para mitigar riscos de XSS.
- **Processamento Assíncrono**: Operações de escrita pesada e inserções em massa gerenciadas pelo **BullMQ** via workers de segundo plano.
- **Observabilidade**: Logs estruturados de nível empresarial com **Winston**, capturando requisições, latência e stack traces.

## 🛠️ Stack Tecnológica
- **Core**: Node.js & TypeScript
- **Banco de Dados**: Firebase Firestore (NoSQL de nível de produção)
- **Autenticação**: Firebase Auth (Ponte via Proxy)
- **Cache**: Redis (Cache de alta performance em endpoints de busca)
- **Fila (Queue)**: BullMQ & IORedis (Jobs confiáveis em segundo plano)
- **Qualidade**: Biome (Linting/Formatação), Husky & lint-staged (Git Hooks), Jest (Testes)

---

## 📦 Instalação & Configuração

### 1. Pré-requisitos
- Node.js 18+
- Docker & Docker Compose (para o Redis)
- Projeto Firebase (JSON do Admin SDK)

### 2. Configuração do Ambiente
Crie um arquivo `.env` no diretório raiz com as seguintes variáveis (obrigatórias para o Firebase Admin SDK):

```env
# Servidor
PORT=3001
NODE_ENV=development

# Cache & Fila
REDIS_URL=redis://localhost:6379

# Firebase Admin SDK (Extraídas do seu JSON de Service Account)
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"

# Firebase Client (Utilizada para autenticação via proxy)
FIREBASE_API_KEY=sua_chave_api_publica_aqui
```

> [!IMPORTANT]
> A `FIREBASE_PRIVATE_KEY` deve conter as quebras de linha representadas por `\n` e estar entre aspas para ser processada corretamente pelo Node.js.

### 3. Executando a Infraestrutura
Inicie o container do Redis:
```bash
docker-compose up -d
```

### 4. Executando a Aplicação
```bash
npm install     # Instalar dependências
npm run dev     # Iniciar com auto-reload (ts-node-dev)
```
### 5. Documentação da API
A API está totalmente documentada com **Swagger**, permitindo testes interativos de todos os endpoints.

- **URL Local**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

---

## 📁 Estrutura do Projeto
O projeto segue uma estrutura modular para melhor manutenibilidade:
```text
src/
├── config/             # Configurações de infraestrutura (Redis, Firebase)
├── infra/              # Serviços externos (Firestore, Fila, Logger)
├── middlewares/        # Middlewares Express (Auth, Cache, Rate-Limit)
└── modules/            # Lógica de Negócio agrupada por Funcionalidade
    ├── auth/           # Login seguro, tokens e registro
    ├── product/        # Definições de itens e processamento em massa
    ├── shopping-list/  # Gerenciamento de listas e compartilhamento
```

---

## 📖 Documentação Adicional
Documentação detalhada sobre as regras de negócio e diagramas:
- [Guia de Funcionalidades do Sistema](doc/features.md)
- [Arquitetura & Diagramas](doc/diagrams/class_diagrams.md)

---

## 🚀 Principais Funcionalidades
- **Listas Compartilhadas Públicas**: Acessíveis via endpoints específicos sem autenticação.
- **Cache Inteligente**: Estratégia automática de HIT/MISS no Redis para reduzir leituras no Firestore.
- **Ingestão de Dados em Massa**: Processamento em fila para grandes listas de produtos.
- **Commits Seguros**: Verificações pré-commit automatizadas garantindo que todo o código seja verificado (lint) e testado.

---

Feito com 💻 + ☕ por Lucas Paes.
