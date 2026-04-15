# Login de Usuários (`LoginUserUseCase`)
Autentica o usuário e gera os tokens de acesso para sessões seguras.

- **Fluxo**: 
    1. Envia as credenciais (e-mail e senha) para o Google Identity Toolkit.
    2. Valida a autenticidade e recupera os dados do perfil.
- **Retorno**: Objeto contendo `uid`, `email`, `name`, `token` (Access Token) e `refreshToken`.
- **router**: POST `/api/auth/login`
