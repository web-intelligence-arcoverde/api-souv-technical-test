# Listagem de Listas de Compras (`ListListsUseCase`)
Retorna todas as listas de compras pertencentes ao usuário logado, com suporte a cache.

- **Fluxo**: Consulta no Firestore as listas onde `ownerId` coincide com o UID do usuário. Utiliza cache com TTL de 10 minutos baseado no padrão `lists:user:UID:page:*:limit:*`.
- **Retorno**: Array de objetos de listas de compras.
- **router**: GET `/api/shopping-list`
