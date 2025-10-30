 # Types

## Visão geral

Esta pasta define tipos TypeScript e declarações que são usados por vários módulos da aplicação (componentes, utilitários e conversores). Ela contém principalmente tipos relacionados aos dados de pólen e uma declaração mínima para o pacote `propose`.

Arquivos:

- `pollen.ts` — interfaces que descrevem a estrutura dos documentos de dia (`DayDocument`), a forma de cada entrada de pólen (`Pollen`) e o formato esperado de cada linha do CSV de import (`PollenCsvInput`).
- `propose.d.ts` — declaração de módulo simples para permitir `import propose from 'propose'` sem erros de tipagem (o pacote não possui tipos embutidos no projeto).

## `pollen.ts` — tipos importantes

- `DayDocument`:
	- `available: string[]` — lista de nomes de pólen presentes no documento
	- `date: string` — id/data do documento (formato `YYYY-MM-DD`)

- `Pollen`:
	- `name: string` — nome do pólen
	- `_0h`..`_23h`: number — campos numéricos para cada hora do dia (usados no DataGrid e nos cálculos do gráfico)

- `PollenCsvInput`:
	- `date: string` — data no formato `YYYY-MM-DD`
	- `name: string` — nome do pólen
	- `interval: number` — hora que será mapeada para a coluna `_#h`
	- `amount: number` — valor numérico a ser aplicado (incrementado) no campo correto

Observações:

- Os campos `_0h`..`_23h` são usados de forma consistente por `PollenDatagridConverter`, `graph.ts` e pelo `Datagrid` para representar 24 colunas horárias.
- Ao manipular dados vindos de fontes externas (CSV, voz), valide e normalize os campos para garantir que `interval` esteja em 0..23 e que `amount` seja number.

## `propose.d.ts`

- Fornece uma declaração mínima `declare module 'propose'` para que o bundler/TypeScript permita importar o pacote `propose` sem types oficiais.
- Se quiser mais segurança, você pode adicionar uma declaração mais completa com as funções exportadas pelo pacote (por exemplo, tipos para as opções e retorno).

