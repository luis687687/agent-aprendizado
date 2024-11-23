import {IChoosedObject} from "@/app/_utils/interfaces"

export default function choice( arr: Array<number>):IChoosedObject {
  const maxNumber = arr.length
  const randomIndex = parseInt(Math.random()*(maxNumber)+"")
  
  return {
    value : arr[randomIndex],
    index: randomIndex
  }
}