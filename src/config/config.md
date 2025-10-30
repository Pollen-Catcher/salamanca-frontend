
# Configuração do projeto

Esta pasta contém a configuração do Firebase usada pela aplicação. Atualmente há apenas o arquivo:

- `firebase.ts` — inicializa o app Firebase e exporta as instâncias `app`, `auth` e `db` (Firestore).

## O que está em `firebase.ts`

Principais pontos:

- O objeto `firebaseConfig` contém as chaves públicas do projeto (apiKey, authDomain, projectId, ...). Essas chaves são consideradas configuração de cliente pelo Firebase — não são segredos no sentido tradicional — mas em produção é recomendável controlá-las via variáveis de ambiente para facilitar troca de projeto/ambientes.
- `initializeApp(firebaseConfig)` inicializa o SDK.
- `getFirestore(app)` e `getAuth(app)` criam as instâncias usadas por todo o app e são exportadas como `db` e `auth`.
- Há linhas comentadas para conectar os emuladores locais de Auth e Firestore (úteis em desenvolvimento):

```ts
// connectFirestoreEmulator(db, 'localhost', 8085)
// connectAuthEmulator(auth, 'http://localhost:9099')
```

Descomente e ajuste as portas se desejar rodar os emuladores localmente.

## Como usar

Em outros módulos você já encontra importações do tipo:

```ts
import { app, auth, db } from '../config/firebase'
```

Use `db` para operações do Firestore (`getFirestore`, `doc`, `collection`, etc.) e `auth` para autenticação (login, logout, usuário atual).


## Testes e verificação

- Para desenvolvimento com emuladores:

	1. Instale e configure Firebase CLI (https://firebase.google.com/docs/cli).
	2. Rode `firebase emulators:start --only firestore,auth` na raiz do projeto (assumindo que `firebase.json` está configurado).
	3. Descomente as chamadas `connect*Emulator` em `firebase.ts` ou configure runtime para detectar `NODE_ENV`.

- Para checar se a inicialização funciona: abra o console do navegador na aplicação em dev e verifique `window.firebase` ou observe logs de operações Firestore/Auth.

