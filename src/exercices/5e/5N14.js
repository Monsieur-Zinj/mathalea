import { choice, combinaisonListes, enleveElement } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { obtenirListeFractionsIrreductibles } from '../../modules/fractions.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
export const interactifReady = true
export const interactifType = 'qcm'
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
export const ref = '5N14'
export default function ExerciceComparerDeuxFractions (max = 11) {
  Exercice.call(this) // Héritage de la classe Exercice()
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
      const ordreDesFractions = randint(1, 2)
      if (ordreDesFractions === 1) {
        texte = `$${fraction.texFSD} \\quad$ et $\\quad ${autreFraction.texFSD}$`
      } else {
        texte = `$${autreFraction.texFSD} \\quad$ et $\\quad ${fraction.texFSD}$`
      }
      if (!context.isHtml) {
        texte = texte.replace('\\quad$ et $\\quad', '\\ldots\\ldots\\ldots')
      }
      let signeAsurB
      if (fraction.signe < 0) signeAsurB = '-'
      else signeAsurB = ''
      texteCorr = `$${fraction.texFSD}= ${signeAsurB} \\dfrac{${Math.abs(fractionAbsolue.num).toString() + miseEnEvidence('\\times  ' + k.toString())}}{${Math.abs(fractionAbsolue.den).toString() + miseEnEvidence('\\times  ' + k.toString())}}=${fraction.reduire(k).texFSD}\\quad$`
      if (ordreDesFractions === 1) {
        texteCorr += `  et   $\\quad${fraction.reduire(k).texFSD} ${signe} ${autreFraction.texFSD} \\quad$ donc $\\quad ${fraction.texFSD} ${signe} ${autreFraction.texFSD}$ `
      } else {
        texteCorr += `  et   $\\quad${autreFraction.texFSD} ${signe2} ${fraction.reduire(k).texFSD} \\quad$ donc $\\quad ${autreFraction.texFSD} ${signe2} ${fraction.texFSD} $ `
      }
      this.autoCorrection[i] = {
        enonce: 'comparer les fractions suivantes : ' + (ordreDesFractions < 2 ? `$${fraction.texFSD} \\quad$ et $\\quad ${autreFraction.texFSD}$` : `$${autreFraction.texFSD} \\quad$ et $\\quad ${fraction.texFSD}$`),
        propositions: [
          {
            texte: ordreDesFractions < 2 ? `$${fraction.texFSD} < ${autreFraction.texFSD}$` : `$${autreFraction.texFSD} < ${fraction.texFSD}$`,
            statut: ordreDesFractions < 2 ? ecart > 0 : ecart < 0
          },
          {
            texte: ordreDesFractions < 2 ? `$${fraction.texFSD} > ${autreFraction.texFSD}$` : `$${autreFraction.texFSD} >${fraction.texFSD}$`,
            statut: ordreDesFractions < 2 ? ecart < 0 : ecart > 0
          }
        ],
        options: { ordered: false }
      }

      if (this.interactif && !context.isAmc) {
        texte = propositionsQcm(this, i).texte
      }
      if (this.listeQuestions.indexOf(texte) === -1) { // Si la question n'a jamais été posée, on en créé une autre
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
