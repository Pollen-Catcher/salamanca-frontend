# PollenCatcher — visão geral do repositório

Este arquivo fornece uma visão de alto nível do repositório `salamanca-frontend` (Pollen Catcher), instruções rápidas de execução e links para a documentação já presente dentro do projeto.

## Objetivo do projeto

Aplicação frontend em React + Vite para visualização, cadastro e análise de dados de pólen (estações, planilhas, gráficos). Usa Firebase (Auth + Firestore) como backend e Material UI para a interface.

## Estrutura resumida (top-level)

- `public/` — ativos públicos (imagens, favicon, arquivos estáticos) usados pelo Vite.
- `src/` — código-fonte da aplicação. Há documentação por subpastas em `src/` (veja `src/src.md`).
- `package.json` — scripts e dependências.
- `vite.config.ts` — configuração do Vite.
- `tsconfig.json` / `tsconfig.node.json` — configurações TypeScript.
- `tailwind.config.js` / `postcss.config.js` — configurações de estilo (Tailwind).
- `firebase.json`, `firestore.rules` e `firestore.indexes.json` — configuração e regras do Firebase.
- `README.md` — resumo curto (padrão). Use `SALAMANCA-FRONTEND.md` para uma visão técnica mais detalhada.

## Tecnologias principais

- React 18 (Function Components, Hooks)
- TypeScript (misturado com alguns arquivos .js)
- Vite + Rollup (build)
- Firebase (modular v9 — Auth + Firestore)
- Material UI (@mui/material, @mui/icons-material)
- Chart.js + react-chartjs-2 (gráficos)
- react-hook-form, react-firebase-hooks
- TailwindCSS

## Como rodar localmente (PowerShell / Windows)

1. Instalar dependências:

```powershell
npm install
```

2. Rodar em modo dev (Vite):

```powershell
npm run start
```

3. Build de produção:

```powershell
npm run build
```

Observações:
- O projeto pode usar variáveis de ambiente via `import.meta.env.VITE_*`. Verifique `src/config/firebase.ts` para configurações do Firebase.
- Para não mexer nos dados reais, recomenda-se usar o Firebase Emulator: rode `firebase emulators:start --only firestore,auth` e conecte-o via `connectFirestoreEmulator` / `connectAuthEmulator` (veja `src/config/firebase.ts`).

## Locais importantes para edição/impacto rápido

- `src/lib/` — encapsula operações com Firestore (criação, leitura, atualização, exclusão). Testes de integração devem começar aqui.
- `src/components/Projects` — CRUD de estações (criar, editar, deletar) e tabelas.
- `src/components/Graph` — lógica de transformação para gráficos (`graph.ts`) e componente React.
- `src/context/` — providers para autenticação e estado global.

## Documentação já presente

- `src/src.md` — visão geral do `src/`. Use como ponto de partida.
- Documentos por subpastas foram gerados: `src/components/*/*.md`, `src/lib/lib.md`, `src/models/models.md`, etc. Procure por `*.md` dentro de `src/` para ler cada seção.




