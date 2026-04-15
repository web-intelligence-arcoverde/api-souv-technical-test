# Exclusão de Conta (`DeleteUserUseCase`)
Remove permanentemente um usuário e todos os seus dados associados do sistema.

- **Fluxo**: 
    1. Realiza a exclusão em cascata: Deleta todas as listas de compras do usuário e seus itens no Firestore.
    2. Remove o documento do usuário da coleção `users`.
    3. Remove o usuário do Firebase Authentication.
- **Retorno**: Nenhum (Sucesso com Status 204).
- **router**: DELETE `/api/auth/account/:uid`
