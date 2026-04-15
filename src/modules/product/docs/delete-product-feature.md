# Exclusão de Produto (`DeleteProductUseCase`)
Remove um produto específico de uma lista de compras.

- **Fluxo**: 
    1. Recupera o produto para obter o `listId` e o status `checked`.
    2. Deleta o documento no Firestore.
    3. Decrementa o `totalItems` na lista pai.
    4. Se o produto estava marcado (`checked`), decrementa o `securedItems` na lista pai.
    5. Invalida os caches relacionados à lista e seus produtos.
- **Retorno**: Nenhum (Sucesso com Status 204).
- **router**: DELETE `/api/product/:id`
