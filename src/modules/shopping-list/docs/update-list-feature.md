# Atualização de Lista (`UpdateListUseCase`)
Modifica as propriedades básicas de uma lista de compras.

- **Fluxo**: 
    1. Valida se a lista pertence ao usuário.
    2. Atualiza os campos (título, descrição, categoria, variante) no Firestore.
    3. Invalida os caches de listagem e detalhes daquela lista.
- **Retorno**: Objeto da lista atualizada.
- **router**: PATCH `/api/shopping-list/:id`
