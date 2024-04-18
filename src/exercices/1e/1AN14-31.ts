import Exercice from '../Exercice'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { Polynome } from '../../lib/mathFonctions/Polynome'
import { gestionnaireFormulaireTexte, randint } from '../../modules/outils'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import engine, { functionCompare } from '../../lib/interactif/comparisonFunctions'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { rienSi1 } from '../../lib/outils/ecritures'
import { choice, shuffle } from '../../lib/outils/arrayOutils'
export const titre = 'Dérivation de sommes V1'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'a83c0'
export const refs = {
  'fr-fr': ['1AN14-31'],
  'fr-ch': []
}
export const dateDePublication = '17/04/2024'

/**
 * Un deuxième exercice de dérivation
 * @author Jean-Claude Lhote
 *
 */
class DerivationSommesSimples extends Exercice {
  constructor () {
    super()
    this.besoinFormulaireTexte = ['Types de fonctions', 'Nombres séparés par des tirets\n1 : polynome et inverse\n2 : polynome et racine carrée\n3 : inverse et racine carrée\n4 : les trois réunis\n5 : Mélange']
    this.sup = 1
    this.nbQuestions = 5
    this.correctionDetailleeDisponible = true
  }

  nouvelleVersion () {
    this.reinit()
    const listeTypeDeQuestion = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 4, defaut: 1, melange: 5, nbQuestions: this.nbQuestions })
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const lesFonctions: {fonction: string, derivee: string}[] = []
      const [a, b, c] = choice(
        [[0, 0, randint(-5, 5, [-1, 0, 1])],
          [0, randint(-5, 5, [-1, 0, 1]), 0],
          [0, randint(-5, 5, [-1, 0, 1]), randint(-5, 5, [-1, 0, 1])],
          [randint(-5, 5, [-1, 0, 1]), randint(-5, 5, [-1, 0, 1]), randint(-5, 5, [-1, 0, 1])]]
      )
      let df: string
      switch (Number(listeTypeDeQuestion[i])) {
        case 2:{
          const laFonction1 = new Polynome({ rand: false, deg: 2, coeffs: [a, b, c] })
          const k = randint(-5, 5, 0)
          lesFonctions.push(
            { fonction: laFonction1.toLatex(), derivee: laFonction1.derivee().toLatex() },
            { fonction: `${rienSi1(k)}\\sqrt{x}`, derivee: `${k < 0 ? '-' : ''}\\dfrac{${String(Math.abs(k))}}{2\\sqrt{x}}` }
          )
          df = '\\R_+'
        }
          break
        case 3:{
          const k = randint(-5, 5, 0)
          const k2 = randint(-5, 5, [0, k])
          lesFonctions.push(
            { fonction: `${k < 0 ? '-' : ''}\\dfrac{${String(Math.abs(k))}}{x}`, derivee: `${k > 0 ? '-' : ''}\\dfrac{${String(Math.abs(k))}}{x^2}` },
            { fonction: `${rienSi1(k2)}\\sqrt{x}`, derivee: `${k2 < 0 ? '-' : ''}\\dfrac{${String(Math.abs(k2))}}{2\\sqrt{x}}` }
          )
          df = '\\R_+^{*}'
        }
          break
        case 4:{
          const laFonction1 = new Polynome({ rand: false, deg: 2, coeffs: [a, b, c] })
          const k = randint(-5, 5, 0)
          const k2 = randint(-5, 5, [0, k])
          lesFonctions.push(
            { fonction: laFonction1.toLatex(), derivee: laFonction1.derivee().toLatex() },
            { fonction: `${k < 0 ? '-' : ''}\\dfrac{${String(Math.abs(k))}}{x}`, derivee: `${k > 0 ? '-' : ''}\\dfrac{${String(Math.abs(k))}}{x^2}` },
            { fonction: `${rienSi1(k2)}\\sqrt{x}`, derivee: `${k2 < 0 ? '-' : ''}\\dfrac{${String(Math.abs(k2))}}{2\\sqrt{x}}` }
          )
          df = '\\R_+^{*}'
        }
          break
        case 1:
        default: {
          const laFonction1 = new Polynome({ rand: false, coeffs: [a, b, c] })
          const k = randint(-9, 9, 0)
          lesFonctions.push(
            { fonction: laFonction1.toLatex(), derivee: laFonction1.derivee().toLatex() },
            { fonction: `${k < 0 ? '-' : ''}\\dfrac{${String(Math.abs(k))}}{x}`, derivee: `${k > 0 ? '-' : ''}\\dfrac{${String(Math.abs(k))}}{x^2}` }
          )
          df = '\\R^{*}'
        }
          break
      }
      const fonctionsMelangees = shuffle(lesFonctions)
      let laFonction = ''
      for (const f of fonctionsMelangees) {
        if (f.fonction.startsWith('+')) f.fonction = f.fonction.substring(1)
        if (!f.fonction.startsWith('-')) {
          if (laFonction !== '') laFonction += '+'
        }
        laFonction += f.fonction
      }
      let laDerivee = ''
      for (const f of fonctionsMelangees) {
        if (f.derivee.startsWith('+')) f.derivee = f.derivee.substring(1)
        if (!f.derivee.startsWith('-')) {
          if (laDerivee !== '') laDerivee += '+'
        }
        laDerivee += f.derivee
      }
      const texte = `Donner l'expression de la dérivée de la fonction $f$ définie sur $${df}$ par $f(x)=${laFonction}$.<br>` + ajouteChampTexteMathLive(this, i, 'nospacebefore inline largeur01 ' + KeyboardType.clavierDeBaseAvecX + ' ' + KeyboardType.clavierFullOperations, { texteAvant: '$f\'(x)=$' })
      let texteCorr = ''
      if (this.correctionDetaillee) {
        for (const f of fonctionsMelangees) {
          texteCorr += `$(${f.fonction})^\\prime=${f.derivee}$<br>`
        }
      }
      texteCorr += `L'expression de la dérivée de la fonction $f$ définie par $f(x)=${laFonction}$ est :<br>`
      texteCorr += `$f'(x)=${miseEnEvidence(laDerivee)}$.<br>`

      if (this.questionJamaisPosee(i, laFonction)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        handleAnswers(this, i, { reponse: { value: { fonction: laDerivee, variable: 'x' }, compare: functionCompare } }, { formatInteractif: 'mathlive' })
        i++
        cpt--
      }
      cpt++
    }
  }
}

export default DerivationSommesSimples
