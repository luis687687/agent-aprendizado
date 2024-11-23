export default function pinteWinnerBoxById({
  line, col, main, second
} : {
  line:number, col:number, main:boolean, second:boolean
}){
  if(line >= 0){
    
    for(let i = 0; i < 3 ; i++){
      const el = document.getElementById(`${line}${i}`)
      if(!el) return
      el?.classList.add("winner-box")
    
    }
  }
  if(col >= 0){
    
    for(let i = 0; i < 3 ; i++)
      document.getElementById(`${i}${col}`)?.classList.add("winner-box")
  }
  if(main)
    for(let i = 0; i < 3 ; i++)
      document.getElementById(`${i}${i}`)?.classList.add("winner-box")
  if(second)
    for(let i = 0; i < 3 ; i++)
      document.getElementById(`${i}${2 - i}`)?.classList.add("winner-box")
  
}