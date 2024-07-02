import Exercice from '../Exercice.js'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Trinome from '../../modules/Trinome'
import { Add, ExponentialOperande, Frac, Mul, Pow, Sub } from '../../lib/mathFonctions/Calcul'
import { lettreDepuisChiffre } from '../../lib/outils/outilString'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
export const titre = 'Simplifier des expressions exponentielles'

export const dateDePublication = '2/7/2024'
export const interactifReady = true
export const interactifType = 'mathlive'
export const uuid = 'exp'

/**
 * Description didactique de l'exercice
 * @author Rémi Angot
 * Référence
*/
export default class SimplifierExponentielles extends Exercice {
  constructor () {
    super()
    this.consigne = 'Simplifier les expressions suivantes.'
    this.nbQuestions = 5
    this.spacing = 2
    this.spacingCorr = 3
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    const typeQuestionsDisponibles = ['mul', 'pow', 'k(a+b)', '(e^mx)p - e^nx * e^ox', 'fracPow']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let answer = ''
      switch (listeTypeQuestions[i]) {
        case 'mul': {
          const p1 = new Trinome(0, randint(1, 5), randint(1, 5))
          const p2 = new Trinome(0, randint(1, 5), randint(1, 5))
          const e1 = new ExponentialOperande({ polynome: p1, k: randint(-3, 3, [0]) })
          const e2 = new ExponentialOperande({ polynome: p2, k: randint(-3, 3, [0]) })
          const calcul = new Mul(e1, e2)
          texte = `$${lettreDepuisChiffre(i + 1)} = ${calcul.toString()}$`
          if (calcul.step !== '') {
            texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${calcul.step}$<br>`
          }
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${calcul.result}$`
          answer = calcul.result.toString()
          break
        }
        case 'pow' : {
          const p1 = new Trinome(0, randint(1, 5), randint(1, 5))
          const e = new ExponentialOperande({ polynome: p1, k: randint(-2, 2, [0]) })
          const calcul = new Pow(e, randint(2, 4))
          texte = `$${lettreDepuisChiffre(i + 1)} = ${calcul.toString()}$`
          texteCorr = ''
          if (calcul.step !== '') {
            texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${calcul.step}$<br>`
          }
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${calcul.result}$`
          answer = calcul.result.toString()

          break
        }
        case 'k(a+b)': {
          const p1 = new Trinome(0, randint(1, 5), randint(1, 5))
          const p2 = new Trinome(0, randint(1, 5), randint(1, 5))
          const p3 = new Trinome(0, randint(1, 5), randint(1, 5))
          const e1 = new ExponentialOperande({ polynome: p1 })
          const e2 = new ExponentialOperande({ polynome: p2 })
          const e3 = new ExponentialOperande({ polynome: p3 })
          const calcul = new Mul(e1, new Add(e2, e3))
          texte = `$${lettreDepuisChiffre(i + 1)} = ${calcul.toString()}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = `
          const mul1 = new Mul(e1, e2)
          const mul2 = new Mul(e1, e3)
          const add = new Add(mul1, mul2)
          texteCorr += `${add.toString()}$`
          const mul1Step = mul1.step
          const mul2Step = mul2.step
          const add2 = new Add(mul1Step, mul2Step)
          texteCorr += `<br> $${lettreDepuisChiffre(i + 1)} = ${add2}$`
          const add3 = new Add(mul1.result, mul2.result)
          texteCorr += `<br> $${lettreDepuisChiffre(i + 1)}= ${add3}$`
          if (add3.result.toString() !== add3.toString()) {
            texteCorr += `<br> $${lettreDepuisChiffre(i + 1)}= ${add3.result}$`
          }
          answer = add3.result.toString()

          break
        }
        case '(e^mx)p - e^nx * e^ox': {
          const [m, p, n, o] = choice([productEqualSum(), [randint(2, 5), randint(2, 5), randint(2, 5), randint(2, 5)]])
          const p1 = new Trinome(0, m, 0)
          const p2 = new Trinome(0, n, 0)
          const p3 = new Trinome(0, o, 0)
          const e1 = new ExponentialOperande({ polynome: p1 })
          const e2 = new ExponentialOperande({ polynome: p2 })
          const e3 = new ExponentialOperande({ polynome: p3 })
          const terme1 = new Pow(e1, p)
          const terme2 = new Mul(e2, e3)
          const calcul = new Sub(terme1, terme2)
          const result = new Sub(terme1.result, terme2.result)
          texte = `$${lettreDepuisChiffre(i + 1)} = ${calcul.toString()}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${terme1.step} - ${terme2.step}$`
          texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${result}$`
          if (String(result) !== String(result.result)) {
            texteCorr += `<br> $${lettreDepuisChiffre(i + 1)} = ${result.result}$`
          }
          answer = result.result.toString()
          break
        }
        case 'fracPow': {
          const p1 = new Trinome(0, randint(1, 5), randint(1, 5))
          const p2 = new Trinome(0, randint(1, 5), randint(1, 5))
          const n = randint(2, 4)
          const e1 = new ExponentialOperande({ polynome: p1 })
          const e2 = new ExponentialOperande({ polynome: p2 })
          const num = new Pow(e1, n)
          const den = e2
          const calcul = new Frac(num, den)
          texte = `$${lettreDepuisChiffre(i + 1)} = ${calcul}$`
          const numStep = new Frac(num.step, den)
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${numStep}$`
          const calcul2 = new Frac(num.result, den)
          texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${calcul2}$`
          texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${calcul2.step}$`
          texteCorr += `<br>$${lettreDepuisChiffre(i + 1)} = ${calcul2.result}$`
          answer = calcul2.result.toString()
          break
        }
      }
      if (this.interactif) {
        texte += `<br><br> $${lettreDepuisChiffre(i + 1)} = $` + ajouteChampTexteMathLive(this, i, KeyboardType.clavierFullOperations)
        // @ts-expect-error problème typage de handleAnswers
        handleAnswers(this, i, { reponse: { value: answer } })
      }
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}

function productEqualSum () {
  // return [a, b, c, d] such as
  // a * b = c + d
  return choice([
    [2, 3, 4, 2],
    [2, 3, 5, 1],
    [2, 3, 3, 3],
    [2, 4, 1, 7],
    [2, 4, 2, 6],
    [2, 4, 3, 5],
    [2, 4, 4, 4],
    [3, 3, 1, 8],
    [3, 3, 2, 7],
    [3, 3, 3, 6],
    [3, 3, 4, 5]
  ])
}
