import {  GroupWithBid } from "../_controllers/groupController"
import { GroupState} from "@prisma/client"

export function removeByIndex(arr: Array<number>, index: number){
  return arr.filter( (e, i) => i != index)
}

export function removeByValue(arr: Array<number>, value: number){
  return arr.filter( (e) => e != value)
}

export function removeByGroupState(groups: Array<GroupWithBid>, groupState: GroupState){
  return groups.filter( (group) => group.groupState != groupState)
}

