# Registro de Usuários (`RegisterUserUseCase`)
Permite a criação de novos usuários no sistema e a persistência de seus dados básicos.

- **Fluxo**: 
    1. Verifica se o e-mail já está em uso no Firestore.
    2. Cria o usuário no Firebase Authentication.
    3. Cria o documento do usuário no Firestore (coleção `users`).
    4. Realiza o login automático para retornar os tokens iniciais.
- **Retorno**: Objeto contendo `uid`, `email`, `name`, `token` (Access Token) e `refreshToken`.
- **router**: POST `/api/auth/register`
