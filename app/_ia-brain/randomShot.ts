import choice from "../_helpers/choice"
import {BotChoosedOption} from "@/app/_utils/interfaces"




export const possibilities = Array(9).fill(1).map( (_, i) => i)
export function randomShot(possibles: Array<number>) : BotChoosedOption{
  const choosed = choice(possibles)
 
  return {
    possibles,
    choosed
  }
}



