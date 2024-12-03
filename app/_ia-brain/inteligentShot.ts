import {GroupWithBid} from "@/app/_controllers/groupController"
import {BotChoosedOption} from "@/app/_utils/interfaces"
import {GroupState} from "@prisma/client"

//fazendo filtro da memoria em função da acção do user
export default function inteligentShot({
  groups, lastBidIndex
} : {groups: GroupWithBid[], lastBidIndex:number}) : BotChoosedOption | undefined{

  let bidIndex = lastBidIndex + 1
  let groupToForget : GroupWithBid | undefined = undefined
  const groupIndex = 0 //melhorar depois, por enquanto é escolhido o primeiro, porque na camada do jogo ocorrem muitos filtros, que deixam a celula neoral mais provavel acima!
  let actualGroup = groups[groupIndex]
  if(!groups.length) throw "Erro, array esta vazio"
  let notfoundnonthing = true //se não tenho nenhum lance cujo o ultimo lance feito seja um index valido no tamanho de qualquer um dos neoronios
  groups.forEach( (g) => { //verifica se existe alguma chance de perder na proxima jogada
    if(bidIndex > g.bids.length-1) return
    notfoundnonthing = false
    if(isRecognizedGroupAndIsOnFinal(g, bidIndex)){
      console.log("Vamos contrapor essa jogada, porque pode perder!")
      //escolher o último lance do usuário...
      bidIndex++
      groupToForget = g;
      actualGroup = g
    }})
 
  if(notfoundnonthing) return
  return {
    
    choosed: {
      value: actualGroup.bids[bidIndex].position,
      index: bidIndex,
    },
    groupToForget
  }

}


const isRecognizedGroupAndIsOnFinal = (actualGroup: GroupWithBid, bidIndex: number) => {
  
  if(!actualGroup.bids.length) return false
  return (actualGroup.groupState == GroupState.lose || actualGroup.groupState == GroupState.recognizement)  && bidIndex + 1 == actualGroup.bids.length - 1
}
