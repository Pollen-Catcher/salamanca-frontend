 # Data

## Visão geral

O diretório `src/data` contém dados estáticos e exemplos usados pela aplicação — listas de tipos de pólen, configuração das colunas do `DataGrid` e um `input.csv` de exemplo para popular o Firestore via upload/CSV import.

Arquivos:

- `arrays.ts` — exporta `pollensList` (lista de nomes de pólen usados pelo app) e `columns` (configuração das colunas para o `DataGrid`).
- `input.csv` — exemplo de CSV com linhas no formato `date,name,interval,amount` usado para testar o import (`csvToFirestore` em `src/lib/sheet.ts`).
- `data.md` — este arquivo (documentação).

## `arrays.ts` — o que contém

- `pollensList: string[]` — lista de nomes de pólen que aparece em seletores (por exemplo no componente Graph e na entrada por voz). Use essa lista ao validar nomes de pólen em comandos por voz ou inputs manuais.

	Exemplo de uso:

	```ts
	import { pollensList } from '../data/arrays'
	// verificar se um nome é válido
	const valid = pollensList.includes('Acer')
	```

- `columns: DatagridColumn[]` — definição das colunas do `DataGrid` usado em `src/components/Datagrid/index.tsx`.

	- Campo `name` (identificador) + colunas `_0h` a `_23h` para as 24 horas.
	- `getRowId` no DataGrid usa `row.name` (cada linha representa um tipo de pólen).

	Exemplo de uso:

	```tsx
	<DataGrid rows={rows} columns={columns} getRowId={(r) => r.name} />
	```

## `input.csv` — formato e como usar

O arquivo `input.csv` é um exemplo com as colunas:

- `date` — string no formato `YYYY-MM-DD` (usada como id do documento de planilha/dia)
- `name` — nome do pólen (deve estar em `pollensList` ou será tratado como `Indeterminado` se necessário)
- `interval` — número da hora (0..23) indicando a coluna horario (será convertido para `_#h` internamente)
- `amount` — valor numérico para somar naquela hora

Este arquivo é usado como exemplo para o upload CSV (componente `CSVReader` em `Sheets.tsx`) que chama `csvToFirestore(data, sheetId)` para escrevê-lo no Firestore. O import transforma linhas com o mesmo date+name em um documento com campos `_0h`..`_23h` e soma os valores conforme o `interval`.

Como testar o CSV localmente:

1. Rode a aplicação (`npm run start`).
2. Abra a página Sheets (onde houver o `CSVReader`).
3. Faça upload do `src/data/input.csv` e observe se os dados aparecem no Datagrid para a `sheetId`/date escolhidos. Verifique o console e o Firebase emulador (se estiver usando) para confirmar as escritas.


## Onde o data é usado

- `pollensList` é usado em `src/components/Graph/index.tsx`, `src/components/Speech.tsx` e em validações de input.
- `columns` é importado por `src/components/Datagrid/index.tsx` para renderizar as colunas da tabela.
- `input.csv` é um exemplo consumido pelo `CSVReader` em `Sheets.tsx` e pelo utilitário `csvToFirestore` em `src/lib/sheet.ts`.


