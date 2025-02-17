import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { texFractionFromString, texFractionReduite } from '../../lib/outils/deprecatedFractions.js'
import { pgcd } from '../../lib/outils/primalite'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Développer $(a+b)^2$'

/**
 * Développer (ax+b)²
 * @author Matthieu Devillers
 * matthieu.devillers@ac-rennes.fr
 * 2N41-4, ex 2L12-2
 */
export const uuid = '877a9'
export const ref = '2N41-4'
export const refs = {
  'fr-fr': ['2N41-4'],
  'fr-ch': ['11FA2-10']
}
export default function DevelopperIdentitesRemarquables3 () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = 'Développer puis réduire les expressions suivantes.'
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 3
  this.sup = 5
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.correctionDetailleeDisponible = true
  context.isHtml ? (this.spacingCorr = 3) : (this.spacingCorr = 2)
  if (!context.isHtml) {
    this.correctionDetaillee = false
  }
  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    const listeFractions = [
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 6],
      [5, 6],
      [1, 7],
      [2, 7],
      [3, 7],
      [4, 7],
      [5, 7],
      [6, 7],
      [1, 8],
      [3, 8],
      [5, 8],
      [7, 8],
      [1, 9],
      [2, 9],
      [4, 9],
      [5, 9],
      [7, 9],
      [8, 9],
      [1, 10],
      [3, 10],
      [7, 10],
      [9, 10]
    ]
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1] // coef de x = 1
    } else if (this.sup === 2) {
      typesDeQuestionsDisponibles = [2] // coef de x > 1
    } else if (this.sup === 3) {
      typesDeQuestionsDisponibles = [3] // coef de x négatif
    } else if (this.sup === 4) {
      typesDeQuestionsDisponibles = [4] // coefficients rationnels
    } else {
      typesDeQuestionsDisponibles = [1, 2, 3, 4]
    } // mélange des questions

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, reponse, cpt = 0, a, b, fraction = [], ns, ds, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      a = randint(1, 12)
      b = randint(2, 12)
      fraction = choice(listeFractions)
      ns = fraction[0]
      ds = fraction[1]
      texteCorr = ''
      switch (typesDeQuestions) {
        case 1:
          texte = `$\\left(x+${a}\\right)^2$` // (x+a)^2
          if (this.correctionDetaillee) {
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a+b)^2=a^2+2ab+b^2$, <br> avec $\\color{red} a = x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br> <br>`
            texteCorr += `$\\left(\\color{red}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2=\\color{red}x\\color{black}^2+2 \\times \\color{red}x \\color{black}\\times \\color{green}${a} \\color{black}+ \\color{green}${a}\\color{black}^2$ <br>`
            texteCorr += `$\\phantom{\\left(\\color{red}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2} = x^2+${2 * a}x+${a * a}$`
          } else {
            texteCorr += `$\\left(x+${a} \\right)^2=x^2+${2 * a}x+${a * a}$`
          }
          reponse = `x^2+${2 * a}x+${a * a}`
          break
        case 2:
          texte = `$\\left(${b}x+${a}\\right)^2$` // b>1
          if (this.correctionDetaillee) {
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a+b)^2=a^2+2ab+b^2$, <br> avec $\\color{red} a = ${b}x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br> <br>`
            texteCorr += `$\\left(\\color{red}${b}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2 = \\left(\\color{red}${b}x\\color{black}\\right)^2 + 2 \\times \\color{red}${b}x\\color{black} \\times \\color{green}${a} + ${a}\\color{black}^2$ <br>`
            texteCorr += `$\\phantom{\\left(\\color{red}${b}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2} = ${b * b}x^2+${2 * b * a}x+${a * a}$`
          } else {
            texteCorr += `$\\left(${b}x+${a}\\right)^2 = ${b * b}x^2+${2 * b * a}x+${a * a}$`
          }
          reponse = `${b * b}x^2+${2 * b * a}x+${a * a}`
          break
        case 3:
          b = -b
          texte = `$\\left(${b}x+${a}\\right)^2$` // b<-1
          if (this.correctionDetaillee) {
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a+b)^2=a^2+2ab+b^2$, <br> avec $\\color{red} a = ${b}x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br> <br>`
            texteCorr += `$\\left(\\color{red}${b}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2 = \\left(\\color{red}${b}x\\color{black}\\right)^2 + 2 \\times \\color{red}(${b}x)\\color{black} \\times \\color{green}${a} + ${a}\\color{black}^2$ <br>`
            texteCorr += `$\\phantom{\\left(\\color{red}${b}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2} = ${b * b}x^2 -${2 * (-b) * a}x+${a * a}$`
          } else {
            texteCorr = texte + `$= ${b * b}x^2 -${2 * (-b) * a}x+${a * a}$`
          }
          reponse = `${b * b}x^2-${2 * (-b) * a}x+${a * a}`
          break
        case 4:
          texte = `$\\left(${texFractionFromString(ns, ds)}x+${a}\\right)^2$`
          if (this.correctionDetaillee) {
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a+b)^2=a^2+2ab+b^2$, <br> avec $\\color{red} a = ${texFractionFromString(ns, ds)}x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br> <br>`
            texteCorr += `$\\left(\\color{red}${texFractionFromString(ns, ds)}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2 = \\left(\\color{red}${texFractionFromString(ns, ds)}x\\color{black}\\right)^2 + 2 \\times \\color{red}${texFractionFromString(ns, ds)}x\\color{black} \\times \\color{green}${a} + ${a}\\color{black}^2 $ <br><br>`
            texteCorr += `$\\phantom{\\left(\\color{red}${texFractionFromString(ns, ds)}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2} = ${texFractionFromString(ns * ns, ds * ds)}x^2+${texFractionFromString(2 * ns * a, ds)}x+${a * a}$`
            if ((pgcd(ns, ds) !== 1 || pgcd(2 * ns * a, ds) !== 1)) {
              texteCorr += `<br> <br> $\\phantom{\\left(\\color{red}${texFractionFromString(ns, ds)}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2} = ${texFractionReduite(ns * ns, ds * ds)}x^2+${texFractionReduite(2 * ns * a, ds)}x+${a * a}$`
            }
          } else {
            // texteCorr = texte + `$= ${texFractionReduite(ns * ns, ds * ds)}x^2+${texFractionReduite(2 * ns * a, ds)}x+${a * a}$`
            texteCorr = texte + `$= ${texFractionFromString(ns * ns, ds * ds)}x^2+${texFractionFromString(2 * ns * a, ds)}x+${a * a}$`
            if ((pgcd(ns, ds) !== 1 || pgcd(2 * ns * a, ds) !== 1)) {
              texteCorr += `<br> <br> $\\phantom{\\left(\\color{red}${texFractionFromString(ns, ds)}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2} = ${texFractionReduite(ns * ns, ds * ds)}x^2+${texFractionReduite(2 * ns * a, ds)}x+${a * a}$`
            }
          }
          reponse = [`${texFractionFromString(ns * ns, ds * ds)}x^2+${texFractionFromString(2 * ns * a, ds)}x+${a * a}`, `${texFractionReduite(ns * ns, ds * ds)}x^2+${texFractionReduite(2 * ns * a, ds)}x+${a * a}`]
          break
      }
      texte += ajouteChampTexteMathLive(this, i, '', { texteAvant: ' $=$ ' })
      setReponse(this, i, reponse)
      if (this.questionJamaisPosee(i, typesDeQuestions, a)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 5, '1 : Coefficient de x égal à 1\n 2 : Coefficient de x supérieur à 1\n 3 : Coefficient de x négatif\n 4 : Coefficient de x rationnel\n 5 : Mélange des cas précédents']
}
