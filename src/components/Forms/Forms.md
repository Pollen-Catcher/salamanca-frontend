 # Forms

## Visão geral

Esta pasta agrupa os formulários usados pela aplicação para autenticação (login e registro) e componentes auxiliares de formulários. Os formulários usam `react-hook-form` com validação via `yup` (`@hookform/resolvers/yup`) e componentes visuais do Material UI (`@mui/material`).

## Arquivos

- `index.jsx` — re-exporta os formulários disponíveis (`SignInForm`, `SignUpForm`).
- `SignInForm/index.jsx` — componente do formulário de login.
  - Usa `react-hook-form` + `yup` (resolver) com o schema em `SignInForm/schema/index.js`.
  - Campos: `email`, `password`, `checkdB` (remember me).
  - Ações: `Login` (chama `useAuth().signIn`), `Login with Google` (chama `useAuth().signInWithGoogle`), `Forgot your password?` (usa `useAuth().forgotPassword`).
- `SignInForm/schema/index.js` — validações do formulário de login (email formato válido e senha mínima de 8 caracteres).
- `SignUpForm/index.jsx` — componente do formulário de registro.
  - Usa `react-hook-form` + `yup` com o schema em `SignUpForm/schema/index.js`.
  - Campos: `name`, `email`, `password`, `confirmPassword`.
  - Ação: `Register` (chama `useAuth().signUp`).
- `SignUpForm/schema/index.js` — validações do formulário de registro (nome obrigatório, email válido, senha com 8+ caracteres, confirmação igual à senha).
- `controlledInput/index.jsx` — pasta preparada para componentes de input controlado (arquivo atualmente vazio); pode abrigar inputs personalizados que integrem com `react-hook-form`.

## Fluxo e integrações

- Ambos os formulários usam o contexto de autenticação `useAuth()` (`src/contexts/UserContext.tsx`) para executar as ações reais de autenticação: `signIn`, `signInWithGoogle`, `signUp` e `forgotPassword`.
- A validação é feita no lado do cliente via `yup`. Erros de validação são exibidos via `helperText` nos `TextField` do MUI.

## Como testar manualmente

1. Rode a aplicação localmente:

   npm install
   npm run start

2. Abra a rota de login/registro:
   - Para login: vá para a rota de Login (normalmente `/login` ou a rota padrão do app).
   - Para registro: vá para `/register`.

3. Testes rápidos:
   - Tente submeter o formulário com campos vazios para validar as mensagens de erro do `yup`.
   - Insira email inválido e senha menor que 8 caracteres para ver as validações.
   - No registro, teste a validação de `confirmPassword` diferente da `password`.
   - Teste `Login with Google` e verifique se o fluxo OAuth funciona e que o `useAuth()` completa a autenticação.

4. Checar logs e erros:
   - Abra o DevTools do navegador (Console) para ver erros vindos do `useAuth()` (por exemplo, falha de autenticação do Firebase).
   - Se as chamadas falharem por regras de segurança ou configuração do Firebase, ajuste `src/config/firebase.ts` e as regras do Firebase conforme necessário.

