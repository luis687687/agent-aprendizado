"use server"
import { Bids } from "@prisma/client";
import { createGroup, getGroups, GroupWithBid } from "../_controllers/groupController";
import { setBids } from "../_controllers/bidController";
import { GroupHistory } from "../_utils/interfaces";
import filterGroupFromIndexAndPosition from "../_helpers/filterGroupFromIndexAndPosition";
import { author } from "../_utils/constants"

export async function addBidsOnNewGroup({groupState, bidsHistory} : GroupHistory) {
  const group = await createGroup({groupState})
  const {id : groupId} = group
  const data : Bids[] = bidsHistory.map(
    (e, i) => {
      const {author, position} = e
      return {
        id: i, //não será usado, pois o metodo setBid, gera chave automaticamente
        author,
        groupId,
        position
      }
    }
  )
  const response = await setBids({data})
  return response
}

/**
 * 
 * @param bidPosition 
 * @returns GroupWithBid[]
 */
export async function getBidGroupFromFirstBidIndex(bidPosition: number) {
  const groups = await getGroups()
  const filteredGroup = filterGroupFromIndexAndPosition({
    datas: [
      {index:0, position: bidPosition, author: author.x}
    ],
    groups
  }) as GroupWithBid[]
  
  return filteredGroup
}