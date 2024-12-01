import {IChoosedObject} from "@/app/_utils/interfaces"

export default function choice( arr: Array<number>):IChoosedObject {
  const maxNumber = arr.length
  const randomIndex = getRadomIndex(maxNumber)
  
  return {
    value : arr[randomIndex],
    index: randomIndex
  }
}

export const getRadomIndex = (array_length : number) => {
  return parseInt(Math.random()*(array_length)+"")
}