import {
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Chart as ChartJS,
  ChartData,
  CategoryScale
} from 'chart.js'
import { collectionGroup, query } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import {fetchPollens,getMovingAverage,getDataGraph,movingAverageOptions}from"./graph"
import { FirebaseContext } from '../../contexts/Auth/firebaseContext'
ChartJS.register(
  LinearScale,
  LineController,
  LineElement,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function Graph() {
  const [factor, setFactor] = useState(0.486)
  const [data, setData] = useState<ChartData<"line">>()
  const { db } = useContext(FirebaseContext)
  const AcerQuery = query(collectionGroup(db, 'days'))
  const [pollens] = useCollectionDataOnce(AcerQuery)
  useEffect(() => {
    if (!pollens) return
    const dataFetch = fetchPollens(pollens)
    if (!dataFetch) return
    const dailyMap = getDataGraph({ pollens: dataFetch, pollenName: "Acer", initialDate: new Date("11-12-2022") })
    const data = getMovingAverage({dailyConcentrations:dailyMap,factor,pollenName:"Acer"})
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
          onChange={(el) => setFactor(Number(el.target.value))}
        />
      </div>
      <div className="">
      {data ? (
          <Line options={movingAverageOptions} data={data} width={2} height={2} />
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
