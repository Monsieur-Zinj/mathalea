import { resolutionSystemeLineaire3x3 } from '../mathFonctions/outilsMaths.js'
import { randint } from '../outils.js'

/**
 * Fonction qui cherche une fonction polynomiale de degré 3 dont les coefficients a, b et c de f(x)=ax^3 + bx² + cx + d
 * sont des fractions dont le dénominateur est inférieur à 10 et pour laquelle l'image de 3 entiers compris entre -10 et 10
 * sont des entiers compris eux aussi entre -10 et 10
 * @author Jean-Claude Lhote
 */
export function criblePolynomeEntier () {
  let trouve = false
  let coefs = [[]]
  for (let i = 0, x1, x2, x3, fx1, fx2, fx3, d; ; i++) {
    x1 = randint(-10, 10)
    x2 = randint(-10, 10, [x1])
    x3 = randint(-10, 10, [x1, x2])
    fx1 = randint(-10, 10)
    fx2 = randint(-10, 10)
    fx3 = randint(-10, 10)
    d = randint(0, 10)
    coefs = resolutionSystemeLineaire3x3(x1, x2, x3, fx1, fx2, fx3, d)
    if (coefs[0][1] !== 0 && coefs[0][1] < 10 && coefs[1][1] < 10 && coefs[2][1] < 10) trouve = true
    if (trouve) {
      coefs.push([x1, fx1])
      coefs.push([x2, fx2])
      coefs.push([x3, fx3])
      coefs.push(d)
      break
    }
  }
  if (trouve) return coefs
}
