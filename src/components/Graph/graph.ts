import { ChartOptions } from "chart.js"
import { ChartData } from "chart.js"
import {DocumentData}from "firebase/firestore"
export const movingAverageOptions:ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Moving Average',
      font:{size:24,family:"Times New Roman"},
    },
  },scales:{
    x:{
      title:{
        display:true,
        align:"end",
        font:{size:24,family:"Times New Roman"},
        text:"Days"
      }
    },
    y:{
      title:{
        display:true,
        align:"start",
        font:{size:24,family:"Times New Roman"},
        text:"Average Pollen Concentration (Pollen/m³)"
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
  pollens: IDataFetch[],
  pollenName: string,
  initialDate: Date,
  finalDate?: Date
}
export interface IGetMovingAverageParams{
  dailyConcentrations:any
  factor:number
  n?:number
  pollenName:string
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
export function getDataGraph({ pollens, pollenName, initialDate, finalDate = new Date(formatDate(new Date())) }: IGetDataGraphParams) {
  const pollenGraph = pollens.filter((pollen) => pollen.pollenName === pollenName)
  if (!pollenGraph) return // Pollen don't exists
  if (initialDate.getTime() > Date.now()) return // Initial date greater to final date
  const validData: any = {}
  pollenGraph.forEach((pollen) => {
    const dailySum = getDailySum(pollen)
    if (new Date(pollen.date).getTime() > Date.now()) return
    validData[pollen.date] = dailySum
  })
  const qtdDays = (finalDate.getTime() - initialDate.getTime()) / (1000 * 60 * 60 * 24)// milliseconds to days
  let date = initialDate
  for (let i = 0; i < qtdDays; i++) {
    const currentday = formatDate(date)
    if (!validData[currentday]) validData[currentday] = 0
    date = getNextDay(date)
  }
  return validData
}
export function getNextDay(day: Date) {
  const oneDayInMilliseconds = 1 * 24 * 60 * 60 * 1000
  const newDay = day.getTime() + oneDayInMilliseconds
  return new Date(newDay)
}
export function getMovingAverage({dailyConcentrations,factor,n=5,pollenName}:IGetMovingAverageParams) {
  const color = `${Math.random() * 256},${Math.random() * 256},${
    Math.random() * 256
  }`
  let sum = 0
  // data in ascending order to provide a consistent distribution of running mean values in the graph
  const dataMap:[string,number][]=Object.entries<number>(dailyConcentrations)
    .sort((a,b)=>{
      return new Date(a[0]).getTime()-new Date(b[0]).getTime()})
  const interactions=dataMap.length+1
  let aux=dataMap.map(el=>el[1]) // array to remove the previous average daily concentration from the moving average
  const movingAverage:any = {}  // 
  for (let i = 0; i < interactions; i++) {
    if (i >= n) {
      sum -= Number(aux.shift())*factor
      console.log(i);
    }    
    sum += Number(dataMap[i]?.[1])*factor
    movingAverage[dataMap[i]?.[0]] = sum / n
  }
  console.log(dataMap.length);
  
  const data :ChartData<"line">= {
    labels: Object.keys(movingAverage),
    datasets: [
      {
        label: pollenName,
        fill: false,
        backgroundColor: `rgba(${color},0.4)`,
        borderColor: `rgba(${color},1)`,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: `rgba(${color},1)`,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: `rgba(${color},1)`,
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Object.values(movingAverage),
      },
    ],
  }
  return data
}