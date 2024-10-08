import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { sp } from '../../lib/outils/outilString.js'
import { puissanceEnProduit } from '../../lib/outils/puissance'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Decimal from 'decimal.js'
import { handleAnswers, setReponse } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const dateDeModifImportante = '16/09/2024'
export const titre = 'Donner l\'écriture décimale d\'une puissance de 10'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * Donner l'écriture décimale d'une puissance de 10
 * @author Rémi Angot
 */
export const uuid = '93df9'
export const ref = '4C30-2'
export const refs = {
  'fr-fr': ['4C30-2'],
  'fr-ch': ['10NO2-4']
}
export default function EcritureDecimalePuissanceDe10 () {
  Exercice.call(this)
  this.nbQuestions = 8
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 3 // exposants positifs et négatifs par défaut

  this.nouvelleVersion = function () {
    this.consigne = this.nbQuestions === 1
      ? "Donner l'écriture décimale du nombre suivant."
      : "Donner l'écriture décimale des nombres suivants."

    let listeTypeDeQuestions
    if (this.sup === 1) {
      listeTypeDeQuestions = combinaisonListes(['+'], this.nbQuestions)
    }
    if (this.sup === 2) {
      listeTypeDeQuestions = combinaisonListes(['-'], this.nbQuestions)
    }
    if (this.sup === 3) {
      listeTypeDeQuestions = combinaisonListes(['+', '-'], this.nbQuestions)
    }
    for (let i = 0, texte, texteCorr, n, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (listeTypeDeQuestions[i]) {
        case '+':
          n = randint(1, 10)
          texte = this.interactif
            ? `$10^{${n}}${sp()}=$` + ajouteChampTexteMathLive(this, i, 'largeur01 inline')
            : `$10^{${n}}${sp()}=${sp()}\\dots$`
          setReponse(this, i, Decimal.pow(10, n))
          if (n < 2) {
            texteCorr = `$10^${n}=${10 ** n}$`
          } else {
            if (context.isHtml) {
              texteCorr = `$10^{${n}}=${puissanceEnProduit(10, n)}=${miseEnEvidence(texNombre(10 ** n, 0))}$`
            } else {
              texteCorr = `$10^{${n}}=${miseEnEvidence(texNombre(10 ** n, 0))}$`
            }
          }
          break
        case '-':
          n = randint(1, 10)
          texte = this.interactif
            ? `$10^{${-n}}${sp()}=$` + ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore')
            : `$10^{${-n}}${sp()}=${sp()}\\dots$`
          handleAnswers(this, i, { reponse: { value: texNombre(Decimal.pow(10, -n), n), compare: fonctionComparaison, options: { nombreDecimalSeulement: true } } })
          if (context.isHtml) {
            texteCorr = `$10^{${-n}}=\\dfrac{1}{10^{${n}}}=\\dfrac{1}{${puissanceEnProduit(10, n)}}=\\dfrac{1}{${texNombre(10 ** n, 0)}}=${miseEnEvidence(texNombre(Decimal.pow(10, -n), n))}$`
          } else {
            texteCorr = `$10^{${-n}}=\\dfrac{1}{10^{${n}}}=\\dfrac{1}{${texNombre(10 ** n, 0)}}=${miseEnEvidence(texNombre(Decimal.pow(10, -n), n))}$`
          }
          break
      }

      if (this.questionJamaisPosee(i, n, listeTypeDeQuestions[i])) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, '1 : Exposants positifs\n2 : Exposants négatifs\n3 : Mélange']
}
