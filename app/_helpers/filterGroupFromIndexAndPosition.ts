import { GroupState } from "@prisma/client"
import { GroupWithBid } from "../_controllers/groupController"
import { author } from "../_utils/constants"

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
   console.log( {user, bot, ucond, botcond} , e)
  if(!e.bids.length) return false
   if(bot)
      return ucond && botcond
    return ucond
  })
  return ordenateGroupFromWinToEquals(filteredGroup)
}

const ordenateGroupFromWinToEquals = (groups: GroupWithBid[]) => {

  const wins = groups.filter( (e) => e.groupState == GroupState.win) //objectivo primario
  const recognizements = groups.filter( e => e.groupState == GroupState.recognizement) //objectivo de aprendizado
  const loses = groups.filter( e => e.groupState == GroupState.lose) // objectivo de elevação
  const equals = groups.filter( e => e.groupState == GroupState.equal) //objectivo menos importante

  return [
    ...wins, ...recognizements, ...loses, ...equals
  ]
}

