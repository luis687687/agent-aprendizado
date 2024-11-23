import {GroupWithBid} from "@/app/_controllers/groupController"
import {BotChoosedOption} from "@/app/_utils/interfaces"
import {GroupState} from "@prisma/client"
//fazendo filtro da memoria em função da acção do user
export default function inteligentShot({
  groups, lastBidIndex
} : {groups: GroupWithBid[], lastBidIndex:number}) : BotChoosedOption | undefined{

  let bidIndex = lastBidIndex + 1
  const groupIndex = 0 //melhorar depois
  const actualGroup = groups[groupIndex]
  if(!groups.length) throw "Erro, array esta vazio"
  if(bidIndex > actualGroup.bids.length-1) return

  if(isRecognizedGroupAndIsOnFinal(actualGroup, bidIndex)){
    console.log("Vamos ganhar essa !")
    //escolher o último lance do usuário...
    bidIndex++
  }

  return {
    
    choosed: {
      value: groups[groupIndex].bids[bidIndex].position,
      index: bidIndex
    }
  }

}


const isRecognizedGroupAndIsOnFinal = (actualGroup: GroupWithBid, bidIndex: number) => {
  
  if(!actualGroup.bids.length) return false
  console.log("Tem tamanho ", actualGroup)
  return actualGroup.groupState == GroupState.lose && bidIndex + 1 == actualGroup.bids.length - 1
}