 # Lib

## Visão geral

O diretório `src/lib` contém utilitários que encapsulam operações com o Firebase (Firestore / Auth) — criação/atualização/deleção de estações, escrita de dados de pólen por planilha/dia, referência do usuário, e consultas usadas por componentes. A ideia é manter a lógica de acesso a dados centralizada e reutilizável.

## Arquivos principais:

- `user.ts` — pequenas funções auxiliares relacionadas a usuários (`getUserRef`).
- `station.ts` — criação, listagem (query por usuário), atualização e deleção de estações.
- `sheet.ts` — funções para publicar pólen (`publishPollen`), importar CSV (`csvToFirestore`), obter referência a documento de dia (`getSheetDateRef`) e consultas por estação (`getPollensByStation`).

## `user.ts`

- getUserRef(userUid: string): DocumentReference — retorna `doc(db, 'users/{uid}')`. Usado no `UserContext` para criar/atualizar o documento do usuário.

## `station.ts` — resumo das funções

- getStationsRef(): CollectionReference<Station> — retorna a collection `stations` com o `stationConverter`.
- getUsersStationRef(): Query<Station> | null — retorna uma query filtrada por `userUid === auth.currentUser.uid` ou `null` se não houver usuário autenticado. Importante: `auth.currentUser` pode ser `undefined` no primeiro render; os consumidores (react-firebase-hooks) aceitam `null`.
- createStation({ name, location }) — cria um documento na coleção `stations` com campos `name`, `location`, `userUid`, `createdAt`, `lastEditedAt`.
- deleteStation(id) — deleta o documento `stations/{id}` usando `deleteDoc`.
- updateStation(id, data) — atualiza campos (ex.: `name`, `location`) e seta `lastEditedAt` com `serverTimestamp()`.

Observações:
- `getUsersStationRef` usa `auth.currentUser` diretamente; em ambientes onde o estado de autenticação é assíncrono esse método pode retornar `null` inicialmente — os consumidores devem tratar esse caso.
- As funções `deleteStation` e `updateStation` usam import dinâmico (`await import('firebase/firestore')`) para reduzir o bundle inicial (lazy import).

## `sheet.ts` — resumo das funções

- getSheetDateRef(stationId, date): DocumentReference<Pollen[]> — retorna o documento `stations/{stationId}/days/{date}` com converter para o formato de grid do componente.
- publishPollen({ pollen, interval, amount, sheetId, date }) — atualiza um documento de dia incrementando o campo `${pollen}.${interval}` (ex.: `Cannabis._3h`) com `increment(amount)` e adiciona o pollen a `available` via `arrayUnion`. Se o documento não existir (FirestoreError code 'not-found'), cria o documento com `setDoc`.
- csvToFirestore(data: PollenCsvInput[], sheetId) — escreve um batch (writeBatch) com operações `set(..., { merge: true })` para cada linha do CSV; usa `increment(amount)` para acumular valores no mesmo documento/dia. Requer usuário autenticado (`auth.currentUser.uid`).
- getPollensByStation(sheetIds) — retorna uma `collectionGroup` query sobre `days` para as `station` passadas e `userUid` atual — usada pelo Graph para agregar dados por estação.
- deleteSheet(sheetId) — deleta o documento `sheets/{sheetId}` (função simples que usa `deleteDoc`).

## Pontos críticos e dicas de debug

- Autenticação: várias funções dependem de `auth.currentUser` — em ambientes de SSR ou durante inicialização do app, garanta que o usuário esteja logado antes de chamar (ou trate retorno `null`).
- Permissões do Firestore: se `publishPollen`/`csvToFirestore` falham, verifique `firestore.rules` (raiz do projeto) e o console do Firebase ou os logs do emulador.
- Consistência de nomes: `csvToFirestore` usa o campo `name` do CSV como chave no documento. Nomes inconsistentes (diferenças de case/espacos) podem gerar duplicatas. Recomenda-se normalizar nomes antes do batch.
- Erros silenciosos: algumas funções capturam erros e fazem `console.error` sem rethrow; se você precisa de feedback na UI (Snackbar), ajuste para propagar erros ao chamador.

## Como testar localmente

1. Autentique-se na aplicação (login) — funções escrevem usando `auth.currentUser.uid`.
2. Testar `publishPollen` via UI: use o componente `Speech` (clicando em Listen e pronunciando comandos) ou chamadas diretas no código de desenvolvimento.
3. Testar CSV: na página Sheets, carregue `src/data/input.csv` pelo `CSVReader` e verifique se os documentos `stations/{sheetId}/days/{date}` foram criados/atualizados. Use Firebase Emulator para evitar alterar dados reais.
4. Testar estações: criar via UI (Projects), editar (Save) e deletar; verifique coleções `stations` no Firestore.

