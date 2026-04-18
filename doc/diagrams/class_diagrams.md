# Diagramas de Classe - Arquitetura da Lista de Compras

Este documento visualiza as relações entre entidades, repositórios e casos de uso dentro da arquitetura modular.

## 🏗️ Padrões Principais
O sistema segue um padrão de **Clean Architecture Lite**:
1. **Entidades (Entities)**: Definem a estrutura de dados e as regras de negócio.
2. **Casos de Uso (Use Cases)**: Orquestram a lógica de negócio.
3. **Repositórios (Repositories)**: Gerenciam a persistência de dados (Portas/Adaptadores).
4. **Controladores (Controllers)**: Gerenciam as requisições e respostas HTTP.

## 🛒 Estrutura do Módulo de Lista de Compras

```mermaid
classDiagram
    class ShoppingList {
        +string id
        +string title
        +string ownerId
        +string category
        +string variant
        +boolean shared
        +Date lastModified
    }

    class IShoppingListRepository {
        <<interface>>
        +create(data: IShoppingList) ShoppingList
        +findAll(userId: string) ShoppingList[]
        +findById(id: string) ShoppingList
        +update(id: string, data: any) void
        +delete(id: string) void
    }

    class ShoppingListRepository {
        +db: Firestore
        +getCollection()
    }

    class CreateListUseCase {
        +repository: IShoppingListRepository
        +queue: BullMQ
        +execute(data: any)
    }

    class ListListsFilteredUseCase {
        +repository: IShoppingListRepository
        +execute(filters: any)
    }

    IShoppingListRepository <|.. ShoppingListRepository : implementa
    CreateListUseCase --> IShoppingListRepository : usa
    ListListsFilteredUseCase --> IShoppingListRepository : usa
    CreateListUseCase ..> ShoppingList : gerencia
    ListListsFilteredUseCase ..> ShoppingList : retorna
```

## 📦 Relação de Produtos e Filas (Queue)

```mermaid
classDiagram
    class CreateProductUseCase {
        +repository: ProductRepository
        +cache: Redis
        +execute(data: IProduct)
    }

    class BulkInsertWorker {
        +jobProcessing()
        +batchCommitToFirestore()
    }

    class ProductRepository {
        +create(data: IProduct)
        +findAll(listId: string)
    }

    CreateProductUseCase --> ProductRepository : usa
    BulkInsertWorker ..> ProductRepository : usa (delega)
    BulkInsertWorker --> BullMQ : escuta
```

---

## 🔐 Fluxo de Autenticação (Padrão BFF)

```mermaid
classDiagram
    class AuthRepository {
        +firebase: AdminSDK
        +login(email, pass)
        +refresh(token)
    }

    class ProxyHandler {
        +bridgeCookiesToHeader()
        +stripTokensFromResponse()
    }

    class useAuth {
        <<Frontend Hook>>
        +snap: ValtioState
        +login()
        +logout()
    }

    useAuth --> ProxyHandler : chama API
    ProxyHandler --> AuthRepository : delega para o backend
```
