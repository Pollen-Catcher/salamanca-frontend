
# Graph component

## Visão geral

Esta pasta implementa a funcionalidade de visualização de dados (gráficos) das estações. Ela reúne lógica de processamento dos dados brutos de pólen (somas diárias, médias móveis, formatação) e o componente React que renderiza o gráfico com controles para selecionar estação, intervalo de datas, pollens e fator de suavização.

Arquivos principais:

- `graph.ts` — função utilitárias para transformar os dados do Firestore em dados prontos para o Chart.js: parsing (`fetchPollens`), agregação diária (`getDailySum`, `getDataGraph`), ordenação e cálculo de média móvel (`getMovingAverage`, `getMovingAverageGraph`) e helpers (formatação de datas, cores aleatórias, etc.).
- `index.tsx` — componente React que monta a UI: inputs para intervalo de datas, seleção de estação, seleção/adição de pollens, range para o `factor` e o componente `Line` do `react-chartjs-2`. Faz a conexão com Firestore via `useCollectionDataOnce` e `getUsersStationRef` / `getPollensByStation`.
- `PollenData.ts` — conversor (`FirestoreDataConverter`) que transforma os documentos do Firestore em um formato de dados de pólen simplificado usado pelo gráfico (nome, data, soma diária).

## Funções e responsabilidades (resumo técnico)

- fetchPollens(dataApi: DocumentData[] | undefined): IDataFetch[] — converte o documento Firestore (objeto com chaves de pólen por hora) em um array de objetos { pollenName, date, pollen }.
- getDailySum({ pollen }): number — soma as contagens horárias daquele objeto pollen para retornar um valor diário.
- getDataGraph({ pollens, pollenName, initialDate, finalDate }) — produz um mapa (date -> dailySum) preenchendo dias sem dados com 0 e filtrando o intervalo.
- getOrderedConcentrations(dailyConcentrations) — transforma o map em um array ordenado [date, value] para cálculos ordenados no tempo.
- getMovingAverage(dataMap, n, factor) — calcula uma média móvel ponderada (com factor) sobre os valores ordenados.
- getMovingAverageGraph({...}): ChartData<'line'> — orquestra todo o processo para uma lista de `pollenNames`, gerando datasets com cores aleatórias e labels (datas ordenadas) prontos para o Chart.js.

## Como usar / testar manualmente

Pré-requisitos: Firestore populado com coleções `stations` e subcoleções/coleções de pólen compatíveis com o conversor usado. Usuário autenticado para que `getUsersStationRef()` retorne estações.

1. Instale dependências e rode a aplicação localmente:

	npm install
	npm run start

2. Abra a UI e navegue para a rota do gráfico (Graph).
3. Selecione a estação (dropdown). Se nenhuma estação aparecer, verifique se você está autenticado e se `stations` existem para esse usuário.
4. Selecione a data inicial (obrigatória) e, opcionalmente, a data final.
5. Use o seletor de pollens para adicionar uma ou mais séries ao gráfico.
6. Ajuste o `factor` (slider) para alterar o peso aplicado na média móvel. Clique em adicionar (Add) para inserir um pollen na lista.
7. Observe o gráfico — se houver erro, uma mensagem aparecerá na área do gráfico.

Comportamentos esperados/erros comuns:

- Se `initialDate` for maior que a data atual, o componente seta um erro (validação no `useEffect`).
- Se não houver dados para o intervalo selecionado, o gráfico exibirá "No data".
- Mudanças nos documentos Firestore não são automaticamente observadas por esse componente (usa `useCollectionDataOnce` para pollens); recarregar a página requisita os dados novamente.

## Debug / Troubleshooting

- Autenticação: `getUsersStationRef()` depende de `auth.currentUser` — confira se o usuário está logado.
- Firestore rules: erros de leitura aparecem no console do navegador se as regras bloquearem o acesso.
- Dados esperados: o conversor em `PollenData.ts` assume que cada documento tem chaves por tipo de pólen com estruturas por hora. Se a estrutura for diferente, `fetchPollens`/`getDailySum` podem produzir NaN ou somas incorretas.
- Console: para ver erros ou saídas, abra DevTools → Console; os erros de validação de datas também são mostrados no bloco do gráfico.