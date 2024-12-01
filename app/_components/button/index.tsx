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


  return(
    <button className={styles.area} onClick={() => onClick && onClick()}
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