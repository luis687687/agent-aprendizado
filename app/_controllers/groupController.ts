"use server"
import prisma from "../_utils/prisma-client";
import { Group, GroupState, Bids, Utility } from "@prisma/client";

export interface GroupWithBid extends Group {
 bids: Bids[]
}
export async function getGroups() {
  const groups = await prisma.group.findMany({
    include: {bids : true},
    where: {
      utility: Utility.on
    }
  }) as GroupWithBid[]
  return groups
}

export async function createGroup({groupState}: {groupState: GroupState}){
  const response = await prisma.group.create({
    data : {
      groupState
    }
  })
  return response
}

export async function getGroup({groupId, group} : {groupId?: number, group?: Group}) {
  let id: number
  if(group)
    id = group.id
  else if(groupId !== undefined)
    id = groupId
  else
    throw Error
  
  const response = await prisma.group.findUnique({
    where: {
      id
    },
    include: {
      bids: true
    }
  })
  return response
}

export async function forgetGroups(
  groups: GroupWithBid[] | Group[]
){
  console.log("Grupos para apagar ", groups)
  groups.forEach( async group => {
    const {id} = group
    console.log("Deleting... ", group)
    await prisma.group.update({
      where: {id}, data: {
        utility: Utility.off
      }
    })

    console.log("successfull!!! ")

    
  })
}