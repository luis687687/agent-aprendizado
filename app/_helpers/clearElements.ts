export default function clearElements(){

  const btns = document.querySelectorAll(".btn-class") as NodeList
  ([...btns] as HTMLElement[]).forEach((btn : HTMLElement) => {
    btn.innerText = ""
  })
}