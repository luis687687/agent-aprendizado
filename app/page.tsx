"use client"
import Button from "./_components/button";
import Grid from "./Grid";
import styles from "./styles.module.css"

export default function Home() {
  return (
    <div className="flex justify-center items-center w-full h-full flex-col">
     <div className={"h-full w-full max-w-[560px]  max-[900px]:max-w-full bg-black flex justify-center items-center"}>
      <div className={"internal flex-[1] flex flex-col w-full h-full"}>
          <div className={"flex flex-row justify-center pt-[20px] px-[20px] gap-[20px] "+styles.button_area}>
            <Button text={"Treinamento"}/>
            <Button text={"Competição"}/>
          </div>
          
          <Grid/>
      </div>
     </div>
    </div>
  );
}
//https://www.facebook.com/reel/1564979567717920
//https://www.facebook.com/reel/1249727629773372