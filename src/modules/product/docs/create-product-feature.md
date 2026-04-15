# Criação de Produto (`CreateProductUseCase`)
Adiciona um novo produto a uma lista de compras existente.

- **Fluxo**: 
    1. Persiste o novo produto no Firestore.
    2. Atualiza o contador `totalItems` na lista de compras pai de forma atômica.
    3. Invalida o cache de listagem de produtos daquela lista.
    4. Invalida o cache de detalhes da lista (GetList).
- **Retorno**: Objeto contendo os dados do produto criado (incluindo `id`).
- **router**: POST `/api/product`
