# Atualização de Conta (`UpdateUserUseCase`)
Permite a modificação dos dados de perfil do usuário.

- **Fluxo**: 
    1. Atualiza o perfil no Firebase Auth (Display Name e/ou Email).
    2. Sincroniza as alterações no documento do Firestore.
- **Retorno**: Nenhum (Sucesso com Status 204 ou 200).
- **router**: PATCH `/api/auth/account/:uid`
