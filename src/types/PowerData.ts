export interface PowerData {
    voltage: { a: number; b: number; c: number }
    current: { a: number; b: number; c: number }
    power: {
      kw: { a: number; b: number; c: number; total: number; history: number[] }
      kva: { a: number; b: number; c: number; total: number; history: number[] }
      kvar: { a: number; b: number; c: number; total: number; history: number[] }
    }
    energy: {
      total: number
      hourly: number[]
      daily: number[]
    }
  }
  