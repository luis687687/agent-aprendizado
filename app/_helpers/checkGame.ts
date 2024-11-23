export default function checkGame(coordenates: Array<Array<string| undefined>>) {
  const line = checkLine(coordenates)
  const col = checkCol(coordenates)
  const main = checkMain(coordenates)
  const second = checkSecondary(coordenates)
  return {
    line, col, main, second
  }
  
}


const checkLine = function(coordenates: Array<Array<string| undefined>>) {

  for(let line = 0; line < coordenates.length ; line ++){
    const element = coordenates[line]
    let temp : string | number | undefined = ""
    let find = true
    for(let col = 0; col < element.length; col++ ){
      if(temp === "")
        temp = element[col]
      
      if ( temp != element[col] || !coordenates[line][col]){
        find = false
        break
      } 
    }
    if(find){
      return line
    }
  }

  return -1
}




const checkCol = function(coordenates: Array<Array<string| undefined>>) {
  for(let col = 0; col < coordenates.length ; col ++){
    let find = true
    let val : number | string | undefined = ""
   for(let line = 0 ; line < coordenates.length ; line++){
    if( val === "")
      val = coordenates[line][col]
    if(val != coordenates[line][col] || !coordenates[line][col]){
      find=false
      break
    }
   }
   if(find)
    return col
  }

  return -1
}


const checkMain = (coordenates: Array<Array<string| undefined>>) => {
  let val : string | number | undefined = ""
  let find = true
  for(let line = 0; line < coordenates.length; line++){
    if(val == "")
      val = coordenates[line][line]
    if(val != coordenates[line][line] || !coordenates[line][line]){
      find = false
    }
  }
  if(find)
    return true
  return false
}


const checkSecondary = (coordenates: Array<Array<string| undefined>>) => {
  let val : string | number | undefined = ""
  let find = true
  const size = coordenates.length
  for(let line = 0; line < size; line++){
    if(val == "")
      val = coordenates[line][size - 1 - line]
    if(val != coordenates[line][size - 1 - line] || !coordenates[line][size - 1 - line]){
      find = false
    }
  }
  if(find)
    return true
  return false
}
