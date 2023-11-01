/**
 * Créé un string aléatoire
 *
 * strRandom({
 *  includeUpperCase: true,
 *  includeNumbers: true,
 *  length: 5,
 *  startsWithLowerCase: true
 * });
 *
 * // renvoie par exemple : "iL0v3"
 *
 * @see https://www.equinode.com/blog/article/generer-une-chaine-de-caracteres-aleatoire-avec-javascript
 */
export function strRandom (o) {
  let a = 10
  const b = 'abcdefghijklmnopqrstuvwxyz'
  let c = ''
  let d = 0
  let e = '' + b
  if (o) {
    if (o.startsWithLowerCase) {
      c = b[Math.floor(Math.random() * b.length)]
      d = 1
    }
    if (o.length) {
      a = o.length
    }
    if (o.includeUpperCase) {
      e += b.toUpperCase()
    }
    if (o.includeNumbers) {
      e += '1234567890'
    }
  }
  for (; d < a; d++) {
    c += e[Math.floor(Math.random() * e.length)]
  }
  return c
}
