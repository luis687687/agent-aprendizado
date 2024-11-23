

import {getGroups } from "../_controllers/groupController";
import { addBidsOnNewGroup, getBidGroupFromFirstBidIndex } from "../_services/bidServices";
import { GroupHistory } from "../_utils/interfaces";

export default function useGame(){

  const sendGroupHistory = async function(groupHistory : GroupHistory){
    
    const response = await addBidsOnNewGroup(groupHistory)
    console.log(response)
    return response
  }

  const getAll = async () => {
    const response = await getGroups()
    console.log(response)
    return response
  }

  const getFromMemoryFirstPosition = async (bidPosition: number) => {
    const response = await getBidGroupFromFirstBidIndex(bidPosition)
    return response

  }

  return {
    sendGroupHistory, getAll, getFromMemoryFirstPosition
  }
}