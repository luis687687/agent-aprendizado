import { GroupState } from "@prisma/client"
import {  GroupWithBid } from "../_controllers/groupController"

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
  choosed: IChoosedObject,
  groupToForget?: GroupWithBid
}

export interface IChoosedObject {
  value : number 
  index: number
}


export enum GameObjective {
  trainment,
  competitive
}