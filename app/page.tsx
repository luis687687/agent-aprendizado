"use client"
import Button from "./_components/button";
import Grid from "./Grid";
import styles from "./styles.module.css"
import {GameObjective} from "./_utils/interfaces"
import {useState} from "react"

export default function Home() {
  const [gameObjective, setGameObjective] = useState<GameObjective>(GameObjective.competitive);

  return (
    <div className="flex justify-center items-center w-full h-full flex-col">
     <div className={"h-full w-full max-w-[560px]  max-[900px]:max-w-full bg-[rgba(3,10, 300, 0.5)] flex justify-center items-center"}>
      <div className={"internal flex-[1] flex flex-col w-full h-full"}>
          <div className={"flex flex-row justify-center pt-[20px] px-[20px] gap-[20px] "+styles.button_area}>
            <Button text={"Treinamento"} onClick={() => setGameObjective(GameObjective.trainment)} active = {GameObjective.trainment == gameObjective}/>
            <Button text={"Competição"} onClick={() => setGameObjective(GameObjective.competitive)} active = {GameObjective.competitive == gameObjective}/>
          </div>
          
          <Grid gameObjective={gameObjective}/>
      </div>
     </div>
    </div>
  );
}
//https://www.facebook.com/reel/1564979567717920
//https://www.facebook.com/reel/1249727629773372