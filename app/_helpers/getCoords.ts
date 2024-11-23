export default function getCoords(position: number) {
  const x = position % 3
  const y = position < 3 ? 0 : position < 6 ? 1 : 2

  return {
    x, y
  }
}