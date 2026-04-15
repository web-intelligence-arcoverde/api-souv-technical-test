# Listagem de Usuários (`ListUsersUseCase`)
Retorna a lista de todos os usuários registrados no sistema (finalidade administrativa).

- **Fluxo**: Consulta a coleção `users` no Firestore e retorna os dados básicos de cada perfil.
- **Retorno**: Array de objetos contendo `uid`, `email` e `name`.
- **router**: GET `/api/auth/users`
