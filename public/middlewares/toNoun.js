export function toNoun(input) {
  return (input).toLowerCase().charAt(0).toUpperCase() +
    (input).toLowerCase().slice(1)
}
