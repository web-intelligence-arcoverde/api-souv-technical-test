# Exclusão de Lista (`DeleteListUseCase`)
Remove uma lista de compras e todos os seus produtos.

- **Fluxo**: 
    1. Valida a propriedade da lista.
    2. Deleta todos os itens da sub-coleção `items`.
    3. Deleta o documento da lista na coleção `lists`.
    4. Invalida os caches relacionados ao usuário e à lista.
- **Retorno**: Nenhum (Sucesso com Status 204).
- **router**: DELETE `/api/shopping-list/:id`
