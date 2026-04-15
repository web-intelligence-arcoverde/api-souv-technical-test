# Renovação de Token (`RefreshTokenUseCase`)
Gera um novo token de acesso a partir de um token de renovação válido.

- **Fluxo**: Invoca a API de tokens do Firebase Secutetoken para trocar o `refreshToken` por um novo `idToken`.
- **Retorno**: Objeto contendo `idToken` e um novo `refreshToken`.
- **router**: POST `/api/auth/refresh`
