# Shopping List Module Documentation

O módulo de Listas de Compras é o núcleo da aplicação, permitindo que usuários criem, gerenciem e compartilhem suas listas de supermercado.

## Funcionalidades (Features)

### 1. Criação de Lista (`CreateListUseCase`)
Gera uma nova lista de compras vazia ou com itens iniciais.
- **Background**: Utiliza o worker `shopping-list-queue` para persistir a lista de forma assíncrona se necessário.

### 2. Gestão de Detalhes (`GetListUseCase` & `UpdateListUseCase`)
- **Busca**: Recupera detalhes completos de uma lista, incluindo itens.
- **Edição**: Permite alterar título, categoria ou descrição da lista.

### 3. Listagem de Listas (`ListListsUseCase`)
Retorna todas as listas pertencentes ao usuário autenticado.
- **Cache**: Armazena no Redis com a chave `lists:user:{userId}:*`.

### 4. Adição de Itens (`AddProductToListUseCase`)
Associa um produto existente a uma lista de compras.
- **Processamento**: É disparado um job para o worker atualizar o contador de itens (`totalItems`) e a data de modificação da lista de forma atômica no Firestore.

### 5. Exclusão de Lista (`DeleteListUseCase`)
Remove a lista e invalida todos os caches relacionados.

## Recursos de Performance
- **Firestore Atomic Increments**: Utiliza `FieldValue.increment` para garantir consistência em ambientes concorrentes.
- **Redis Cache**: 
    - Cache de listagem por usuário.
    - Cache de detalhamento de lista (`list:detail:{listId}`).
    - Invalidação baseada em padrões (`SCAN`) para garantir dados atualizados.
- **Queue System (BullMQ)**: Processamento assíncrono para garantir que operações pesadas não bloqueiem a resposta da API ao usuário final.
