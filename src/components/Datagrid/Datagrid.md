 # Datagrid

## Visão geral

Este diretório contém componentes que encapsulam a tabela de dados (DataGrid) usada para visualizar os dados de pólen por dia. Ele usa o componente `DataGrid` do `@mui/x-data-grid` com um toolbar customizado e paginação personalizada.

## Arquivos

- `index.tsx` — componente principal `Datagrid`. Recebe uma `date` (string no formato usado pela aplicação) como prop, busca os dados do Firestore para a `sheetId` da rota e exibe-os no `DataGrid`. Configura `rows`, `columns` (importado de `src/data/arrays`) e os componentes `Toolbar` e `Pagination` customizados.
- `CustomToolbar.jsx` — define um toolbar com export, seleção de colunas e filtro rápido (usa os utilitários do `@mui/x-data-grid`).
- `Pagination.jsx` — componente de paginação que integra o `Pagination` do MUI com a API interna do DataGrid (usa `useGridApiContext` e seletores para sincronizar página atual e contador de páginas).
- `Datagrid.md` — documentação (este arquivo).

## Como funciona

- O `Datagrid` usa `useParams()` para obter `sheetId` da rota e `useDocumentData(getSheetDateRef(sheetId, date))` para buscar o documento de pólen daquele dia. O resultado (`pollens`) é passado como `rows` ao `DataGrid`.
- `getRowId` retorna `row.name` (cada linha é identificada pelo nome do pólen). As colunas são definidas em `src/data/arrays` para manter separação de dados e apresentação.
- `CustomToolbar` adiciona botões úteis (export, colunas, quick filter) e `Pagination` sincroniza a paginação entre o componente visual e a API do DataGrid.

## Props / API

Componente: `Datagrid({ date: string })`

- `date` (string) — data usada para buscar o documento no Firestore (igual ao id do documento). O componente também lê `sheetId` da rota via `useParams()`.

Retorno: renderiza a grade com os dados; não retorna valores programáticos.

## Como testar manualmente

1. Rode a aplicação: `npm run start`.
2. Abra a rota que mostra a planilha/grade (o componente é usado dentro das páginas que exibem dados por `sheetId` e `date`).
3. Verifique se os dados aparecem: as linhas devem corresponder a nomes de pólen e as colunas aos horários/somas conforme definido em `src/data/arrays`.
4. Teste as funcionalidades do toolbar:
	- Export (download CSV/XLS dependendo da configuração do DataGrid)
	- Mostrar/ocultar colunas com o botão Columns
	- Filtragem rápida pelo campo de pesquisa
5. Teste a paginação e veja se os números de página e navegação refletem corretamente os dados.

## Debug / Troubleshooting

- Se `pollens` estiver `undefined` ou vazio: verifique `getSheetDateRef` e confirme que `sheetId` e `date` estão corretos e que o Firestore contém o documento esperado.
- Verifique o console do navegador para erros relacionados ao DataGrid (por exemplo, conflito de tipos em `rows` ou `getRowId`).
- Se a exportação não funcionar, confirme a versão do `@mui/x-data-grid` e as opções habilitadas para export.


