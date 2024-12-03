"use client"
import {useState, useEffect, useRef} from "react"
import checkGame from "./_helpers/checkGame"
import pinteWinnerBoxById from "./_helpers/pinteWinnerBox"
import getCoords from "./_helpers/getCoords"
import { author, coordenates } from "./_utils/constants"
import { GroupState } from "@prisma/client"
import useGame from "./useGame"
import {  forgetGroups, GroupWithBid } from "./_controllers/groupController"
import { possibilities, randomShot } from "./_ia-brain/randomShot"
import { removeByValue, removeByGroupState} from "./_helpers/removeFromArray"
import filterGroupFromIndexAndPosition from "./_helpers/filterGroupFromIndexAndPosition"
import inteligentShot from "@/app/_ia-brain/inteligentShot"
import {BidHistory, BotChoosedOption} from "@/app/_utils/interfaces"
import {GameObjective} from "./_utils/interfaces"
import styles from "./styles.module.css"
import clearElements from "./_helpers/clearElements"
import Image from "next/image"
import tabImage from "../public/tab.png"


let available_chuts : number[] = possibilities.map( e => e)
let local_coordenates_choosed = coordenates.map(e => [...e])

let bidsHistory : BidHistory[] = []
let memorizedGroup : GroupWithBid[] = []
let firstBotTime = true // para ver se, o user jogou no meio, se for a primeira vez do bot de jogar, então o bot deve escolher jogar em uma vertice, para aumentar a chance de ganho
export default function Grid({
  gameObjective
} : {
  gameObjective: GameObjective
}){
  const [isX, setIsX] = useState(true)
  // const [stop, setStop] = useState(false)
  const [hasWinner, setHasWinner] = useState(false)
  const {getFromMemoryFirstPosition, sendGroupHistory} = useGame()
  const [neoralNetResponsed, setNeoralNetResponsed] = useState(false)
  const [groupToForget, setGroupToForget] = useState<GroupWithBid>()
  const [stop, setStop] = useState<boolean>(false)
  const [gameStart, setGameStart] = useState(true)

  // importante, porque o bot tem sido muito dinamico em responder, 
  //que até quando o jogo termina ele tenta responder, 
  //pois a actualização da variável de estado stop é muito lenta
  let firstlyReshedStopIndicator = false 
  const restartLocal = () => {
    setStop(false)
    setGroupToForget(undefined)
    setNeoralNetResponsed(false)
    setHasWinner(false)
    setIsX(true)
    restartGlobals()
  }
  /**
   * State para controlar a possibilidade de limpar o jogo
   */
  useEffect( () => {
    if(gameStart){ //não avança caso jogo tiver começado
      setGameStart(false)
      return
    }
    restartLocal()
  }, [gameObjective])



  /**
   * Controla a vez do bot de jogar
   */
  
  useEffect( () => {
    if(!neoralNetResponsed) return
    if(stop) return
    if(isX) //foi vez do user
      return

    
    const possible_vertices_if_firstbot_time = [0,2,6,8] //vertices para fazer bypass, caso a primeira jogada nao aprendida, do user, for no centro
    setTimeout( () => {
      let response : BotChoosedOption | undefined = undefined
      if(memorizedGroup.length){
        firstBotTime = false
        console.log(memorizedGroup, " fazendo escolha inteligente")
        response = inteligentShot({
          groups:memorizedGroup,
          lastBidIndex: bidsHistory.length - 1
        })
        console.log(response,  " Eu encontrei o que ")
        
        if(response)
          if(response.groupToForget){ //se tem algum grupo ja contraposto
            setGroupToForget(response.groupToForget)
            console.log("Vamos já esquecer isso... ", response.groupToForget)
          }
      }
      if(!response){ //se nao tem nada anteriormente respondido na tentativa de jogada inteligente
        console.log("Escolha aleatoria")
        const center = 4
        console.log(bidsHistory, " iiiiiiiiiiiiiiiiiii ")
        const chooseVertice = firstBotTime && bidsHistory[0].position == center
        if(firstBotTime ){
          console.log("Primeira vez do bot, vou escolher uma vertice se o user chutou no meio")
          firstBotTime = false
        }
        response = randomShot(chooseVertice ? possible_vertices_if_firstbot_time : available_chuts)
      }
      else
        console.log("inteligent choice ", response)

      const position = response.choosed.value
      const {x,y} = getCoords(position)
      if(!document) return
      const id = `${y}${x}`
      const e = document.getElementById(id)
      
      if(!e || firstlyReshedStopIndicator) {
        console.log(e,` O bot tentou, mas o jogo terminou ou o elemento id ${id} não existe `, stop)
        return
      }
      
      click({
        element: e, isX, setIsX, position
      })
      
    }, 1000)
    
  }, [memorizedGroup, neoralNetResponsed])

  useEffect( () => {
    console.log("Memorized !@#@!#@#!$23")
  }, [memorizedGroup])


  /**
   * Pegando os dados na memória, averiguando se o historico de movimentos tem exatamente um movimento
   */
  useEffect( () => { //Necessári só para primeiro lance
    console.log(available_chuts , " chuts alloweds")
   console.log(bidsHistory, " histories")
    
    if(bidsHistory.length != 1)
      return
    const bid = bidsHistory[0]
    getFromMemoryFirstPosition(bid.position).then( response => {
      let groups = response
      if(gameObjective == GameObjective.trainment){ //se for treinamento, remove os grupos win e equal, para ajudar a criar novas possibilidades de ganhar
        groups = removeByGroupState(groups, GroupState.win)
        groups = removeByGroupState(groups, GroupState.equal)
      }
      memorizedGroup = groups
      setNeoralNetResponsed(true)
      console.log(memorizedGroup, " Vindo da rede neoral")

    })
    
  }, [isX])

  useEffect( () => { //verifica sempre se o jogo deve terminar, 
    const {line, col, main, second} = checkGame(local_coordenates_choosed) //se tem uma fila vencedera
    const winner = line >= 0 || col >= 0 || main || second
    console.log({line, col, main, second}, " ww")
    setHasWinner(winner)
    
    //verificar se ja ta tudo cheio
    let full = true
    local_coordenates_choosed.map( e => e.map( e => e === undefined ? full = false : null ))
    
    if((full && local_coordenates_choosed.length) || winner ){
      setStop(true)
      firstlyReshedStopIndicator = true
      console.log("Jogo parou ... ")
    }
    //necessário o timeout porque, espera que as funções de estado sejam actualizadas, reactualizando o component, so assim, adiciona nova class css
    setTimeout( () => pinteWinnerBoxById({line, col, main, second}), 200 )

  }, [isX])


  //Sempre que o jogo parar....
  useEffect( () => {
    if(!stop){
      console.log("O jogo ainda não parou !")
      return
    }
    const wasX = !isX
    const lastuser = author[wasX ? "x" : "o"].toLowerCase()

    //if(memorizedGroup.length) //se te

    let groupState : GroupState = hasWinner ? lastuser.indexOf("ia") != -1 ? 
    GroupState.win : GroupState.lose : GroupState.equal

    // if(groupState == GroupState.lose && memorizedGroup.length){ // Se perdeu, enviar o elemento que ele seguiu e perdeu
    //   // pois, se perdeu agora com um elemento memorizado, esse elemento deve ser retirado
    //   deleteGroups(memorizedGroup)
    //   groupState = GroupState.recognizement
    // }
   
    if(groupState == GroupState.equal)
      return
    groupState = groupStateToRecognizementGroup({groupState, groupToForget})
    forgetBrokeGroup({groupState, groupToForget})

    const group = { //se o jogo acabar vamos registar tudo
      groupState,
      bidsHistory,
    }
    console.log({bidsHistory})
    sendGroupHistory(group).then( () => {   
      console.log(" Registado")
    })

  }, [stop])

  const forgetBrokeGroup = ({groupState, groupToForget} : {
    groupState: GroupState, groupToForget: GroupWithBid | undefined
  }) => {
    console.log(groupToForget, " Grupo para esquecer !!!!!! .... ")
    const canForget = (groupState == GroupState.win || groupState == GroupState.equal || groupState == GroupState.recognizement) //pode apagar se ele não perdeu de novo
    if(canForget || groupToForget?.groupState == GroupState.recognizement) // mas, independementemete de ter perdido de novo, se o neoronio a esquecer for de recognizement, pode esquecer
      if(groupToForget){ 
        forgetGroups([groupToForget]).then(
          e => {
            console.log(e, " Esquecido")
          }
        )
      }
      else{
        console.log("Não tem nenhum grupo superado para esquecer!")
      }
  }
  const groupStateToRecognizementGroup = ({
    groupState, groupToForget
  } : {
    groupState: GroupState,
    groupToForget: GroupWithBid | undefined
  }) => {
    const isAnInfinityLose = () => {
      return groupToForget?.bids.length == bidsHistory.length
    }
    const removeToLastBidsFromBidsHistory = () => {
      const bidsHistorySize = bidsHistory.length
      bidsHistory = bidsHistory.filter((bids, index) => index < bidsHistorySize - 2)
    }
    if(groupState == GroupState.lose && groupToForget)
    {
      if(groupToForget.groupState != GroupState.recognizement)
        if(isAnInfinityLose()){
          console.log({forge: groupToForget, bidsHistory}, "Luis")
          console.log("Last" , bidsHistory)
          removeToLastBidsFromBidsHistory()
          groupState = GroupState.recognizement
          console.log("Now ", bidsHistory)
        }
      
    }

  
    return groupState
  }


  return(
    <div className={`w-full  px-[80px]  flex justify-center items-center max-[600px]:px-[20px] relative`}>
      
      <div className={`w-[80%]  grid max-[600px]:w-[60%] max-[900px]:w-[40%] z-10`} style={{
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
      <Image src={tabImage} alt="background" className={styles.tabimage+ `
          max-[900px]:w-[60%!important]
          max-[600px]:w-[100%!important]
        `}/>
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


  const [rotate, setRotate] = useState(0)
  useEffect( () => setRotate(Math.ceil(-5 + Math.random()*10 )), [])
  return (
    <div 
      ref={ref}
      className={`${styles.ceil} rounded-[8px] cursor-pointer
        text-white text-[70px] flex justify-center items-center
          ${disabled || "active:bg-white"} btn-class`}
        style={{userSelect: "none", 
          transform: `rotate(${rotate}deg)`
        }}
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
          console.log(memorizedGroup, " Filtrado da rede neural pelo user" )
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
  const soundelement = document.createElement("audio") as HTMLAudioElement
  console.log(soundelement)
  soundelement.src = ("./_assets/sound/button.wav")
  soundelement.play()

  const info = isX ? "x" : "o"
  const {x, y} = getCoords(position)
  element.innerText = info
  setIsX(!isX) //serve para controlar um user effect e o texto ideial a se colocar nos elementos
  local_coordenates_choosed[y][x] = info
  bidsHistory.push({
    author: author[info],
    position,
  })
  console.log({available_chuts, position}, 1000)
  available_chuts = removeByValue(available_chuts, position) // actualiza jogas disponiveis
  //sets(history)
  console.log({available_chuts, position}, 20000)
}


const restartGlobals = () => {
  clearElements()
  available_chuts = possibilities.map(e => e)
  bidsHistory = []
  memorizedGroup = []
  local_coordenates_choosed = coordenates.map( e => [...e])
  firstBotTime = true
}