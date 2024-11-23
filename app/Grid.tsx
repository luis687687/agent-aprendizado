import {useState, useEffect, useRef} from "react"
import checkGame from "./_helpers/checkGame"
import pinteWinnerBoxById from "./_helpers/pinteWinnerBox"
import getCoords from "./_helpers/getCoords"
import { author, coordenates } from "./_utils/constants"
import { GroupState } from "@prisma/client"
import useGame from "./useGame"
import {  GroupWithBid } from "./_controllers/groupController"
import { possibilities, randomShot } from "./_ia-brain/randomShot"
import { removeByValue} from "./_helpers/removeFromArray"
import filterGroupFromIndexAndPosition from "./_helpers/filterGroupFromIndexAndPosition"
import inteligentShot from "@/app/_ia-brain/inteligentShot"
import {BidHistory, BotChoosedOption} from "@/app/_utils/interfaces"


let available_chuts : number[] = possibilities
let stop : boolean = false

const bidsHistory : BidHistory[] = []
let memorizedGroup : GroupWithBid[] = []

export default function Grid(){
  const [isX, setIsX] = useState(true)
  // const [stop, setStop] = useState(false)
  const [hasWinner, setHasWinner] = useState(false)
  const {getFromMemoryFirstPosition, sendGroupHistory} = useGame()
  const [neoralNetResponsed, setNeoralNetResponsed] = useState(false)


  /**
   * Controla a vez do bot de jogar
   */
  useEffect( () => {
    if(!neoralNetResponsed) return
    if(stop) return
    if(isX) //foi vez do user
    {

      return
    }
    setTimeout( () => {
      let response : BotChoosedOption | undefined = undefined
      
      if(memorizedGroup.length){
        console.log(memorizedGroup, " fazendo escolha inteligente")
        response = inteligentShot({
          groups:memorizedGroup,
          lastBidIndex: bidsHistory.length - 1
        })
        
      }
      
        
      if(!response){
        console.log("Escolha aleatoria")
        response = randomShot(available_chuts)
      }
      else
        console.log("inteligent choice ", response)

      const position = response.choosed.value
      const {x,y} = getCoords(position)
      if(!document) return
      const e = document.getElementById(`${y}${x}`)
      if(!e || stop) return
      
      click({
        element: e, isX, setIsX, position
      })
    }, 1500)
    
  }, [memorizedGroup, neoralNetResponsed])


  /**
   * Pegando os dados na memória, averiguando se o historico de movimentos tem exatamente um movimento
   */
  useEffect( () => {
    console.log(available_chuts , " chuts alloweds")
   console.log(bidsHistory, " histories")
    
    if(bidsHistory.length != 1)
      return
    const bid = bidsHistory[0]
    getFromMemoryFirstPosition(bid.position).then( response => {
      memorizedGroup = response
      setNeoralNetResponsed(true)
      console.log(memorizedGroup, " Vindo da rede neoral")

    })
    
  }, [isX])

  useEffect( () => { //verifica sempre se o jogo deve terminar, 
    const {line, col, main, second} = checkGame(coordenates) //se tem uma fila vencedera
    const winner = line >= 0 || col >= 0 || main || second
    console.log({line, col, main, second}, " ww")
    setHasWinner(winner)
    
    //verificar se ja ta tudo cheio
    let full = true
    coordenates.map( e => e.map( e => e === undefined ? full = false : null ))
    
    if((full && coordenates.length) || winner )
      stop = true
    
    //necessário o timeout porque, espera que as funções de estado sejam actualizadas, reactualizando o component, so assim, adiciona nova class css
    setTimeout( () => pinteWinnerBoxById({line, col, main, second}), 200 )

  }, [isX])


  //Sempre que o jogo parar....
  useEffect( () => {
    if(!stop) return
    const wasX = !isX
    const lastuser = author[wasX ? "x" : "o"].toLowerCase()

    //if(memorizedGroup.length) //se te

    const groupState : GroupState = hasWinner ? lastuser.indexOf("ia") != -1 ? 
    GroupState.win : GroupState.lose : GroupState.equal

    // if(groupState == GroupState.lose && memorizedGroup.length){ // Se perdeu, enviar o elemento que ele seguiu e perdeu
    //   // pois, se perdeu agora com um elemento memorizado, esse elemento deve ser retirado
    //   deleteGroups(memorizedGroup)
    //   groupState = GroupState.recognizement
    // }

    const group = { //se o jogo acabar vamos registar tudo
      groupState,
      bidsHistory,

    }
    
    sendGroupHistory(group).then( () => {   
      console.log("Registado")
    })

  }, [stop])


  return(
    <div className={`w-full  px-[80px]  flex-[1] flex justify-center items-center max-[600px]:px-[20px]`}>
      <div className={`w-full  grid`} style={{
        aspectRatio: "1/1",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: "8px",

      }}>
      {Array(9).fill(1).map( (e, i) => 
        { 
          
          return <Ceil 
            key = {i} 
            position={i}
            setIsX={setIsX}
            isX={isX}
            inactive = {stop}
           
          />
        }
      )}

      </div>
    </div>
  )
}





interface ICeil {
  setIsX: (prop : boolean) => void,
  position: number,
  isX: boolean, inactive?: boolean,
  
}
const Ceil = (props: ICeil) => {
  const {isX, setIsX} = props
  // const history = [...bidsHistory]
  const ref = useRef(null)
  const position = props.position
  const botTime = !isX && author.o.indexOf("ia") != -1
  let text = ""
  const element = (ref.current as unknown) as HTMLDivElement
  if(element)
    text = element.innerText
  const disabled = text || props.inactive || botTime // !botTime se nao for a vez do user
  const {x, y} = getCoords(position)


  
  return (
    <div 
      ref={ref}
      className={`bg-red-600 rounded-[8px] cursor-pointer
        text-white text-[70px] flex justify-center items-center
          ${disabled || "active:bg-white"}`}
        style={{userSelect: "none"}}
        id={`${y}${x}`}
      
      
      onClick = {(e) => {
        if(disabled)
          return //impede que actualiza depois de ja ter sido clicado
        
        const indexOfClick = bidsHistory.length
        if(indexOfClick > 0)
        { const botIndex = indexOfClick - 1
          console.log(bidsHistory, botIndex)
          const botPosition = bidsHistory[botIndex].position

          memorizedGroup = filterGroupFromIndexAndPosition({
            groups: memorizedGroup,
            datas: [
              {index: indexOfClick, position, author: author.x},
              {index: botIndex, position: botPosition, author: author.o}
            ]
            
          })
          console.log(memorizedGroup, " Filtrado da rede neural" )
        }
        const t = e.target as HTMLElement
        click({
          element: t,
          isX,
          setIsX,
          position
        })
      }}
      //onDoubleClick={click}
    />
  )
}



const click = ( {
  element, isX, setIsX, position,inactive
} : {inactive?:boolean, position:number, element: HTMLElement, isX: boolean, setIsX: (prop : boolean) => void}) => {
  
  if(inactive)
    return
  const info = isX ? "x" : "o"
  const {x, y} = getCoords(position)
  element.innerText = info
  setIsX(!isX) //serve para controlar um user effect e o texto ideial a se colocar nos elementos
  coordenates[y][x] = info
  bidsHistory.push({
    author: author[info],
    position,
  })
  available_chuts = removeByValue(available_chuts, position) // actualiza jogas disponiveis
  //sets(history)
  
}