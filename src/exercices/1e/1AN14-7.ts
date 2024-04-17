import Exercice from '../Exercice'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { Polynome } from '../../lib/mathFonctions/Polynome'
import { gestionnaireFormulaireTexte, randint } from '../../modules/outils'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { functionCompare } from '../../lib/interactif/comparisonFunctions'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { ecritureAlgebrique, rienSi1 } from '../../lib/outils/ecritures'
export const titre = 'Dérivation de polynomes simples'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '60229'
export const refs = {
  'fr-fr': ['1AN14-7'],
  'fr-ch': []
}
export const dateDePublication = '17/04/2024'

/**
 * Un premier exercice de dérivation
 * @author Jean-Claude Lhote
 *
 */
class DerivationSimple extends Exercice {
  constructor () {
    super()
    this.besoinFormulaireTexte = ['Types de fonction (nombre séparés par des tirets)', '1 : Fonctions affines\n2 : Polynomes de degré 2\n3 : Polynomes de degré 3\n4 : Monomes de degré quelconque\n5 : Mélange']
    this.sup = 1
    this.nbQuestions = 5
    this.correctionDetailleeDisponible = true
  }

  nouvelleVersion () {
    this.reinit()
    const listeTypeDeQuestion = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 4, defaut: 1, melange: 5, nbQuestions: this.nbQuestions })
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let laFonction
      switch (Number(listeTypeDeQuestion[i])) {
        case 2:
          laFonction = new Polynome({ rand: true, deg: 2, coeffs: [] })
          break
        case 3:
          laFonction = new Polynome({ rand: true, deg: 3, coeffs: [] })
          break
        case 4:{
          const deg = randint(3, 15)
          const coeffs = new Array(deg).fill(0)
          coeffs[coeffs.length - 1] = randint(-5, 5, 0)
          laFonction = new Polynome({ rand: false, coeffs, deg })
        }

          break
        case 1:
        default:
          laFonction = new Polynome({ rand: true, deg: 1, coeffs: [] })
          break
      }
      const texte = `Donner l'expression de la dérivée de la fonction $f$ définie par $f(x)=${laFonction.toLatex()}$<br>` + ajouteChampTexteMathLive(this, i, 'nospacebefore inline largeur01 ' + KeyboardType.clavierDeBaseAvecX + ' ' + KeyboardType.clavierFullOperations, { texteAvant: '$f\'(x)=$' })
      const laDerivee = laFonction.derivee()
      let texteCorr = `L'expression de la dérivée de la fonction $f$ définie par $f(x)=${laFonction.toLatex()}$ est :<br>`
      texteCorr += `$f'(x)=${miseEnEvidence(laDerivee.toLatex())}$.`
      if (this.correctionDetaillee) {
        texteCorr += '<br>En effet, '
        const monomes: string[] = []
        const monomesD: string[] = []
        if (listeTypeDeQuestion[i] !== 4) {
          texteCorr += 'La fonction $f$ est une fonction polynomiale formée de termes de la forme $a\\times x^n$.<br>'
          texteCorr += 'Nous appliquons donc la règle suivante : "La dérivée d\'une somme est la somme des dérivées".<br>'
          texteCorr += 'Chaque terme de la forme $a\\times x^n$ a pour dérivée $n\\times ax^{n-1}$, donc :<br>'
          for (let i = 0; i < laFonction.monomes.length; i++) {
            const monome = new Polynome({ coeffs: laFonction.monomes.map((nb: number, index:number) => index === i ? nb : 0) })
            const monomeD = monome.derivee()
            monomes.push(monome.toLatex())
            monomesD.push(monomeD.toLatex())
            texteCorr += `$(${monome.toLatex().replace('+', '')})^\\prime = ${monomeD.toLatex() !== '' ? monomeD.toLatex() : '0'}$<br>`
          }
        } else { // Cas du monome unique
          const deg = laFonction.deg
          const coeff: number = laFonction.monomes[deg]
          console.log(coeff, deg)
          monomes.push(rienSi1(coeff) + `x^{${deg}}`)
          monomesD.push(ecritureAlgebrique(coeff * deg) + `x^{${deg - 1}}`)
          texteCorr += 'La fonction $f$ est une fonction de la forme $a\\times x^n$.<br>'
          texteCorr += `Sa dérivée est donc de la forme : $n\\times ax^{n-1}$ avec $n=${deg}$ et $a=${coeff}$, donc :<br>`
          texteCorr += `$(${monomes[0]})^\\prime = ${monomesD[0]}$<br>`
        }
      }

      if (this.questionJamaisPosee(i, laFonction.toLatex())) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        handleAnswers(this, i, { reponse: { value: { fonction: laDerivee.toLatex(), variable: 'x' }, compare: functionCompare } }, { formatInteractif: 'mathlive' })
        i++
        cpt--
      }
      cpt++
    }
  }
}

export default DerivationSimple
