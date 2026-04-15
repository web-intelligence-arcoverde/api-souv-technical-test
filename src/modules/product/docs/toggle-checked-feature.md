# Alternar Status do Produto (`ToggleChangeProductCheckedUseCase`)
Marca ou desmarca um produto como "comprado" na lista.

- **Fluxo**: 
    1. Alterna o campo `checked` no documento do produto.
    2. Atualiza o contador `securedItems` na lista pai (incrementa se marcado, decrementa se desmarcado).
    3. Invalida os caches de detalhes da lista e de produtos.
- **Retorno**: Objeto do produto atualizado.
- **router**: PATCH `/api/product/:id/toggle-checked`
