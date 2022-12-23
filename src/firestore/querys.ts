import {
  collection,
  DocumentReference,
  query,
  where,
  doc,
  CollectionReference,
} from 'firebase/firestore'

import { db, auth } from '../contexts/Auth/firebaseContext'

const daysCollection = (sheetName: string): CollectionReference => {
  const uid = auth.currentUser?.uid
  return collection(db, `users/${uid}/stations/${sheetName}/days`)
}
// Recebe o nome da planilha e uma lista de pollens a ser pesquisado (somente retorna os documentos que contém esses pollens.)
const queryByPollenName = (sheetName: string, pollensList: string[]) => {
  const col = daysCollection(sheetName)
  const q = query(col, where('available', 'array-contains-any', pollensList))
  return q
}
