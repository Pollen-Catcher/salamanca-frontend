<p align="center">
  <img width="200" height="200" alt="image-Photoroom" src="https://github.com/user-attachments/assets/d1ce4253-c1ef-4833-9fd5-fbb6fb1b6514" />
</p>

<h1 align="center"> Pollen Catcher </h1>

<h2>Descrição</h2>
Pollen Catcher é um site que foi idealizado pelos alunos do CEFET-MG em conjunto com a Universidade de Salamanca, com o objetivo de facilitar a coleta de dados de pesquisa sobre pólens.

<h2>Status do projeto</h2>
:construction: Projeto em construção :construction:

<h2>Funcionalidades</h2>

- `Interface CRUD`: permitimos que o usuário crie, leia, atualize e exclua os registros feitos.
- `Reconhecimento de fala`: usamos reconhecimento de palavras em inglês para registrar espécies de pólens.
- `Execução de comandos`: com uma paleta de comandos, é possível definir em qual horário o pólen em questão foi observado, excluir um registro, desligar o microfone, entre outros.
- `Gerar gráficos de resultados`: coletados todos os dados, oferecemos a possibilidade de visualizá-los em forma de gráficos.

<h2>Acesso</h2>
Você pode acessar o nosso projeto clicando no link: https://salamanca-project.web.app/dashboard

## Principais tecnologias

- React 18 (Hooks)  
- TypeScript 
- Vite + Rollup  
- Firebase (Auth, Firestore — SDK modular v9)  
- Material UI (@mui/material, @mui/icons-material)  
- TailwindCSS  
- Chart.js + react-chartjs-2  
- react-hook-form, react-firebase-hooks

## Estrutura (resumo)

- `public/` — assets públicos consumidos pelo Vite.  
- `src/` — código-fonte (componentes, context, lib, models, types, pages). Consulte `src/src.md` para documentação por subpastas.  
- `package.json` — scripts e dependências.  
- `vite.config.ts`, `tsconfig.json` — config de build/TS.  
- `firebase.json`, `firestore.rules`, `firestore.indexes.json` — configuração do Firebase.

## Pré-requisitos

- Node.js (recomendado v18+)  
- npm  
- Firebase CLI (opcional, para emuladores)

## Instalação

No PowerShell (Windows):

```powershell
git clone <repo-url>
cd salamanca-frontend
npm install
```

## Scripts úteis

- Rodar em dev (Vite):

```powershell
npm run start
```

- Build de produção:

```powershell
npm run build
```


<h2>Agradecimentos:</h2>

- `FAPEMIG`
- `Diretoria de Graduação do CEFET-MG`
- `Diretoria de Pesquisa e Pós-Graduação do CEFET-MG`
- `COMPET`
- `Universidade de Salamanca `

<h2>Autores</h2>

| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/51031674?v=4" width=115><br><sub>Guilherme Augusto</sub>](https://github.com/Guilhermeaug) |  [<img loading="lazy" src="https://avatars.githubusercontent.com/u/67330930?v=4" width=115><br><sub>Henrique de Paula Rodrigues</sub>](https://github.com/bidwolf) |  [<img loading="lazy" src="https://avatars.githubusercontent.com/u/71090685?v=4" width=115><br><sub>Francisco Abreu Gonçalves</sub>](https://github.com/Francis1408) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/164511796?v=4" width=115><br><sub>Matheus Ramos</sub>](https://github.com/matheusd-ramos) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/168022465?v=4" width=115><br><sub>Carlos Reis</sub>](https://github.com/CarlosReisDev) |
| :---: | :---: | :---: | :---: | :---: |
