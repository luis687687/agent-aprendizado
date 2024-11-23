import { Bids } from "@prisma/client"
import prisma from "../_utils/prisma-client"


interface ISetBid {
  data: Bids[]
}
export async function setBids( {data} : ISetBid){
  const bid = [...data].map( e => {
    const {author, groupId, position} = e
    const intermediary = {author, groupId, position}
    return intermediary
  })

  
  const response = await prisma.bids.createMany({
    data : bid
  })
  return response
}