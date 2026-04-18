# Funcionalidades do Sistema - API de Lista de Compras

Este documento fornece um inventário detalhado das funcionalidades e endpoints disponíveis na API de Lista de Compras.

## 🔐 Módulo de Autenticação (Auth)
Gerencia o registro de usuários, gerenciamento de sessões e recuperação de senha.

- **POST /auth/register**: Registra um novo usuário com nome, e-mail e senha.
- **POST /auth/login**: Login profissional utilizando Cookies HttpOnly para segurança cross-site (JWT armazenado no lado do servidor).
- **POST /auth/refresh**: Renovação transparente de sessão utilizando Refresh Tokens.
- **POST /auth/logout**: Encerramento seguro de sessão limpando os cookies HttpOnly.
- **POST /auth/reset-password**: Gera um link de recuperação seguro para acesso à conta.

## 📦 Módulo de Produtos
Gerencia itens individuais que podem ser adicionados às listas de compras.

- **POST /product**: Adiciona um único produto a uma lista.
- **GET /product**: Lista produtos com suporte a paginação e cache de alta performance no Redis.
- **PATCH /product/:id/checked**: Alterna o status de um produto (comprado/pendente).
- **POST /product/bulk**: Criação massiva de produtos em segundo plano usando workers **BullMQ** para ingestão de grandes volumes de dados.

## 🛒 Módulo de Lista de Compras
Funcionalidade principal para compras colaborativas.

- **POST /shopping-list**: Cria uma nova lista de compras. Agora suporta os campos `shared` (boolean), `category` e `variant`.
- **GET /shopping-list**: Recupera as listas do usuário. Suporta filtros via query params:
    - `page` & `limit`: Paginação.
    - `category`: Filtrar por categoria.
    - `shared`: Filtrar por status de compartilhamento (`true`/`false`).
    - `variant`: Filtrar por variante visual (`primary`, `secondary`, `tertiary`).
- **GET /shopping-list/:id**: Busca detalhes de uma lista específica.
- **PATCH /shopping-list/:id**: Atualiza metadados da lista (título, categoria, descrição, shared, variant).
- **DELETE /shopping-list/:id**: Remoção permanente de uma lista.
- **GET /shopping-list/shared/:id**: **Acesso Público** a uma lista compartilhada (não requer login).

---

## 🛠️ Infraestrutura & Qualidade
- **Performance**: Cache no Redis em endpoints de leitura pesada.
- **Escalabilidade**: Processamento de jobs assíncronos para operações de escrita pesada.
- **Observabilidade**: Logs estruturados com Winston (diretório logs/).
- **Segurança**: Cookies HttpOnly, SameSite=Strict e Rate Limiting.
- **Experiência do Desenvolvedor**: Git Hooks (Husky + lint-staged) para linting e testes automatizados.
