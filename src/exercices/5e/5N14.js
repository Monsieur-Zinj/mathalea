import { choice, combinaisonListes, enleveElement } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { obtenirListeFractionsIrreductibles } from '../../modules/fractions.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { textCompare } from '../../lib/interactif/comparisonFunctions'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'qcmMono'
export const titre = 'Comparer deux fractions (dénominateurs multiples)'

/**
* Comparer deux fractions dont les dénominateurs sont multiples (avec un coefficient paramétrable qui est par défaut inférieur à 11)
* @author Rémi Angot
* 5N14
* Ajout du paramètre d'inclusion de nombres négatifs le 14/08/2021 : Guillaume Valmont
* rendu interactif + AMC par Jean-Claude Lhote
*/
export const uuid = '234a7'
export const refs = {
  'fr-fr': ['5N14'],
  'fr-ch': ['9NO12-5']
}
export default function ExerciceComparerDeuxFractions (max = 11) {
  Exercice.call(this)
  this.sup = max // Correspond au facteur commun
  this.consigne = 'Comparer les fractions suivantes.'
  this.spacing = 2
  this.spacingCorr = 2
  this.nbQuestions = 5
  this.nbColsCorr = 1
  this.sup2 = false

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const listeSignes = combinaisonListes([-1, 1], this.nbQuestions)
    // On crée une liste de FractionEtendues irréductibles.
    const listeFractions = obtenirListeFractionsIrreductibles()
    for (let i = 0, positifOuNegatif, texte, texteCorr, signe, signe2; i < this.nbQuestions;) {
      this.autoCorrection[i] = {}
      if (this.sup2 === true) positifOuNegatif = listeSignes[i]
      else positifOuNegatif = 1
      const fractionAbsolue = choice(listeFractions)
      const k = randint(2, this.sup)
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
      const fraction = fractionAbsolue.multiplieEntier(positifOuNegatif)
      const autreFraction = new FractionEtendue(k * fraction.num + ecart, k * fraction.den)
      const ordreDesFractions = Math.random() < 0.5
      if (ordreDesFractions) {
        texte = remplisLesBlancs(this, i, `${fraction.texFSD}\\quad%{champ1}\\quad${autreFraction.texFSD}`, 'College6e', '\\quad\\ldots\\quad')
      } else {
        texte = remplisLesBlancs(this, i, `${autreFraction.texFSD}\\quad%{champ1}\\quad${fraction.texFSD}`, 'College6e', '\\quad\\ldots\\quad')
      }
      if (!context.isHtml) {
        texte = texte.replace('\\quad$ et $\\quad', '\\ldots\\ldots\\ldots')
      }
      let signeAsurB
      if (fraction.signe < 0) signeAsurB = '-'
      else signeAsurB = ''
      texteCorr = `$${fraction.texFSD}= ${signeAsurB} \\dfrac{${Math.abs(fractionAbsolue.num).toString() + miseEnEvidence('\\times  ' + k.toString())}}{${Math.abs(fractionAbsolue.den).toString() + miseEnEvidence('\\times  ' + k.toString())}}=${fraction.reduire(k).texFSD}\\quad$`
      if (ordreDesFractions) {
        texteCorr += `  et   $\\quad${fraction.reduire(k).texFSD} ${signe} ${autreFraction.texFSD} \\quad$ donc $\\quad ${fraction.texFSD} ${signe} ${autreFraction.texFSD}$.`
      } else {
        texteCorr += `  et   $\\quad${autreFraction.texFSD} ${signe2} ${fraction.reduire(k).texFSD} \\quad$ donc $\\quad ${autreFraction.texFSD} ${signe2} ${fraction.texFSD} $.`
      }
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: 'comparer les fractions suivantes : ' + (ordreDesFractions ? `$${fraction.texFSD} \\quad$ et $\\quad ${autreFraction.texFSD}$` : `$${autreFraction.texFSD} \\quad$ et $\\quad ${fraction.texFSD}$`),
          propositions: [
            {
              texte: ordreDesFractions ? `$${fraction.texFSD} < ${autreFraction.texFSD}$` : `$${autreFraction.texFSD} < ${fraction.texFSD}$`,
              statut: ordreDesFractions ? ecart > 0 : ecart < 0
            },
            {
              texte: ordreDesFractions ? `$${fraction.texFSD} > ${autreFraction.texFSD}$` : `$${autreFraction.texFSD} >${fraction.texFSD}$`,
              statut: ordreDesFractions ? ecart < 0 : ecart > 0
            }
          ],
          options: { ordered: false }
        }
      } else {
        handleAnswers(this, i, { champ1: { value: ordreDesFractions ? signe : signe2, compare: textCompare } }, { formatInteractif: 'fillInTheBlank' })
      }
      /*
      if (this.interactif && !context.isAmc) {
        texte = propositionsQcm(this, i).texte
      }
 */
      if (this.questionJamaisPosee(i, fractionAbsolue.num, fractionAbsolue.den, k)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      if (!context.isHtml) {
        this.canEnonce = 'Compléter avec $>$ ou $<$.<br>'
        this.correction = this.listeCorrections[0]
        if (ordreDesFractions === 1) {
          this.canReponseACompleter = `$${fraction.texFSD}\\ldots${autreFraction.texFSD}$`
        } else {
          this.canReponseACompleter = `$${autreFraction.texFSD} \\ldots${fraction.texFSD}$`
        }
      }
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque questions.
  }
  this.besoinFormulaireNumerique = ['Valeur maximale du coefficient multiplicateur', 99999]
  this.besoinFormulaire2CaseACocher = ['Inclure des nombres négatifs']
}
