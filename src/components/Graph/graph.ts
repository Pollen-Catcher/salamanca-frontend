import { ChartOptions } from "chart.js"
import { ChartData, ChartDataset } from "chart.js"
import { DocumentData } from "firebase/firestore"
export const movingAverageOptions: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Moving Average',
      font: { size: 24, family: "Times New Roman" },
    },
  }, scales: {
    x: {
      title: {
        display: true,
        align: "end",
        font: { size: 24, family: "Times New Roman" },
        text: "Days"
      }
    },
    y: {
      title: {
        display: true,
        align: "start",
        font: { size: 24, family: "Times New Roman" },
        text: "Average Pollen Concentration (Pollen/m³)"
      }
    }
  }
}
export interface Pollen {
  _0h?: number
  _1h?: number
  _2h?: number
  _3h?: number
  _4h?: number
  _5h?: number
  _6h?: number
  _7h?: number
  _8h?: number
  _9h?: number
  _10h?: number
  _11h?: number
  _12h?: number
  _13h?: number
  _14h?: number
  _15h?: number
  _16h?: number
  _17h?: number
  _18h?: number
  _19h?: number
  _20h?: number
  _21h?: number
  _22h?: number
  _23h?: number
}
export interface IDataFetch {
  pollenName: string
  date: string
  pollen: Pollen
}
export function fetchPollens(dataApi: DocumentData[] | undefined): IDataFetch[] {
  const data: IDataFetch[] = []
  dataApi?.forEach((pollen) => {
    const date = pollen["date"]
    for (const k in pollen) {
      if (k == "date") {
        continue
      }
      data.push({ pollenName: k, pollen: pollen[k], date })
    }
  }
  )
  return data
}
export function getDailySum({ pollen }: IDataFetch) {
  let dailySum = 0
  const a = Object.values(pollen)
  for (const o in a) dailySum += a[o]
  return dailySum
}
export interface IGetDataGraphParams {
  pollens: IDataFetch[]|undefined,
  pollenName: string,
  initialDate: Date,
  finalDate: Date
}
export interface IGetMovingAverageParams {
  pollens: IDataFetch[]|undefined,
  initialDate: Date,
  finalDate?: Date
  factor: number
  n?: number
  pollenNames: string[]
}
export function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}
export function formatDate(date: Date) {
  return [
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    date.getFullYear(),
  ].join('-');
}
export function getDataGraph({ pollens, pollenName, initialDate, finalDate }: IGetDataGraphParams) {
  if(!pollens) return
  if (initialDate.getTime() > Date.now()) return // Initial date greater to final date
  const pollenGraph = pollens.filter((pollen) => pollen.pollenName === pollenName)
  if (!pollenGraph) return // Pollen don't exists
  const validData: any = {}
  pollenGraph.forEach((pollen) => {
    const dailySum = getDailySum(pollen)
    const pollenDate = new Date(pollen.date).getTime() // date of collection of current data
    if (pollenDate > Date.now() || pollenDate < initialDate.getTime()) return // check if date of collection isn't valid
    validData[pollen.date] = dailySum
  })
  const qtdDays = (finalDate.getTime() - initialDate.getTime()) / (1000 * 60 * 60 * 24) // milliseconds to days
  let date = initialDate
  for (let i = 0; i < qtdDays; i++) {
    const currentDay = formatDate(date)
    if (!validData[currentDay]) validData[currentDay] = 0 // fills the map with days when there is no data
    date = getNextDay(date) // go to next day
  }  
  return validData
}
export function getNextDay(day: Date) {
  const oneDayInMilliseconds = 1 * 24 * 60 * 60 * 1000
  const newDay = day.getTime() + oneDayInMilliseconds
  return new Date(newDay)
}
export function getRandomColor() {
  // The line color of the current pollen
  const color = `${Math.random() * 256},${Math.random() * 256},${Math.random() * 256
    }`
  return color
}
export function getOrderedConcentrations(dailyConcentrations: any) {
  // data in ascending order to provide a consistent distribution of running mean values in the graph
  const dataMap: [string, number][] = Object.entries<number>(dailyConcentrations)
    .sort((a, b) => {
      return new Date(a[0]).getTime() - new Date(b[0]).getTime()
    })    
  return dataMap
}
export function getMovingAverage(dataMap: [string, number][], n: number, factor: number) {
  let sum = 0
  const interactions = dataMap.length  
  let aux = dataMap.map(el => el[1]) // array to remove the previous average daily concentration from the moving average
  const movingAverage: any = {}
  for (let i = 0; i < interactions; i++) {
    if (i >= n) {
      sum -= Number(aux.shift()) * factor
    }
    sum += Number(dataMap[i]?.[1]) * factor
    movingAverage[dataMap[i]?.[0]] = sum / n
  }  
  return movingAverage
}
export function getMovingAverageGraph({ initialDate, factor, n = 5, pollenNames, pollens, finalDate = new Date(formatDate(new Date())) }: IGetMovingAverageParams) {
  const color = pollenNames.map(()=>getRandomColor())
  const dailyConcentrations = pollenNames.map(pollenName=>getDataGraph({ initialDate, pollenName, pollens, finalDate }))
  const dataMaps = dailyConcentrations.map(dailyConcentration=>getOrderedConcentrations(dailyConcentration))  
  const movingAverages = dataMaps.map(dataMap=>getMovingAverage(dataMap, n, factor))
  const datasets: ChartDataset<"line">[]=[]
  movingAverages.forEach((movingAverage,index)=>{
    
  const dataset:ChartDataset<"line">={
    
      label: pollenNames[index],
      fill: false,
      backgroundColor: `rgba(${color[index]},0.4)`,
      borderColor: `rgba(${color[index]},1)`,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: `rgba(${color[index]},1)`,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: `rgba(${color[index]},1)`,
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: Object.values(movingAverage),
  }
  datasets.push(dataset)
  })
  const data: ChartData<"line"> = {
    labels: Object.keys(movingAverages[0]),
    datasets
  }
  return data
}