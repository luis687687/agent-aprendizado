import { GroupState } from "@prisma/client"
import { GroupWithBid } from "../_controllers/groupController"
import { author } from "../_utils/constants"
import {removeByIndex} from "./removeFromArray"
import {getRadomIndex} from "./choice"
/***
 * Essa função retorna um grupo de bids, cujo o lance da bidIndex tem como jogada bidPosition
 */
interface IFilterData {index:number, position: number, author: string}
export default function filterGroupFromIndexAndPosition({
  groups, datas
} : {groups: GroupWithBid[], datas: Array<IFilterData>}){

  let bot : IFilterData
  let user: IFilterData
  datas.forEach((e)=>{
    if(e.author == author.x)
      user = e
    else
      bot = e
  })
 
  const filteredGroup = groups.filter( (e) => {
    if(user.index >= e.bids.length || (bot && bot.index >= e.bids.length)) // se o user ou o bot chutou um index maior que o tamanho do historico no grupo
      return false

  const ucond = e.bids[user.index].position == user.position 
  const botcond = bot && (e.bids[bot.index].position == bot.position)
  //  console.log( {user, bot, ucond, botcond} , e)
  if(!e.bids.length) return false
   if(bot)
      return ucond && botcond
    return ucond
  })
  return ordenateGroupFromWinToEquals(filteredGroup)
}

const ordenateGroupFromWinToEquals = (groups: GroupWithBid[]) => {

  //randomizeArray vai dar uma perspectiva mais alternada nas victorias aprendidas pelo bot
  const wins = randomizeArray(groups.filter( (e) => e.groupState == GroupState.win)) //objectivo primario
  const recognizements = groups.filter( e => e.groupState == GroupState.recognizement) //objectivo de aprendizado
  const loses = groups.filter( e => e.groupState == GroupState.lose) // objectivo de elevação
  const equals = groups.filter( e => e.groupState == GroupState.equal) //objectivo menos importante

  return [
    ...wins, ...recognizements, ...loses, ...equals
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const randomizeArray = (arr: Array<any>) => {
  let array_index = arr.map( (e, i) => i)
  const new_array  = []
  while(array_index.length){
    const choosedIndex = getRadomIndex(array_index.length)
    console.log(array_index.length , " Chooosed ", choosedIndex)
    const choosedArrayIndexValue = array_index[choosedIndex]
    array_index = removeByIndex(array_index, choosedIndex) //reduz...

    new_array.push(arr[choosedArrayIndexValue])
  }
  return new_array
}

