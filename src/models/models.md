 # Models

## Visão geral

Esta pasta agrupa modelos/convertidores usados para mapear documentos do Firestore para estruturas tipadas no cliente. Os converters facilitam leitura/escrita com tipos consistentes e são usados por `src/lib` e pelos componentes que consomem dados (por exemplo `Projects`, `Datagrid`, `Graph`).

Arquivos nesta pasta:

- `Station.ts` — definição da interface `Station` e `stationConverter` (FirestoreDataConverter).
- `PollenDatagridConverter.ts` — conversor para os documentos `stations/{id}/days/{date}` que transforma o objeto Firestore em um array de `Pollen` (cada item com `name` e campos por hora `_0h`..`_23h`).
- `User.js` — classe `User` simples e `userConverter` (arquivo em JS). Pode ser usado para criação/serialização de documentos de usuário.

## `Station.ts`

- Interface `Station`:
	- `id: string` — id do documento
	- `name: string`
	- `location: string`
	- `userUid: string` — dono/usuário
	- `createdAt: Timestamp`
	- `lastEditedAt: Timestamp`

- `stationConverter: FirestoreDataConverter<Station>`
	- `toFirestore` serializa apenas os campos relevantes (não inclui `id`).
	- `fromFirestore` reconstrói `Station` incluindo `id: snapshot.id`.

Uso típico:

```ts
import { getStationsRef } from '../lib/station'
const ref = getStationsRef()
// ref.withConverter(stationConverter) já está aplicado em getStationsRef
```

## `PollenDatagridConverter.ts`

- Objetivo: ler o documento de dia `stations/{stationId}/days/{date}` e transformar o conteúdo (um objeto cujas chaves são nomes de pólen e valores são objetos com `_#h`) em um array de objetos `Pollen` adequado para exibição no DataGrid.
- Implementação:
	- `fromFirestore` filtra as chaves reservadas (`date`, `available`, `userUid`, `station`) e mapeia o restante para `{ name: key, ...value }`.
	- `toFirestore` atualmente devolve `{ ...data }` (pass-through). Dependendo do uso você pode querer uma serialização mais restrita.

Exemplo de resultado esperado de `fromFirestore`:

```json
[
	{ "name": "Cannabis", "_0h": 5, "_1h": 12, ... },
	{ "name": "Acer", "_0h": 0, "_1h": 3, ... }
]
```

## `User.js`

- Contém uma classe `User` (construtor com uid, name, displayName) e `userConverter` simples.
- Observação: é um arquivo em JavaScript (não TypeScript). Está OK, mas para consistência do projeto você pode convertê-lo para TS e tipar melhor o converter.

