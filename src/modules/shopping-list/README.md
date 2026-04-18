# 🛒 Módulo de Lista de Compras

Este módulo é responsável por toda a lógica de negócio relacionada ao gerenciamento de listas de compras, incluindo criação, filtragem, compartilhamento e processamento assíncrono de itens.

## 🏗️ Estrutura do Módulo

O módulo segue os princípios de **Clean Architecture Lite**, dividido nas seguintes camadas:

- **Entities**: Definições de interface e contratos de dados (`shopping-list.interface.ts`).
- **Use Cases**: Implementação da lógica de negócio (Ex: `CreateListUseCase`, `ListListsFilteredUseCase`).
- **Controllers**: Handlers de requisição que validam a entrada usando `Zod`.
- **Repositories**: Adaptadores para persistência no Firebase Firestore.
- **Validations**: Schemas de validação de dados.

## 🔑 Funcionalidades Principais

- **Criação Flexível**: Suporta metadados como `category`, `variant` (visual) e flags de sincronização.
- **Filtragem Avançada**: O endpoint de listagem permite filtrar por categoria, status de compartilhamento (`shared`) e variantes.
- **Compartilhamento Público**: Listas marcadas como `shared: true` podem ser acessadas via endpoint público sem autenticação.
- **Integração com Filas**: A adição de produtos em massa ou pesada é delegada ao **BullMQ** para garantir responsividade da API.

## 🧪 Qualidade e Testes

O módulo possui uma cobertura abrangente de testes:

### Testes Unitários
Executados com **Jest**, focam na validação das regras de negócio nos Casos de Uso, utilizando mocks para repositórios e serviços externos.
```bash
npm run test:unit
```

### Testes de Carga (Stress Testing)
Utilizamos o **Autocannon** para medir a performance sob alta concorrência.
- **Leitura**: ~650 RPS com latência média de 15ms.
- **Escrita**: ~1000 RPS (devido ao processamento assíncrono via Workers).
```bash
npm run test:load:list
```

## ⚙️ Configurações Técnicas
- **Bypass de Rate Limit**: Para fins de teste de carga, a API aceita o header `x-load-test-bypass: true` para ignorar o limite de requisições por IP no Redis.
- **Cache**: Leituras frequentes são cacheadas no Redis para minimizar custos de leitura no Firestore.
