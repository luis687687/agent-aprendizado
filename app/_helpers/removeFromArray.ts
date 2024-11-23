export function removeByIndex(arr: Array<number>, index: number){
  return arr.filter( (e, i) => i != index)
}

export function removeByValue(arr: Array<number>, value: number){
  return arr.filter( (e) => e != value)
}

