 # Pasta src — visão geral do código-fonte

Este arquivo resume a estrutura da pasta `src/` e aponta a documentação já existente por subpastas. Use-o como ponto de entrada para entender onde estão os componentes, lógica de acesso a dados, modelos e tipos do projeto.

## Estrutura principal

- `src/components/` — componentes React (páginas, widgets e subpastas documentadas). Veja `src/components/components.md` para documentação detalhada.
- `src/config/` — configuração do Firebase (`firebase.ts`) e `config.md` com recomendações de uso e emuladores.
- `src/contexts/` — providers globais (autenticação, wrappers). Documentado em `src/contexts/contexts.md`.
- `src/data/` — dados estáticos, listas e exemplo de CSV (`arrays.ts`, `input.csv`). Documentado em `src/data/data.md`.
- `src/lib/` — utilitários que encapsulam operações com Firestore/Auth (`createStation`, `publishPollen`, `csvToFirestore`, etc.). Documentado em `src/lib/lib.md`.
- `src/models/` — converters e modelos (ex.: `stationConverter`, `PollenDatagridConverter`). Documentado em `src/models/models.md`.
- `src/pages/` — páginas da aplicação (login, register, dashboard, etc.). Consulte `src/pages/pages.md` (documentação a ser adicionada/desenvolvida).
- `src/types/` — tipos TypeScript e declarações. Consulte `src/types/types.md`.

## Arquivos de entrada e rotas

- `src/index.tsx` / `src/main` — (entrypoint do app) monta o React DOM e envolve a aplicação com `GlobalContext`.
- `src/Router.tsx` — define as rotas principais da aplicação (Login, Register, Sheets, Projects, Graph, etc.).

## Como rodar / build

No root do repositório:

1. Instalar dependências: `npm install`
2. Build de produção: `npm run build`
3. Rodar em dev: `npm run start` (Vite)

Se quiser usar emuladores do Firebase para desenvolvimento local (recomendado para não tocar dados reais):

1. Instale e configure Firebase CLI
2. Rode `firebase emulators:start --only firestore,auth`
3. Descomente/ative `connect*Emulator` em `src/config/firebase.ts` ou ajuste para ligar via variável de ambiente.

## Onde procurar o que você precisa

- Se for UI (páginas, botões, formulários): comece em `src/components/` e leia `src/components/components.md` e as docs por subpasta (`Projects`, `Graph`, `Datagrid`, `Forms`).
- Se for lógica de negócio / Firestore: veja `src/lib/lib.md` e os arquivos `src/lib/*.ts`.
- Se for modelos/serialização: veja `src/models/models.md`.
- Se for configuração do Firebase / emuladores: veja `src/config/config.md`.
- Tipos e definições TypeScript: `src/types/types.md`.

## Qualidade / linter / formatação

- O projeto usa Prettier e ESLint (ver `package.json`). Rode `npx prettier --write` e `npx eslint --fix` para aplicar formatação automática.
- Antes de abrir PR: rode `npm run build` e verifique warnings/errors (o build atual gera um warning sobre chunk grande — considerar code-splitting).
