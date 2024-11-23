import { GroupState } from "@prisma/client"


export interface BidHistory {
  position: number,
  author: string
}

export interface GroupHistory {
  groupState: GroupState,
  bidsHistory: BidHistory[]
}

export interface BotChoosedOption {
  possibles?: Array<number>,
  choosed: IChoosedObject
}

export interface IChoosedObject {
  value : number 
  index: number
}