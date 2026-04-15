# Adicionar Produto à Lista (`AddProductToListUseCase`)
Encapsula a lógica de adicionar um produto a uma lista, com processamento em background.

- **Fluxo**: 
    1. Define o `listId` no objeto do produto.
    2. Enfileira o processamento na `shoppingListQueue` (`ADD_PRODUCT`).
- **Retorno**: Objeto do produto com o `listId` atribuído.
- **router**: POST `/api/shopping-list/:id/product`
