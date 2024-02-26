export interface DayDocument {
  available: string[]
  date: string
}

export interface Pollen {
  name: string
  _0h: number
  _1h: number
  _2h: number
  _3h: number
  _4h: number
  _5h: number
  _6h: number
  _7h: number
  _8h: number
  _9h: number
  _10h: number
  _11h: number
  _12h: number
  _13h: number
  _14h: number
  _15h: number
  _16h: number
  _17h: number
  _18h: number
  _19h: number
  _20h: number
  _21h: number
  _22h: number
  _23h: number
}

export interface PollenCsvInput {
  date: string
  name: string
  interval: number
  amount: number
}
