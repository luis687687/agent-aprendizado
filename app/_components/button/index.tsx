import styles from "./styles.module.css"

export default function Button(
  {
    text
  } : {
    text: string
  }
){


  return(
    <button className={styles.area}>
      {text}
    </button>
  )
}