import { choice, combinaisonListes } from '../../lib/outils/arrayOutils.js'
import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { fraction } from '../../modules/fractions.js'
import { ComputeEngine } from '@cortex-js/compute-engine'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { pgcd } from '../../lib/outils/primalite.js'

export const titre = 'Factoriser avec les identités remarquables'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Factoriser en utilisant les 3 identités remarquables
* @author Jean-Claude Lhote
* 2N41-7, ex 2L11
*/
export const uuid = '0bd00'
export const ref = '2N41-7v2'
export default function FactoriserIdentitesRemarquables2 () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.consigne = 'Factoriser les expressions suivantes.'
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 5
  this.sup = 1

  const engine = new ComputeEngine()

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
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
      do {
        a = randint(1, 9)
        b = randint(2, 9)
        const fractionChoisie = choice(listeFractions)
        ns = fractionChoisie[0]
        ds = fractionChoisie[1]
      } while (pgcd(ns, a) !== 1 || pgcd(a, b) !== 1) // On évite ainsi les doubles factorisations qui posent problème
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
          reponseAttendue = `(${b}x+${a})^2`
          break
        case 5:
          texte = `$${b * b}x^2-${2 * b * a}x+${a * a}$` // (bx-a)² b>1
          texteCorr = `$${b * b}x^2-${2 * b * a}x+${a * a}=(${b}x)^2-2 \\times ${b}x \\times ${a} + ${a}^2=(${b}x-${a})^2$`
          reponseAttendue = `(${b}x-${a})^2`
          break
        case 6:
          texte = `$${b * b}x^2-${a * a}$` // (bx-a)(bx+a) b>1
          texteCorr = `$${b * b}x^2-${a * a}=(${b}x)^2-${a}^2=(${b}x-${a})(${b}x+${a})$`
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
      texte += remplisLesBlancs(this, i, '=%{expr}', 'inline15 college6e ml-2', '\\ldots\\ldots')
      const compareReponseSaisie = (a, b) => {
        const aCleaned = a.replaceAll('²', '^2').replaceAll(',', '.').replaceAll('dfrac', 'frac')
        const bCleaned = b.replaceAll('²', '^2').replaceAll(',', '.').replaceAll('dfrac', 'frac')
        const saisieParsed = engine.parse(aCleaned, { canonical: true })
        const reponseParsed = engine.parse(bCleaned, { canonical: true })
        const saisieDev = engine.box(['Expand', saisieParsed]).evaluate().simplify().canonical
        const reponseDev = engine.box(['Expand', reponseParsed]).evaluate().simplify().canonical
        return saisieDev.isEqual(reponseDev) && ['Multiply', 'Square', 'Power'].includes(saisieParsed.head)
      }
      setReponse(this, i, { expr: { value: reponseAttendue, compare: compareReponseSaisie } }, { formatInteractif: 'fillInTheBlank' })
      if (this.listeQuestions.indexOf(texte) === -1) {
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
