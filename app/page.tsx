"use client"
import Button from "./_components/button";
import Grid from "./Grid";
import styles from "./styles.module.css"
import {GameObjective} from "./_utils/interfaces"
import {useEffect, useState} from "react"
import light from "../public/light/light_bulb_01.png"
import Image from "next/image"

export default function Home() {
  const [gameObjective, setGameObjective] = useState<GameObjective>(GameObjective.competitive);
  useEffect(() => {
    const sounder = document.createElement("audio") as HTMLAudioElement
    sounder.src = "./_assets/sound/back.wav"
    sounder.volume = 0.05
    sounder.loop = true
    sounder.addEventListener("canplaythrough", () => {
      sounder.play().catch( () => {
        console.log("Erro ao player")
        window.addEventListener("click", ()=> {
          sounder.play()
        }, {once: true})
      })
    })
  }, [])
  return (
    <div className="flex justify-center items-center w-full h-full flex-col">
     <div className={"h-full w-full max-w-[560px]  max-[900px]:max-w-full bg-[rgba(3,10, 300, 0.5)] flex justify-center items-center max-[900px]:max-w-[460px] px-[50px] pb-[20px] max-[600px]:px-[20px] "+styles.back}
      id={'area_back'}
      style={{
        backgroundImage: "url(backgroundColorFall.png)",
        
        backgroundSize: "cover"
        
       
      }}
     >
      <div className={"internal flex-[1] flex flex-col w-full h-full z-50px"}>
          <div className={"flex flex-row justify-center pt-[20px] px-[20px] gap-[20px] "+styles.button_area}>
            <Button text={"Treinamento"} onClick={() => setGameObjective(GameObjective.trainment)} active = {GameObjective.trainment == gameObjective}/>
            <Button text={"Competição"} onClick={() => setGameObjective(GameObjective.competitive)} active = {GameObjective.competitive == gameObjective}/>
          </div>
          <div className={'w-full flex-[1] flex justify-center items-center flex-col relative'}>
              <Image src={light} alt="" className={styles.lamp}/>
            <Grid gameObjective={gameObjective}/>
          </div>
      </div>
     </div>
    </div>
  );
}
//https://www.facebook.com/reel/1564979567717920
//https://www.facebook.com/reel/1249727629773372