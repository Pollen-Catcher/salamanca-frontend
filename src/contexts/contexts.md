 # Contexts

## Visão geral

Esta pasta contém providers e hooks React que fornecem contexto global para a aplicação: autenticação de usuário e wrappers necessários (router, provider de data pickers e styled engine do MUI).

Arquivos principais:

- `UserContext.tsx` — context para autenticação: provê o usuário atual (`user`), estado de carregamento (`loading`) e métodos para `signUp`, `signIn`, `signOut`, `forgotPassword`, `signInWithGoogle`.
- `GlobalContext.tsx` — wrapper de alto nível que configura `BrowserRouter`, `LocalizationProvider` (date pickers) e o `UserProvider`.

## `UserContext` — contrato e comportamento

O contexto exporta o hook `useAuth()` que retorna um objeto com a forma:

- user: `firebase.User | undefined | null` — usuário atual (ou null se não autenticado)
- loading: `boolean` — true enquanto o estado de autenticação inicial está sendo carregado
- signUp({ name, email, password, confirmPassword }): Promise<void> — cria um usuário com email/senha, atualiza `displayName` e cria um documento de usuário no Firestore (`getUserRef`).
- signIn({ email, password }): Promise<void> — autentica e navega para `/`.
- signOut(): Promise<void> — encerra sessão.
- forgotPassword({ email }): Promise<void> — envia email de reset.
- signInWithGoogle(): void — provê login via popup Google e cria/atualiza documento de usuário no Firestore.

Notas importantes sobre implementação atual:

- `onAuthStateChanged` é chamado diretamente no corpo do componente — isso causa a re-subscription em cada render. Idealmente essa chamada deve ficar dentro de um `useEffect` para garantir subscribe/unsubscribe apropriado.
- Os métodos capturam erros e fazem `console.error`. Algumas funções não propagam erros ao chamador (por exemplo `signUp` captura e só loga). Se você precisa feedback UX (Snackbar/alerta), seria melhor propagar ou retornar o erro para o componente chamador.
- `signUp` chama `updateProfile` e `setDoc(getUserRef(user.uid), docData)` — portanto há dependência implícita em `src/lib/user` e nos permissions do Firestore.

Exemplo de uso (no App root):

```tsx
import { GlobalContext } from './contexts/GlobalContext'

function Root() {
  return (
    <GlobalContext>
      <App />
    </GlobalContext>
  )
}
```

Exemplo de consumo em componente:

```tsx
import { useAuth } from '../contexts/UserContext'

function Profile() {
  const { user, signOut } = useAuth()
  return <button onClick={signOut}>Logout {user?.displayName}</button>
}
```

## `GlobalContext`

Responsabilidades:

- Envolver a árvore de componentes com `BrowserRouter` (roteamento da app).
- Prover `LocalizationProvider` para os componentes de date picker (usa `AdapterDayjs`).
- Incluir `UserProvider` para disponibilizar `useAuth()` globalmente.
- Injetar o MUI Styled Engine para garantir que o Tailwind / CSS-in-JS sejam aplicados na ordem correta.

## Como testar / validar

- Verifique que o root da aplicação esteja envolvido por `GlobalContext` (normalmente em `src/main` ou `src/index.tsx`).
- Teste o fluxo de autenticação: registrar, login com email/senha, login via Google e logout. Observe os documentos criados em Firestore.
- Teste permissões: tente efetuar operações como usuário sem permissão e veja os erros no console (ajuste `firestore.rules` conforme necessário).


## Testes recomendados

- Unit tests para `UserContext` mockando `firebase/auth` (Vitest + testing-library) — testar que `signIn`, `signUp` chamam as APIs corretas e que `useAuth()` retorna os valores esperados.
- Integration tests com Firebase Emulator para validar criação de usuário e escrita no Firestore.

---
