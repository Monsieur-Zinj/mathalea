import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { arrondi } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = "Passer d'une fraction à une écriture décimale et inversement"
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '16/03/2022'

/**
 * Propose de passer de l'écriture décimale à l'écriture fractionnaire et inversement
 * Un paramètre permet de limiter cela aux fractions décimales ou d'y incorporer des fractions "simples" (multiples de 1/2, 1/4, 1/5)
 * @author Guillaume Valmont
 */
export const uuid = '91d72'
export const ref = '5N10'
export const refs = {
  'fr-fr': ['5N10'],
  'fr-ch': ['9NO10-2']
}
export default function PasserEcritureDecimaleEcritureFractionnaireInversement () {
  Exercice.call(this)
  this.nbQuestions = 10

  this.besoinFormulaireNumerique = ['Sens demandé', 3, '1 : De l\'écriture décimale à une fraction\n2 : D\'une fraction à l\'écriture décimale\n3 : Mélange']
  this.sup = 3
  this.besoinFormulaire2CaseACocher = ['Uniquement des fractions décimales']
  this.sup2 = false

  this.nbCols = 2
  this.nbColsCorr = 2

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    let typesDesSensDemandes
    if (this.sup === 1) {
      typesDesSensDemandes = ['DecimaleAFractionnaire']
    } else if (this.sup === 2) {
      typesDesSensDemandes = ['FractionnaireADecimale']
    } else {
      typesDesSensDemandes = ['DecimaleAFractionnaire', 'FractionnaireADecimale']
    }
    const listeDesSensDemandes = combinaisonListes(typesDesSensDemandes, this.nbQuestions)

    let typesDeFractionsDisponibles
    if (this.sup2) {
      typesDeFractionsDisponibles = ['fractionsDecimales']
    } else {
      typesDeFractionsDisponibles = ['fractionsDecimales', 'fractionsNonDecimales']
    }
    const listeTypeFractions = combinaisonListes(typesDeFractionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let numerateur, denominateur
      if (listeTypeFractions[i] === 'fractionsDecimales') {
        numerateur = 0
        while (numerateur % 2 === 0 || numerateur % 5 === 0) {
          numerateur = choice([randint(1, 9), randint(11, 99), randint(101, 999)])
        }
        denominateur = choice([10, 100, 1000])
      } else if (listeTypeFractions[i] === 'fractionsNonDecimales') {
        numerateur = randint(1, 9)
        denominateur = choice([2, 4, 5])
        if (numerateur * denominateur % 4 === 0 || numerateur * denominateur % 25 === 0) {
          numerateur += 1
        }
      }
      // eslint-disable-next-line no-unmodified-loop-condition
      while (numerateur % denominateur === 0 || denominateur % numerateur === 0 || (denominateur === 4 && numerateur % 2 === 0)) {
        numerateur += 1
      }
      const ecritureDecimale = numerateur / denominateur

      if (listeDesSensDemandes[i] === 'DecimaleAFractionnaire') {
        texte = `Écrire $${texNombre(ecritureDecimale, 3)}$ sous la forme d'une fraction.`
        if (this.interactif) {
          texte += '<br>' + ajouteChampTexteMathLive(this, i, 'inline largeur25', { texteAvant: `$${texNombre(ecritureDecimale, 3)} = $` })
        }
        if (listeTypeFractions[i] === 'fractionsNonDecimales') {
          let multiple
          denominateur === 4 ? multiple = 100 : multiple = 10
          texteCorr = `$${texNombre(ecritureDecimale, 3)} = \\dfrac{${ecritureDecimale * multiple}}{${multiple}}$  ou $${texNombre(ecritureDecimale, 3)} = \\dfrac{${numerateur}}{${denominateur}}$`
          setReponse(this, i, [new FractionEtendue(ecritureDecimale * multiple, multiple), new FractionEtendue(numerateur, denominateur)], { formatInteractif: 'fractionEgale' })
        } else {
          texteCorr = `$${texNombre(ecritureDecimale, 3)} = \\dfrac{${numerateur}}{${denominateur}}$`
          setReponse(this, i, new FractionEtendue(numerateur, denominateur), { formatInteractif: 'fractionEgale' })
        }
      } else if (listeDesSensDemandes[i] === 'FractionnaireADecimale') {
        texte = `Donner l'écriture décimale de $\\dfrac{${numerateur}}{${denominateur}}$.`
        if (this.interactif) {
          texte += '<br>' + ajouteChampTexteMathLive(this, i, 'inline largeur25', { texteAvant: `$\\dfrac{${numerateur}}{${denominateur}} = $` })
        }
        texteCorr = `$\\dfrac{${numerateur}}{${denominateur}} = ${texNombre(ecritureDecimale, 3)}$`
        setReponse(this, i, arrondi(ecritureDecimale, 3))
      }

      if (this.questionJamaisPosee(i, numerateur, denominateur, listeTypeFractions[i], listeDesSensDemandes[i])) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
