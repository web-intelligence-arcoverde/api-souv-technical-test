# Detalhes da Lista de Compras (`GetListUseCase`)
Recupera os dados completos de uma lista específica, incluindo seus produtos.

- **Fluxo**: 
    1. Busca a lista pelo ID no Firestore.
    2. Se a lista for privada, valida a propriedade (`ownerId`).
    3. Recupera os itens da sub-coleção `items`.
    4. Utiliza cache com TTL de 5 minutos (`list:detail:ID:user:UID` ou `list:shared:ID`).
- **Retorno**: Objeto detalhado da lista de compras.
- **router**: GET `/api/shopping-list/:id` (ou via rota pública `/api/shared/:id`)
