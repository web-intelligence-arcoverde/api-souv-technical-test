# Criação de Lista de Compras (`CreateListUseCase`)
Inicia uma nova lista de compras e permite a inclusão inicial de produtos via processamento em fila.

- **Fluxo**: 
    1. Gera um ID único para a nova lista.
    2. Define os atributos básicos (título, descrição, categoria, variante).
    3. Enfileira um job na `shoppingListQueue` (`CREATE_LIST`) para persistência assíncrona da lista e seus itens.
- **Retorno**: Objeto da lista recém-criada (que será processada em background).
- **router**: POST `/api/shopping-list`
