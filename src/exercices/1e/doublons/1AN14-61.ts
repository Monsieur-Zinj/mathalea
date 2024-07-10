import Exercice from '../../Exercice'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { gestionnaireFormulaireTexte, randint } from '../../../modules/outils'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { functionCompare } from '../../../lib/interactif/comparisonFunctions'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { ecritureParentheseSiNegatif, reduireAxPlusB } from '../../../lib/outils/ecritures'
import FractionEtendue from '../../../modules/FractionEtendue'
export const titre = 'Dérivation de fonction composées V2'
export const interactifReady = true
export const interactifType = 'mathLive'

// <<<<<<<< f1c664b0c5b24bc63f7c4980b9588c2ce195b0fe:src/exercices/1e/doublons/1AN14-61.ts
// export const uuid = '518d8'
// export const refs = {
//   'fr-fr': ['1AN14-61'],
//   'fr-ch': []
// }
export const dateDePublication = '17/04/2024'

/**
 * Dérivée de u/v
 * Doublon avec 1AN14-6
========
// export const uuid = '25135'
// export const refs = {
//   'fr-fr': ['1AN14-72'],
//   'fr-ch': []
// }

export const dateDePublication = '17/04/2024'

/**
 * Dérivée de u(mx + p)
 * Doublon avec 1AN14-7
>>>>>>>> 6cbb4face9b7a0560f7afc5d4c553cf20a5d351d:src/exercices/1e/1AN14-71.ts
 * @author Jean-Claude Lhote
 *
 */
class DerivationGRondF extends Exercice {
  constructor () {
    super()
    this.besoinFormulaireTexte = ['Types de fonctions : ', 'Nombres séparés par des tirets\n1 : (ax+b)^n\n2 : ln(ax+b)\n3 : exp(ax+b)\n4 : rac(ax+b)\n5 : Mélange']
    this.sup = '5'
    this.nbQuestions = 5
    this.correctionDetailleeDisponible = true
  }

  nouvelleVersion () {
    this.reinit()
    const listeTypeDeQuestion = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 4, defaut: 1, melange: 5, nbQuestions: this.nbQuestions })
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let laFonctionFEnLatex: string
      let df: string
      let formeGeneraleDerivee: string
      let formeGenerale: string
      let fPrime: string
      let fPrimeDetaillee: string
      let domaine // la variable domaine pour la fonction de comparaison
      const a = randint(-10, 10, 0)
      const b = randint(-5, 5, 0)
      const u = reduireAxPlusB(a, b, 'x')
      const valeurInterdite = new FractionEtendue(-b, a).simplifie().texFSD
      const n = randint(2, 6)
      const typeQuestion = Number(listeTypeDeQuestion[i])
      switch (typeQuestion) {
        case 1:
          fPrimeDetaillee = n === 2 ? `${String(n)}\\times ${ecritureParentheseSiNegatif(a)}\\times\\lparen ${u} \\rparen` : `${String(n)}\\times ${ecritureParentheseSiNegatif(a)}\\times \\lparen${u}\\rparen^${n - 1}`
          fPrime = n === 2 ? `${String(n * a)}\\times\\lparen${u}\\rparen` : `${String(n * a)}\\times \\lparen ${u} \\rparen^${n - 1}`
          laFonctionFEnLatex = `\\lparen ${u}\\rparen^${n}`
          df = '\\R'
          formeGenerale = 'u^n'
          formeGeneraleDerivee = '(u^{n})^\\prime=nu^\\prime u^{n-1}'
          domaine = [-10, 10]
          break
        case 2:
          fPrimeDetaillee = `\\dfrac{${String(a)}}{${u}}`
          fPrime = `\\dfrac{${String(a)}}{${u}}`
          laFonctionFEnLatex = `\\ln\\lparen ${u}\\rparen`
          df = a < 0 ? `\\left]-\\infty;${valeurInterdite}\\right[` : `\\left]${valeurInterdite};+\\infty\\right[`
          formeGenerale = 'ln(u)'
          formeGeneraleDerivee = '(ln(u))^\\prime=\\dfrac{u^\\prime}{u}'
          domaine = a < 0 ? [-b / a - 10, -b / a - 1] : [-b / a + 1, -b / a + 10]
          break
        case 3:
          fPrimeDetaillee = `${String(a)}\\times e^{${u}}`
          fPrime = `${String(a)}e^{${u}}`
          laFonctionFEnLatex = `e^{${u}}`
          df = '\\R'
          formeGenerale = 'e^u'
          formeGeneraleDerivee = '(e^u)^\\prime=u^\\prime e^u'
          domaine = [-10, 10]
          break
        case 4:
        default:
          fPrimeDetaillee = `\\dfrac{${String(a)}}{2\\sqrt{${u}}}`
          fPrime = a % 2 === 0 ? `\\dfrac{${String(a / 2)}}{\\sqrt{${u}}}` : `\\dfrac{${String(a)}}{2\\sqrt{${u}}}`
          laFonctionFEnLatex = `\\sqrt{${u}}`
          df = a < 0 ? `\\left]-\\infty;${valeurInterdite}\\right[` : `\\left]${valeurInterdite};+\\infty\\right[`
          formeGenerale = '\\sqrt{u}'
          formeGeneraleDerivee = '(\\sqrt{u})^\\prime=\\dfrac{u^\\prime}{2\\sqrt{u}}'
          domaine = a < 0 ? [-b / a - 10, -b / a - 1] : [-b / a + 1, -b / a + 10]
          break
      }
      const texte = `Donner l'expression de la dérivée de la fonction $f$ définie sur $${df}$ par $f(x)=${laFonctionFEnLatex}$.<br>` + ajouteChampTexteMathLive(this, i, 'nospacebefore inline largeur01 ' + KeyboardType.clavierDeBaseAvecX + ' ' + KeyboardType.clavierFullOperations, { texteAvant: '$f\'(x)=$' })
      let texteCorr = ''
      if (this.correctionDetaillee) {
        texteCorr += `La fonction $f$ est de la forme $${formeGenerale}$ et donc que la dérivée est de la forme $${formeGeneraleDerivee}$.<br>`
        texteCorr += `On a $u(x)=${u}$${typeQuestion === 1 ? `, $n=${n}$` : ''} et $u^\\prime(x)=${String(a)}$.<br>`
        texteCorr += `$f^\\prime(x)=${fPrimeDetaillee}$.<br>`
      }
      texteCorr += `L'expression de la dérivée de la fonction $f$ définie par $f(x)=${laFonctionFEnLatex}$ est : `
      texteCorr += `$f'(x)=${miseEnEvidence(fPrime)}$.`

      if (this.questionJamaisPosee(i, laFonctionFEnLatex, fPrime)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        handleAnswers(this, i, { reponse: { value: fPrime, options: { variable: 'x', domaine }, compare: functionCompare } })
        i++
        cpt--
      }
      cpt++
    }
  }
}

export default DerivationGRondF
