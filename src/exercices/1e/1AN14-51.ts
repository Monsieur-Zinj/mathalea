import Exercice from '../Exercice'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { Polynome } from '../../lib/mathFonctions/Polynome'
import { gestionnaireFormulaireTexte, randint } from '../../modules/outils'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { functionCompare } from '../../lib/interactif/comparisonFunctions'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { compareArrays } from '../../lib/outils/arrayOutils'
export const titre = 'Dérivation de fonction composées V1'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '518d8'
export const refs = {
  'fr-fr': ['1AN14-51'],
  'fr-ch': []
}
export const dateDePublication = '17/04/2024'

/**
 * Un deuxième exercice de dérivation
 * @author Jean-Claude Lhote
 *
 */
class DerivationFonctionRationnelles extends Exercice {
  constructor () {
    super()
    this.besoinFormulaireTexte = ['Types de fonction (nombre séparés par des tirets)', '1 : k/(ax+b)\n2 : (ax+b)/(cx+d)\n3 : ax²/(ax+b)\n4 : (ax²+bx+c)/(dx+e)\n5 : Mélange']
    this.sup = 1
    this.nbQuestions = 5
    this.correctionDetailleeDisponible = true
  }

  nouvelleVersion () {
    this.reinit()
    const listeTypeDeQuestion = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 4, defaut: 1, melange: 5, nbQuestions: this.nbQuestions })
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let laFonctionNum, laFonctionDen
      switch (Number(listeTypeDeQuestion[i])) {
        case 2:
          do {
            laFonctionNum = new Polynome({ rand: true, deg: 1, coeffs: [] })
            laFonctionDen = new Polynome({ rand: true, deg: 1, coeffs: [] })
          } while (compareArrays(laFonctionNum.monomes, laFonctionDen))
          break
        case 3:
          laFonctionNum = new Polynome({ rand: false, deg: 2, coeffs: [0, 0, randint(-6, 6)] })
          laFonctionDen = new Polynome({ rand: true, deg: 1, coeffs: [] })
          break
        case 4:
          laFonctionNum = new Polynome({ rand: true, deg: 2, coeffs: [] })
          laFonctionDen = new Polynome({ rand: true, deg: 1, coeffs: [] })
          break
        case 1:
        default:
          laFonctionNum = new Polynome({ rand: true, deg: 0, coeffs: [] })
          laFonctionDen = new Polynome({ rand: true, deg: 1, coeffs: [] })
          break
      }
      const texte = `Donner l'expression de la dérivée de la fonction $f$ définie par $f(x)=\\dfrac{${laFonctionNum.toLatex()}}{${laFonctionDen.toLatex()}}$<br>` + ajouteChampTexteMathLive(this, i, 'nospacebefore inline largeur01 ' + KeyboardType.clavierDeBaseAvecX + ' ' + KeyboardType.clavierFullOperations, { texteAvant: '$f\'(x)=$' })
      const laDeriveeNum = laFonctionNum.derivee().multiply(laFonctionDen).add((laFonctionNum.multiply(-1).multiply(laFonctionDen.derivee())))
      const laDeriveeDen = laFonctionDen.multiply(laFonctionDen)
      const reponse = `\\dfrac{${laDeriveeNum.toLatex()}}{${laDeriveeDen.toLatex()}}`
      let texteCorr = `L'expression de la dérivée de la fonction $f$ définie par $f(x)=\\dfrac{${laFonctionNum.toLatex()}}{${laFonctionDen.toLatex()}}$ est :<br>`
      texteCorr += `$f'(x)=${miseEnEvidence(reponse)}$.`
      if (this.correctionDetaillee) {
        const derivNum = laFonctionNum.derivee().toLatex()
        const derivDen = laFonctionDen.derivee().toLatex()
        const num = laFonctionNum.toLatex()
        const den = laFonctionDen.toLatex()
        const u = num.length === 1 ? num : `\\lparen ${num}\\rparen`
        const v = den.length === 1 ? den : `\\lparen ${den}\\rparen`
        const uPrime = derivNum.length === 1 ? derivNum : `\\lparen ${derivNum}\\rparen`
        const vPrime = derivDen.length === 1 ? derivDen : `\\lparen ${derivDen}\\rparen`

        texteCorr += `En effet, $f$ est de la forme $\\dfrac{u}{v}$ avec $u(x)=${u}$ et $v(x)=${v}$<br>`
        texteCorr += 'On calcule donc $\\dfrac{u^\\prime\\times v - u\\times v^\\prime}{v^2}$, soit :<br>'
        texteCorr += `Au numérateur : $${uPrime} \\times ${v}  - ${u} \\times ${vPrime}$.<br>`
        texteCorr += `Au dénominateur : $${v}^2$.`
      }

      if (this.questionJamaisPosee(i, laFonctionNum.toLatex(), laFonctionDen.toLatex())) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        handleAnswers(this, i, { reponse: { value: { fonction: reponse, variable: 'x' }, compare: functionCompare } }, { formatInteractif: 'mathlive' })
        i++
        cpt--
      }
      cpt++
    }
  }
}

export default DerivationFonctionRationnelles
