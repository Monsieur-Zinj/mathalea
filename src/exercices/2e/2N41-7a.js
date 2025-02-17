import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { fraction } from '../../modules/fractions.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { pgcd } from '../../lib/outils/primalite'
import { rienSi1 } from '../../lib/outils/ecritures'
import { factorisationCompare } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Factoriser avec les identités remarquables'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Factoriser en utilisant les 3 identités remarquables
* @author Jean-Claude Lhote
* 2N41-7a
*/
export const uuid = '0bd00'
export const ref = '2N41-7a'
export const refs = {
  'fr-fr': ['2N41-7a'],
  'fr-ch': ['11FA3-5']
}
// fonction de comparaison de deux expressions factorisées
// @todo à déplacer dans comparisonFunctions.ts lors de la fusion de handleAnswer

export default function FactoriserIdentitesRemarquables2 () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = 'Factoriser les expressions suivantes.'
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 5
  this.sup = 1

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    const listeFractions = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
      [1, 6], [5, 6], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [1, 8], [3, 8], [5, 8], [7, 8],
      [1, 9], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9], [1, 10], [3, 10], [7, 10], [9, 10]]
    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1, 2, 3] // coef de x = 1
    } else if (this.sup === 2) {
      typesDeQuestionsDisponibles = [4, 5, 6] // coef de x > 1
    } else if (this.sup === 3) {
      typesDeQuestionsDisponibles = [7, 8, 9] // coef de x rationnel
    } else {
      typesDeQuestionsDisponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0, a, b, ns, ds, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      a = randint(1, 9)
      b = randint(2, 9)
      const fractionChoisie = choice(listeFractions)
      ns = fractionChoisie[0]
      ds = fractionChoisie[1]
      const fra = fraction(ns, ds)
      const fraC = fra.produitFraction(fra)
      const fraD = fra.multiplieEntier(2 * a)
      let reponseAttendue
      switch (typesDeQuestions) {
        case 1:
          texte = `$x^2+${2 * a}x+${a * a}$` // (x+a)²
          texteCorr = `$x^2+${2 * a}x+${a * a}=x^2+2 \\times ${a} \\times x+${a}^2=(x+${a})^2$`
          reponseAttendue = `(x+${a})^2`
          break
        case 2:
          texte = `$x^2-${2 * a}x+${a * a}$` // (x-a)²
          texteCorr = `$x^2-${2 * a}x+${a * a}=x^2-2 \\times ${a} \\times x+${a}^2=(x-${a})^2$`
          reponseAttendue = `(x-${a})^2`
          break
        case 3:
          texte = `$x^2-${a * a}$` // (x-a)(x+a)
          texteCorr = `$x^2-${a * a}=x^2-${a}^2=(x-${a})(x+${a})$`
          reponseAttendue = `(x-${a})(x+${a})`
          break
        case 4:
          texte = `$${b * b}x^2+${2 * b * a}x+${a * a}$` // (bx+a)²  b>1
          texteCorr = `$${b * b}x^2+${2 * b * a}x+${a * a}=(${b}x)^2+2 \\times ${b}x \\times ${a} + ${a}^2=(${b}x+${a})^2$`
          if (pgcd(b, a) !== 1) {
            const p = pgcd(b, a)
            const a2 = a / p
            const b2 = b / p
            const p2 = p * p
            texteCorr += `<br>Il est possible de mettre tout d'abord $${p2}$ en facteur avant d'utiliser une identité remarquable :<br>`
            texteCorr += `$${b * b}x^2+${2 * b * a}x+${a * a}=${p2}\\left(${rienSi1(b2 * b2)}x^2+${2 * b2 * a2}x+${a2 * a2}\\right)=${p2}\\left(${b2 !== 1 ? '(' + b2 + 'x)' : 'x'}^2+2 \\times ${rienSi1(b2)}x ${a2 !== 1 ? '\\times ' + a2 : ''} + ${a2}^2\\right)=${p2}(${rienSi1(b2)}x+${a2})^2$`
          }
          reponseAttendue = `(${b}x+${a})^2`
          break
        case 5:
          texte = `$${b * b}x^2-${2 * b * a}x+${a * a}$` // (bx-a)² b>1
          texteCorr = `$${b * b}x^2-${2 * b * a}x+${a * a}=(${b}x)^2-2 \\times ${b}x \\times ${a} + ${a}^2=(${b}x-${a})^2$`
          if (pgcd(b, a) !== 1) {
            const p = pgcd(b, a)
            const a2 = a / p
            const b2 = b / p
            const p2 = p * p
            texteCorr += `<br>Il est possible de mettre tout d'abord $${p2}$ en facteur avant d'utiliser une identité remarquable :<br>`
            texteCorr += `$${b * b}x^2-${2 * b * a}x+${a * a}=${p2}\\left(${rienSi1(b2 * b2)}x^2-${2 * b2 * a2}x+${a2 * a2}\\right)=${p2}\\left(${b2 !== 1 ? '(' + b2 + 'x)' : 'x'}^2-2 \\times ${rienSi1(b2)}x ${a2 !== 1 ? '\\times ' + a2 : ''} + ${a2}^2\\right)=${p2}(${rienSi1(b2)}x-${a2})^2$`
          }
          reponseAttendue = `(${b}x-${a})^2`
          break
        case 6:
          texte = `$${b * b}x^2-${a * a}$` // (bx-a)(bx+a) b>1
          texteCorr = `$${b * b}x^2-${a * a}=(${b}x)^2-${a}^2=(${b}x-${a})(${b}x+${a})$`
          if (pgcd(b, a) !== 1) {
            const p = pgcd(b, a)
            const a2 = a / p
            const b2 = b / p
            const p2 = p * p
            texteCorr += `<br>Il est possible de mettre tout d'abord $${p2}$ en facteur avant d'utiliser une identité remarquable :<br>`
            texteCorr += `$${b * b}x^2-${a * a}=${p2}\\left(${rienSi1(b2 * b2)}x^2-${a2 * a2}\\right)=${p2}\\left(${b2 !== 1 ? '(' + b2 + 'x)' : 'x'}^2-${a2}^2\\right)=${p2}(${rienSi1(b2)}x+${a2})(${rienSi1(b2)}x-${a2})$`
          }
          reponseAttendue = `(${b}x-${a})(${b}x+${a})`
          break
        case 7:

          texte = `$${fraC.texFraction}x^2+${fraD.texFraction}x+${a * a}$` // (kx+a)² k rationnel
          texteCorr = `$${fraC.texFraction}x^2+${fraD.texFraction}x+${a * a}=\\left(${fra.texFraction}x\\right)^2+2 \\times ${fra.texFraction}x \\times ${a} + ${a}^2=\\left(${fra.texFraction}x+${a}\\right)^2$`
          reponseAttendue = `(${fra.texFraction}x+${a})^2`
          break
        case 8:
          texte = `$${fraC.texFraction}x^2-${fraD.texFraction}x+${a * a}$` // (kx-a)² k rationnel
          texteCorr = `$${fraC.texFraction}x^2-${fraD.texFraction}x+${a * a}=\\left(${fra.texFraction}x\\right)^2-2 \\times ${fra.texFraction}x \\times ${a} + ${a}^2=\\left(${fra.texFraction}x-${a}\\right)^2$`
          reponseAttendue = `(${fra.texFraction}x-${a})^2`
          break
        case 9:
          //  (bx-a)(bx+a) avec a entier et b rationnel simple
          texte = `$${fraC.texFraction}x^2-${a * a}$` // b>1`
          texteCorr = `$${fraC.texFraction}x^2-${a * a}=\\left(${fra.texFraction}x\\right)^2-${a}^2=\\left(${fra.texFraction}x-${a}\\right)\\left(${fra.texFraction}x+${a}\\right)$`
          reponseAttendue = `(${fra.texFraction}x-${a})(${fra.texFraction}x+${a})`
          break
      }
      reponseAttendue = reponseAttendue.replaceAll('dfrac', 'frac')
      texte += ' $=$ ' + ajouteChampTexteMathLive(this, i, '  college6e ml-2')

      handleAnswers(this, i, { reponse: { value: reponseAttendue, compare: factorisationCompare } }, { formatInteractif: 'mathlive' })
      if (this.questionJamaisPosee(i, a, b, typesDeQuestions)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, '1 : Coefficient de x égal à 1\n 2 : Coefficient de x supérieur à 1\n 3 : Coefficient de x rationnel\n 4 : Mélange']
}
