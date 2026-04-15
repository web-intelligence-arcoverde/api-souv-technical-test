# Product Module Documentation

O módulo de produtos gerencia o catálogo de itens que podem ser adicionados às listas de compras. Ele lida com a persistência no Firestore e operações em lote.

## Funcionalidades (Features)

### 1. Criação de Produto (`CreateProductUseCase`)
Permite adicionar um novo produto individual ao catálogo global.

### 2. Criação em Massa (`BulkCreateProductUseCase`)
Integrado ao worker do BullMQ para processar grandes quantidades de produtos em background, evitando gargalos na API.

### 3. Listagem de Produtos (`ListProductUseCase`)
Recupera a lista de produtos com suporte a paginação.
- **Cache**: Utiliza Redis para armazenar os resultados da listagem por página, melhorando a performance de leitura.

### 4. Remoção de Produto (`DeleteProductUseCase`)
Remove um produto do catálogo.

### 5. Controle de Status (`ToggleChangeProductCheckedUseCase`)
Altera o estado de "marcado" (checked) de um produto dentro de uma lista de compras específica.
- **Cache**: Ao alterar o status, invalida o cache de detalhamento da lista para refletir a mudança imediatamente.

## Integração com Infraestrutura
- **Firestore**: Armazenamento principal dos dados do produto.
- **Redis**: Sistema de cache para listagens e estados voláteis.
- **BullMQ**: Utilizado para operações de inserção em massa (`bulk-insert-products`).
