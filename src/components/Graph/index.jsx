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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
import { pollensList } from '../../data/arrays'

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
}
const datasets = []
// cria cores para cada pollen para ser adicionado posteriormente
pollensList.forEach((pollen) => {
  const label = pollen
  const color = `${Math.random() * 256},${Math.random() * 256},${
    Math.random() * 256
  }`
  // gera dados aleatórios de coletas enquanto o banco de dados ainda não está configurado
  function generateData(n) {
    const data = []
    for (let i = 0; i < n; i++) {
      const num = Math.random() * 256
      data.push(num)
    }
    return data
  }
  const data = generateData(7)
  const dataset = {
    label,
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
    data,
  }
  datasets.push(dataset)
})
function getPollens(dateInitial, dateFinal) {
  if (!dateFinal) {
    const data = generateData(24)
    const dataset = {
      labels: [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
      ],
      data,
    }
  }
}
const data2 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets,
}
const getAcer = async (query) => {
  try {
    const data = await getDocs(query)
    return data
  } catch (error) {
    console.error(error)
  }
}
async function Graph() {
  const { db } = useContext(FirebaseContext)
  const [data, setData] = useState()
  const AcerQuery = query(collectionGroup(db, 'days'))
  useEffect(async () => {
    const data = await getAcer(AcerQuery)
    setData(data)
  }, [])
  console.log(data)
  return (
    <div className="flex items-center justify-center">
      <Line options={options} data={data2} width={200} height={200} />
    </div>
  )
}

export default Graph
