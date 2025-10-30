 # Components (pasta `src/components`)

## Visão geral

Este diretório agrupa componentes React reutilizáveis e as páginas/áreas principais da aplicação (Header, Breadcrumbs, Sheets, Projects, Graph, Datagrid, Forms, etc.). O arquivo `index.tsx` re-exporta os principais componentes para facilitar importações em outras partes do app.

A documentação abaixo descreve cada arquivo/parte importante, seu propósito, props relevantes e dicas de teste/uso.

## Arquivos principais

- `index.tsx` — re-exports: facilita importar componentes com `import { Header, Projects } from 'src/components'`.

- `Header.tsx` — cabeçalho global da aplicação.
	- Mostra o nome do usuário (via `useAuth()`), botões de notificação/ajuda e o `ProfileMenu`.
	- Também renderiza uma segunda AppBar com título da aplicação e o componente `Breadcrumbs`.

- `Breadcrumbs.tsx` — componente de navegação hierárquica.
	- Gera breadcrumbs a partir do `location.pathname` e usa `useNavigate()` para navegar quando o usuário clica em um nível.

- `ProfileMenu.tsx` — menu de perfil (avatar + opções).
	- Mostra avatar e opções (Profile, My account, sign out). Usa `useAuth()` para `signOut`.

- `Sheets.tsx` — página que combina captura por voz, upload CSV e visualização/edição por data.
	- Contém `Speech` (captura de voz), `CSVReader` para upload (chama `csvToFirestore`) e `Datagrid` para visualizar a planilha do dia. Usa `DesktopDatePicker` para escolher a data.

- `Speech.tsx` — componente de entrada por voz.
	- Usa `react-speech-recognition` para ouvir comandos de voz e `propose` para correspondência de palavras (hours/pollens).
	- Chama `publishPollen` para publicar alterações no Firestore; exibe controles Listen/Stop e o transcript atual.

- `Datagrid/` — pasta com componentes relacionados ao DataGrid (ver `src/components/Datagrid/Datagrid.md`).

- `Projects/` — pasta com listagem, criação, edição e deleção de estações (ver `src/components/Projects/Projects.md`).

- `Graph/` — pasta com lógica e componente para renderizar médias móveis de pólen com Chart.js (ver `src/components/Graph/Graph.md`).

- `Forms/` — formulários de autenticação (SignIn/SignUp) e schemas (ver `src/components/Forms/Forms.md`).

- `Copyright.tsx` — footer simples com copyright e ano corrente.

## Uso e integração

- Importando componentes do diretório principal:

	import { Header, Projects, Datagrid } from 'src/components'

- Os componentes usam o contexto de autenticação (`src/contexts/UserContext.tsx`) e as funções de persistência (`src/lib/*`) para leitura/escrita no Firestore.

## Como testar manualmente

1. Rode a aplicação localmente: `npm install` e `npm run start`.
2. Verifique páginas principais:
	 - Header: confira avatar/nome do usuário e o menu (sign out funciona).
	 - Sheets: escolha uma data, clique em Listen e fale comandos (se suportado pelo navegador), faça upload de CSV e confira o Datagrid.
	 - Projects: crie/edite/delete estações e verifique a atualização da lista.
	 - Graph: selecione estação e intervalo e valide o gráfico.

3. Abra DevTools → Console para checar erros ou mensagens de log (especialmente erros de permissão do Firestore ou problemas de autenticação).


## Arquivos que já têm documentação local

- `src/components/Projects/Projects.md`
- `src/components/Graph/Graph.md`
- `src/components/Forms/Forms.md`
- `src/components/Datagrid/Datagrid.md`

