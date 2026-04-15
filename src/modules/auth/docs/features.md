# Auth Module Documentation

O módulo de autenticação é responsável por gerenciar o ciclo de vida dos usuários e a segurança da aplicação, utilizando o Firebase Admin SDK para autenticação e gestão de identidade.

## Funcionalidades (Features)

### 1. Registro de Usuários (`RegisterUserUseCase`)
Permite a criação de novos usuários no sistema.
- **Campos**: Nome, E-mail e Senha.
- **Validação**: E-mail válido e senha com no mínimo 6 caracteres.
- **Integração**: Cria o perfil no Firebase Auth.

### 2. Login de Usuários (`LoginUserUseCase`)
Autentica o usuário e gera os tokens de acesso.
- **Fluxo**: Verifica as credenciais no Firebase.
- **Retorno**: JWT Access Token e Refresh Token.

### 3. Atualização de Conta (`UpdateUserUseCase`)
Permite que o usuário atualize suas informações básicas.
- **Editáveis**: Nome e E-mail.

### 4. Exclusão de Conta (`DeleteUserUseCase`)
Remove permanentemente o usuário do sistema.
- **Ação**: Deleta o registro no Firebase Auth.

### 5. Listagem de Usuários (`ListUsersUseCase`)
Funcionalidade administrativa para visualizar todos os usuários cadastrados.

### 6. Renovação de Token (`RefreshTokenUseCase`)
Gera um novo Access Token a partir de um Refresh Token válido, mantendo a sessão do usuário ativa.

## Arquitetura e Segurança
- **Provedor**: Firebase Admin SDK.
- **Tokens**: JWT (JSON Web Tokens).
- **Validação**: Zod para esquemas de entrada de dados.
- **Middleware**: `authMiddleware` protege as rotas privadas verificando o Bearer Token.
