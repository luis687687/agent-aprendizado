import styles from "./styles.module.css"

export default function Button(
  {
    text, onClick, active
  } : {
    text: string,
    onClick?: () => void,
    active?: boolean
  }
){

  const click = () => {
    if(onClick) onClick()
    const sounder = document.createElement("audio") as HTMLAudioElement
    sounder.src = "./_assets/sound/tap.wav"
    sounder.play()
  }

  return(
    <button className={styles.area} onClick={() => click()}
      style = {
        active ? {
          color: "white",
          backgroundColor: "var(--blue)"
        } : {}
      }
    >
      {text}
    </button>
  )
}