 # Pages

## Visão geral

A pasta `src/pages` contém as páginas de alto nível (rotas) da aplicação: layout protegido (área autenticada), página de login e página de registro. Essas páginas orquestram componentes do diretório `src/components` e usam o contexto de autenticação (`useAuth`) para redirecionamentos e proteção de rotas.

Arquivos principais:

- `index.jsx` — re-exporta `Layout`, `Login` e `Register` para importações convenientes.
- `Layout.tsx` — wrapper para páginas autenticadas. Verifica se o usuário está logado e, caso contrário, redireciona para `/` (login). Renderiza o `Header`, o `Outlet` (conteúdo das rotas filhas) e o `Copyright`.
- `Login.tsx` — página pública de login. Se o usuário já estiver autenticado, redireciona para `/dashboard`. Contém o `SignInForm` e layout responsivo com imagem lateral.
- `Register.tsx` — página pública de registro. Semelhante ao `Login`, redireciona usuários autenticados para `/dashboard` e contém o `SignUpForm`.

## Comportamento e responsabilidades

- `Layout`
	- Garante que só usuários autenticados vejam as rotas filhas.
	- Faz um simple check `if (!user) navigate('/', { replace: true })` (observe que essa navegação pode ser chamada durante render; manter o `loading` do `useAuth` evita flashes de UI).
	- Renderiza a estrutura visual comum: `Header`, área principal (`Outlet`) e footer.

- `Login` e `Register`
	- Ambos usam `useEffect` para observar `user` e redirecionar para `/dashboard` quando o usuário estiver presente.
	- Usam os formulários reusáveis (`SignInForm`, `SignUpForm`) dos componentes para lidar com entrada e validação.

## Rotas e integração

Normalmente estas páginas são usadas em `Router.tsx` (ou similar). O padrão comum é ter algo como:

```tsx
<Routes>
	<Route path="/" element={<Login />} />
	<Route path="/register" element={<Register />} />
	<Route element={<Layout />}>
		<Route path="/dashboard" element={<Dashboard />} />
		{/* outras rotas protegidas */}
	</Route>
</Routes>
```

## Testes manuais

1. Rode a app: `npm run start`.
2. Acesse `/` e verifique a tela de login.
3. Tente logar com credenciais válidas; após login, você deve ser redirecionado a `/dashboard`.
4. Em `/register`, tente criar conta; verifique se o usuário é criado no Firebase e se há um documento em `users/{uid}`.
5. Acesse uma rota protegida sem estar logado; verifique se o `Layout` redireciona para `/`.

