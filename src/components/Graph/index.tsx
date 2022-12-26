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
import React, { EventHandler, FormEventHandler, useContext, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import { fetchPollens, getMovingAverageGraph, movingAverageOptions, IDataFetch } from "./graph"
import { pollensList } from '../../data/arrays'
import { FirebaseContext } from '../../contexts/Auth/firebaseContext'
import { Add } from '@mui/icons-material'
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
  const [dataFetch, setDataFetch] = useState<IDataFetch[]>()
  const [data, setData] = useState<ChartData<"line">>()
  const [error, setError] = useState<string>()
  const [initialDate, setInitialDate] = useState<Date>()
  const [pollenNames, setPollenNames] = useState<string[]>()
  const [pollenName, setPollenName] = useState<string>("Acer")
  const { db } = useContext(FirebaseContext)
  const AcerQuery = query(collectionGroup(db, 'days'))
  const [pollens] = useCollectionDataOnce(AcerQuery)
  const handleAddPollen :FormEventHandler= (e) => {
    e.preventDefault()
    const names: string[] | undefined = []
    if (pollenNames) {
      names.push(...pollenNames)
      if (names.find(pollen => pollen == pollenName)) {
        return
      }
    }
    if (!pollenName) return
    names.push(pollenName)
    setPollenNames(names)
  }
  useEffect(() => {
    if (pollens)
      setDataFetch(fetchPollens(pollens))
  }, [pollens])
  useEffect(() => {
    if (!dataFetch) return
    setError(undefined)
    if (!initialDate || initialDate.getTime() > Date.now()) {
      setError("The initial date cannot be greater than current date!")
      return
    }
    if (!pollenNames) return
    const data = getMovingAverageGraph({ factor, initialDate, pollenNames, pollens: dataFetch })
    setData(data)
  }, [factor, pollenNames, initialDate])
  return (
    <div className="flex flex-col justify-center">
      <div className="px-8 flex justify-around items-center">
        <div className="">
          <form onSubmit={handleAddPollen} className="flex flex-col justify-around">
            <label htmlFor="pollenName" className="text-lg text-center font-semibold">Add Pollen</label>
            <div className="flex justify-around items-center mt-4">
              <select id="pollenName" className="text-lg text-center py-3 " name="pollen" required value={pollenName} onChange={(e) => {
                const selectedPollen = e.target.value
                setPollenName(selectedPollen)
              }}>
                {pollensList.map((pollen) => {
                  return (
                    <option key={pollen} value={pollen}>{pollen} </option>
                  )
                }
                )}
              </select>
              <button title="add pollen" type={"submit"} name="add-pollen" className="mx-4 rounded-full bg-salamanca-blue-600 text-white w-12 h-12 border-none active:opacity-90"><Add /></button>
            </div>
          </form>
        </div>
        <div className="flex flex-col justify-around items-center">
          <label htmlFor='initialDate' className="mb-4 font-semibold text-lg">Select initial Date</label>
          <input className="py-1.5 text-lg text-center" type={"date"} defaultValue={"2022-12-22"} onChange={(el) => {
            const date = el.target.value + "T00:00"
            setInitialDate(new Date(date));
          }} id="initialDate" />
        </div>
        <div className="flex flex-col justify-around items-center">
          <label htmlFor='factor' className="text-lg font-bold text-black text-center mb-4">Factor : {factor}</label>
          <input
            id="factor"
            type="range"
            min={0}
            title="factor"
            max={1}
            step={0.1}
            value={factor}
            className="factor my-5"
            onChange={(el) => setFactor(Number(el.target.value))}
          />
        </div>
      </div>
      <div className="max-h-[90vh] w-full py-8 flex justify-center">
        {data && !error ? (
          <Line options={movingAverageOptions} data={data} width={2} height={2} />
        ) :
          error
            ? (
              <div className="py-4 border border-black">
                <p className="text-red-500 text-lg text-center"> Error!!! {error}</p>
              </div>
            )
            : (
              <div>
                <p>No data</p>
              </div>
            )}
      </div>
    </div>
  )
}

export default Graph
