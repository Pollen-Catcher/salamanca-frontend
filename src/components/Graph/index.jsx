import { LineController } from 'chart.js'
import { TimeScale } from 'chart.js'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'

import { FirebaseContext } from '../../contexts/Auth/firebaseContext'
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Running mean',
    },
  },
}
function getDailySums({ pollenData, pollenName, factor }) {
  const pollens = pollenData?.map((pollen) => {
    return {
      Acer: pollen[pollenName],
      date: pollen.date,
    }
  })
  const dailySums = {}
  pollens?.forEach(({ Acer, date }) => {
    let soma = 0
    for (const el in Acer) soma += Acer[el]
    dailySums[date] = soma * factor // fator de correção aplicado
  })
  return dailySums
}
function getDailyGraph(pollenData, pollenName, factor) {
  const color = `${Math.random() * 256},${Math.random() * 256},${
    Math.random() * 256
  }`
  const dailySums = getDailySums({ pollenData, factor, pollenName })
  const data = {
    labels: Object.keys(dailySums),
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
        data: Object.values(dailySums),
      },
    ],
  }
  return data
}
function getRunningMean({ pollenData, pollenName, factor, n = 5 }) {
  const color = `${Math.random() * 256},${Math.random() * 256},${
    Math.random() * 256
  }`
  const dailySums = getDailySums({ factor, pollenData, pollenName })
  let sum = 0
  const values = Object.values(dailySums)
  const keys = Object.keys(dailySums)
  const runningMean = {}
  for (let i = 0; i < values.length; i++) {
    if (i > n) {
      sum -= values.shift()
    }
    sum += values[i]
    runningMean[keys[i]] = sum / n
  }
  const data = {
    labels: Object.keys(runningMean),
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
        data: Object.values(runningMean),
      },
    ],
  }
  return data
}
function Graph() {
  const [factor, setFactor] = useState([0.486])
  const [data, setData] = useState()
  const { db } = useContext(FirebaseContext)
  const AcerQuery = query(collectionGroup(db, 'days'))
  const [pollens] = useCollectionDataOnce(AcerQuery)
  useEffect(() => {
    //const data = getDailyGraph(pollens, 'Acer', factor)
    const data = getRunningMean({
      factor,
      pollenData: pollens,
      pollenName: 'Acer',
    })
    setData(data)
  }, [])
  useEffect(() => {
    //const data = getDailyGraph(pollens, 'Acer', factor)
    const data = getRunningMean({
      factor,
      pollenData: pollens,
      pollenName: 'Acer',
    })
    setData(data)
  }, [pollens, factor])
  return (
    <div className="flex flex-col justify-center">
      <div className="px-8">
        <p className="text-lg font-bold text-black">Factor : {factor}</p>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={factor}
          onChange={(el) => setFactor(el.target.value)}
        />
      </div>
      <div className="">
        {data ? (
          <Line options={options} data={data} width={2} height={2} />
        ) : (
          <div>
            <p>Sem data</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Graph
