# Listagem de Produtos (`ListProductUseCase`)
Retorna os produtos vinculados a uma lista de compras específica, com suporte a cache.

- **Fluxo**: Consulta a sub-coleção de itens da lista no Firestore. Utiliza cache baseado no padrão `products:page:*:list:ID`.
- **Retorno**: Array de objetos de produtos.
- **router**: GET `/api/product` (Filtrado por query param `listId`)
