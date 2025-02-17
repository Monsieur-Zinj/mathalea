import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { range1 } from '../../lib/outils/nombres'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Calculer la valeur d\'une expression littérale'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Calculer la valeur d'une expression littérale
 *
 * * ax+b
 * * a(x+b)
 * * x^2+y^2
 * * x^2-y^2
 * * ax^2+b(x-1)+cy^3
 * * ax^2+bx+c
 * * ax^2+bx-c
 * * ax^2-bx+c
 * * axy+x+y
 * * (ax+b)(cy-d)
 * @author Rémi Angot
 * 5L14
 */
export const uuid = '17e39'
export const ref = '5L14'
export const refs = {
  'fr-fr': ['5L14'],
  'fr-ch': ['10FA1-2', '11FA1-6']
}
export default function CalculerLaValeurDUneExpressionLitterale () {
  Exercice.call(this)
  this.consigne = ''
  this.nbQuestions = 5
  this.nbCols = 1
  this.nbColsCorr = 1

  this.nouvelleVersion = function () {
    this.autoCorrection = []

    // let typesDeQuestionsDisponibles = range1(10)
    let typesDeQuestionsDisponibles

    if (this.version === '5L13-5') {
      typesDeQuestionsDisponibles = range1(2)
    } else {
      typesDeQuestionsDisponibles = range1(10)
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let a, b, c, d, x, y
      switch (listeTypeDeQuestions[i]) {
        case 1: // ax+b
          a = randint(2, 10)
          x = randint(2, 10, a)
          b = randint(1, 10, [a, x])
          texte = `Calculer $${a}x+${b}$ pour $x=${x}$`
          texteCorr = `Pour $x=${x}$ : <br>`
          texteCorr += `$${a}x+${b}=${a}\\times ${x}+${b}=${a * x}+${b}=${miseEnEvidence(`${a * x + b}`)}$`
          setReponse(this, i, a * x + b)
          break
        case 2: // a(x+b)
          a = randint(2, 10)
          x = randint(2, 10, a)
          b = randint(1, 10, [a, x])
          texte = `Calculer $${a}(x+${b})$ pour $x=${x}$`
          texteCorr = `Pour $x=${x}$ : <br>`
          texteCorr += `$${a}(x+${b})=${a}\\times (${x}+${b})=${a}\\times ${x + b}=${miseEnEvidence(`${a * (x + b)}`)}$`
          setReponse(this, i, a * (x + b))
          break
        case 3: // x^2+y^2
          x = randint(2, 10)
          y = randint(2, 10)
          texte = `Calculer $x^2+y^2$ pour $x=${x}$ et $y=${y}$`
          texteCorr = `Pour $x=${x}$ et $y=${y}$ : <br>`
          texteCorr += `$x^2+y^2=${x}^2+${y}^2=${x ** 2}+${y ** 2}=${miseEnEvidence(`${x ** 2 + y ** 2}`)}$`
          setReponse(this, i, x ** 2 + y ** 2)
          break
        case 4: // x^2-y^2
          x = randint(2, 10)
          y = randint(1, x - 1)
          texte = `Calculer $x^2-y^2$ pour $x=${x}$ et $y=${y}$`
          texteCorr = `Pour $x=${x}$ et $y=${y}$ : <br>`
          texteCorr += `$x^2-y^2=${x}^2-${y}^2=${x ** 2}-${y ** 2}=${miseEnEvidence(`${x ** 2 - y ** 2}`)}$`
          setReponse(this, i, x ** 2 - y ** 2)
          break
        case 5: // ax^2+b(x-1)+cy^3
          a = randint(2, 5)
          b = randint(2, 6)
          c = randint(2, 6)
          x = randint(3, 6)
          y = choice([1, 2, 3, 5, 10])
          texte = `Calculer $${a}x^2+${b}(x-1)+${c}y^3$ pour $x=${x}$ et $y=${y}$`
          texteCorr = `Pour $x=${x}$ et $y=${y}$ : <br>`
          texteCorr += `$${a}x^2+${b}(x-1)+${c}y^3=${a}\\times ${x}^2+${b}(${x}-1)+${c}\\times ${y}^3=${a}\\times ${x ** 2}+${b}\\times ${x - 1}+${c}\\times ${y ** 3}=${miseEnEvidence(`${a * x ** 2 + b * (x - 1) + c * y ** 3}`)}$`
          setReponse(this, i, a * x ** 2 + b * (x - 1) + c * y ** 3)
          break
        case 6: // ax^2+bx+c
          a = randint(2, 5)
          b = randint(2, 6)
          c = randint(2, 6)
          x = randint(3, 6)
          texte = `Calculer $${a}x^2+${b}x+${c}$ pour $x=${x}$`
          texteCorr = `Pour $x=${x}$ : <br>`
          texteCorr += `$${a}x^2+${b}x+${c}=${a}\\times ${x}^2+${b}\\times ${x}+${c}=${a}\\times ${x ** 2}+${b * x}+${c}=${miseEnEvidence(`${a * x ** 2 + b * x + c}`)}$`
          setReponse(this, i, a * x ** 2 + b * x + c)
          break
        case 7: // ax^2+bx-c
          a = randint(2, 5)
          b = randint(2, 6)
          c = randint(2, 6)
          x = randint(3, 6)
          texte = `Calculer $${a}x^2+${b}x-${c}$ pour $x=${x}$`
          texteCorr = `Pour $x=${x}$ : <br>`
          texteCorr += `$${a}x^2+${b}x-${c}=${a}\\times ${x}^2+${b}\\times ${x}-${c}=${a}\\times ${x ** 2}+${b * x}-${c}=${miseEnEvidence(`${a * x ** 2 + b * x - c}`)}$`
          setReponse(this, i, a * x ** 2 + b * x - c)
          break
        case 8: // ax^2-bx+c
          a = randint(2, 5)
          b = randint(2, a)
          c = randint(2, 6)
          x = randint(3, 6)
          texte = `Calculer $${a}x^2-${b}x+${c}$ pour $x=${x}$`
          texteCorr = `Pour $x=${x}$ : <br>`
          texteCorr += `$${a}x^2-${b}x+${c}=${a}\\times ${x}^2-${b}\\times ${x}+${c}=${a}\\times ${x ** 2}-${b * x}+${c}=${miseEnEvidence(`${a * x ** 2 - b * x + c}`)}$`
          setReponse(this, i, a * x ** 2 - b * x + c)
          break

        case 9: // axy+x+y
          a = randint(2, 10)
          x = randint(2, 10)
          y = randint(2, 10, x)
          texte = `Calculer $${a}xy+x+y$ pour $x=${x}$ et $y=${y}$`
          texteCorr = `Pour $x=${x}$ et $y=${y}$ : <br>`
          texteCorr += `$${a}xy+x+y=${a}\\times ${x}\\times ${y}+${x}+${y}=${a * x * y}+${x}+${y}=${miseEnEvidence(`${a * x * y + x + y}`)}$`
          setReponse(this, i, a * x * y + x + y)
          break
        case 10: // (ax+b)(cy-d)
          a = randint(2, 10)
          x = randint(2, 10)
          b = randint(1, 10)
          y = randint(2, 10, x)
          c = randint(2, 10)
          d = randint(1, Math.min(10, c * y))
          texte = `Calculer $(${a}x+${b})(${c}y-${d})$ pour $x=${x}$ et $y=${y}$`
          texteCorr = `Pour $x=${x}$ et $y=${y}$ : <br>`
          texteCorr += `$(${a}x+${b})(${c}y-${d})=(${a}\\times ${x}+${b})(${c}\\times ${y}-${d})=${a * x + b}\\times ${c * y - d}=${miseEnEvidence(`${(a * x + b) * (c * y - d)}`)}$`
          setReponse(this, i, (a * x + b) * (c * y - d))
          break
      }
      texte += this.interactif ? (' : ' + ajouteChampTexteMathLive(this, i)) : '.'

      if (this.questionJamaisPosee(i, texte)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
