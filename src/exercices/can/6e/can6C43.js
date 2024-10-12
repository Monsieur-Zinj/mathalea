import { choice, enleveElement } from '../../../lib/outils/arrayOutils'
import Exercice from '../../Exercice'
import FractionEtendue from '../../../modules/FractionEtendue'
import { remplisLesBlancs } from '../../../lib/interactif/questionMathLive'
import { obtenirListeFractionsIrreductibles } from '../../../modules/fractions'
import { listeQuestionsToContenu, randint } from '../../../modules/outils'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Comparer deux fractions (dénominateurs multiples)'
export const dateDePublication = '04/11/2022'
export const dateDeModifImportante = '12/10/2024'
/*!
 * @author Remi Angot repris par Gilles Mora pour une question can
 * Créé le 04/01/2022
 * Référence can6C43
 */
export const uuid = 'f3b31'
export const ref = 'can6C43'
export const refs = {
  'fr-fr': ['can6C43'],
  'fr-ch': []
}
export default class ExerciceComparerDeuxFractionsCAN extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.tailleDiaporama = 2
    this.consigne = 'Compléter avec $>$ ou $<$.'
    this.spacing = 2
    this.spacingCorr = 2
    this.nbColsCorr = 1
    this.sup2 = false
  }

  nouvelleVersion () {
    const listeFractions = obtenirListeFractionsIrreductibles()
    for (let i = 0, cpt = 0, texte, texteCorr, signe, signe2; i < this.nbQuestions && cpt < 50;) {
      this.autoCorrection[i] = {}
      const fractionAbsolue = choice(listeFractions)
      const k = randint(2, 11)
      let ecart = choice([-4, -3, -2, -1, 1, 2, 3, 4], [-k * fractionAbsolue.num, k * fractionAbsolue.num]) // On exclut -k * a pour ne pas avoir une fraction nulle
      if (k * fractionAbsolue.num + ecart <= 0) {
        ecart = ecart * (-1)
      }
      if (ecart > 0) {
        signe = '<'
        signe2 = '>'
      } else {
        signe = '>'
        signe2 = '<'
      }
      enleveElement(listeFractions, fractionAbsolue) // Il n'y aura pas 2 fois la même réponse
      const fraction = fractionAbsolue
      const autreFraction = new FractionEtendue(k * fraction.num + ecart, k * fraction.den)
      const ordreDesFractions = Math.random() < 0.5
      if (ordreDesFractions) {
        texte = remplisLesBlancs(this, i, `${fraction.texFSD}\\quad%{champ1}\\quad${autreFraction.texFSD}`, 'clavierCompare', '\\quad\\ldots\\quad')
        this.canEnonce = 'Compléter avec $>$ ou $<$.'
        this.canReponseACompleter = `$${fraction.texFSD}$ $\\ldots$ $${autreFraction.texFSD}$`
      } else {
        texte = remplisLesBlancs(this, i, `${autreFraction.texFSD}\\quad%{champ1}\\quad${fraction.texFSD}`, 'clavierCompare', '\\quad\\ldots\\quad')
        this.canEnonce = 'Compléter avec $>$ ou $<$.'
        this.canReponseACompleter = `$${autreFraction.texFSD}$ $\\ldots$ $${fraction.texFSD}$`
      }
      texte = texte.replace('\\quad$ et $\\quad', '\\ldots\\ldots\\ldots')
      let signeAsurB
      if (fraction.signe < 0) signeAsurB = '-'
      else signeAsurB = ''
      texteCorr = `$${fraction.texFSD}= ${signeAsurB} \\dfrac{${Math.abs(fractionAbsolue.num).toString() + miseEnEvidence('\\times  ' + k.toString())}}{${Math.abs(fractionAbsolue.den).toString() + miseEnEvidence('\\times  ' + k.toString())}}=${fraction.reduire(k).texFSD}\\quad$`
      if (ordreDesFractions) {
        texteCorr += `  et   $\\quad${fraction.reduire(k).texFSD} ${signe} ${autreFraction.texFSD} \\quad$ donc $\\quad ${fraction.texFSD} ${miseEnEvidence(signe)} ${autreFraction.texFSD}$.`
      } else {
        texteCorr += `  et   $\\quad${autreFraction.texFSD} ${signe2} ${fraction.reduire(k).texFSD} \\quad$ donc $\\quad ${autreFraction.texFSD} ${miseEnEvidence(signe2)} ${fraction.texFSD} $.`
      }

      handleAnswers(this, i, { champ1: { value: ordreDesFractions ? signe : signe2, compare: fonctionComparaison, options: { texteSansCasse: true } } }, { formatInteractif: 'fillInTheBlank' })

      if (this.questionJamaisPosee(i, fractionAbsolue.num, fractionAbsolue.den, k)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
