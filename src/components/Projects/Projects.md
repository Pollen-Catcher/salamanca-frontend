
# Projects component

## Visão geral

Esta pasta implementa a área de "Projects" (estações de coleta) da aplicação. Ela contém o componente que lista as estações do usuário, permite criar novas estações, editar nome/local e deletar estações existentes. A persistência é feita no Firestore através das funções em `src/lib/station.ts`.

## Arquivos

- `index.tsx` — componente principal da página Projects. Contém o botão para abrir o modal de criação (`Create New Project`) e o formulário para adicionar uma nova estação. Usa `createStation` em `src/lib/station.ts`.
- `Table.jsx` — componente que renderiza a tabela de estações. Busca as estações do usuário com `useCollectionData(getUsersStationRef())`, lista `name` e `location`, e fornece ações: Edit (abre modal para alterar name/location), Generate graph (link para rota de gráfico) e Delete (remove do Firestore usando `deleteStation`).
- `styles.js` — estilos customizados para `TableCell`/`TableRow` usando `@mui/material`'s `styled`.
- `Projects.md` — (este arquivo) documentação da pasta Projects.

## Funções importantes

As operações de leitura/escrita ficam em `src/lib/station.ts`:

- `createStation({ name, location })` — cria um documento `stations/*` com campos: `name`, `location`, `userUid`, `createdAt` e `lastEditedAt`.
- `getUsersStationRef()` — retorna uma `Query` (com converter) que filtra `stations` por `userUid = auth.currentUser.uid`. Atenção: retorna `null` se `auth.currentUser` não existir.
- `deleteStation(id)` — deleta o documento `stations/{id}`.
- `updateStation(id, data)` — atualiza campos (p.ex. `name`, `location`) e seta `lastEditedAt` com timestamp do servidor.

## Como usar (desenvolvimento / teste)

1. Instale dependências e inicie a aplicação localmente:

	- Instalar: `npm install`
	- Rodar em dev: `npm run start` (inicia o Vite)

2. Acesse a rota de Projects na UI (com a aplicação rodando). É preciso estar autenticado para que `getUsersStationRef()` retorne as estações do usuário.

3. Criar estação:
	- Clique em "Create New Project".
	- Preencha Name e Location e clique em "Add Project".
	- A estação deve aparecer automaticamente na tabela (o hook `useCollectionData` assina as mudanças do Firestore).

4. Editar estação:
	- Clique no ícone Edit na linha da estação.
	- Modifique Name/Location no modal e clique Save.
	- A alteração usa `updateStation(id, { name, location })` e a tabela deve atualizar automaticamente.

5. Deletar estação:
	- Clique no ícone Delete (um diálogo de confirmação aparece).
	- Confirmando, `deleteStation(id)` é chamado e o documento é removido; a tabela deve atualizar.


## Possíveis pontos de falha e debugging

- Autenticação: `getUsersStationRef()` só funciona se `auth.currentUser` estiver definido. Se o usuário não estiver logado, a query será `null` e a lista não será carregada.
- Regras do Firestore: operações de escrita/leitura podem falhar por regras de segurança. Se uma operação falhar, cheque o console do navegador para mensagens de erro e verifique `firestore.rules`.
- Erros no console: os componentes atualmente usam `console.error` e `alert(...)` para informar falhas. Veja o console do navegador para o stack trace completo.