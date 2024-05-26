import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
// import { modalUrl } from '../../lib/outils/modales.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { contraindreValeur, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Decimal from 'decimal.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'

export const titre = 'Lier un coefficient multiplicateur d\'une variation à un pourcentage et réciproquement'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Déterminer le coefficient de proportionnalité associé à une évolution en pourcentage ou l'inverse
 * @author Rémi Angot
 */
export const uuid = '4ce2d'
export const ref = '3P10-1'
export const refs = {
  'fr-fr': ['3P10-1'],
  'fr-ch': ['10FA4-6']
}
export default function CoefficientEvolution () {
  Exercice.call(this)
  this.consigne = 'Compléter.'
  this.nbQuestions = 4
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 1

  // this.nouvelleVersion = function (numeroExercice) {
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    // this.boutonAide = modalUrl(numeroExercice, 'https://coopmaths.fr/aide/3P10/')
    let typesDeQuestionsDisponibles = []
    this.sup = contraindreValeur(1, 3, this.sup, 1)
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = ['coef+', 'coef-']
      this.introduction = this.interactif ? '<em>Il faut saisir un nombre décimal.</em>' : ''
    } else if (this.sup === 2) {
      typesDeQuestionsDisponibles = ['taux+', 'taux-']
      this.introduction = this.interactif ? '<em>Il faut saisir une réponse de la forme +10% ou -10%.</em>' : ''
    } else {
      typesDeQuestionsDisponibles = ['coef+', 'coef-', 'taux+', 'taux-']
      this.introduction = this.interactif ? '<em>Il faut saisir un nombre décimal ou une réponse de la forme +10% ou -10%.</em>' : ''
    }
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    for (let i = 0, texte, texteCorr, reponse, taux, coeff, cpt = 0; i < this.nbQuestions && cpt < 100;) {
      taux = choice([randint(1, 19) * 10, randint(1, 29, [10, 20])])
      switch (listeTypeDeQuestions[i]) {
        case 'coef+':
          texte = `Augmenter de $${taux}~\\%$ revient à multiplier par `
          coeff = texNombre(1 + taux / 100, 2)
          texteCorr = `Augmenter de $${taux}~\\%$ revient à multiplier par $${miseEnEvidence(coeff)}$ car $100~\\% + ${taux}~\\% = ${100 + taux}~\\%$.`
          reponse = new Decimal(taux).div(100).add(1)
          setReponse(this, i, reponse, { formatInteractif: 'calcul' })

          break
        case 'coef-':
          texte = `Diminuer de $${taux}~\\%$ revient à multiplier par `
          coeff = texNombre(1 - taux / 100, 2)
          texteCorr = `Diminuer de $${taux}~\\%$ revient à multiplier par $${miseEnEvidence(coeff)}$ car $100~\\% - ${taux}~\\% = ${100 - taux}~\\%$.`
          reponse = new Decimal(-taux).div(100).add(1)
          setReponse(this, i, reponse, { formatInteractif: 'calcul' })

          break
        case 'taux+':
          coeff = texNombre(1 + taux / 100, 2)
          texte = this.interactif ? `Multiplier par $${coeff}$ revient à faire ` : `Multiplier par $${coeff}$ revient à `
          texteCorr = `Multiplier par $${coeff}$ revient à ${texteEnCouleurEtGras('augmenter de ', 'blue')} $${miseEnEvidence(`${taux}~\\%`, 'blue')}$  car $${coeff} = ${100 + taux}~\\% = 100~\\% ${miseEnEvidence(`+ ${taux}~\\%`)}$.`
          reponse = `+${taux}\\%`
          setReponse(this, i, reponse, { formatInteractif: 'texte' })

          break
        case 'taux-':
          coeff = texNombre(1 - taux / 100, 2)
          texte = this.interactif ? `Multiplier par $${coeff}$ revient à faire ` : `Multiplier par $${coeff}$ revient à `
          texteCorr = `Multiplier par $${coeff}$ revient à ${texteEnCouleurEtGras('diminuer de ', 'blue')} $${miseEnEvidence(`${taux}~\\%`, 'blue')}$ car $${coeff} = ${100 - taux}~\\% = 100~\\% ${miseEnEvidence(`- ${taux}~\\%`)}$.`
          reponse = `-${taux}\\%`
          setReponse(this, i, reponse, { formatInteractif: 'texte' })
          break
      }
      texte += this.interactif ? ajouteChampTexteMathLive(this, i) : '...'
      if (this.questionJamaisPosee(i, taux)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, '1 : Déterminer le coefficient\n2 : Exprimer une variation en pourcentage\n3 : Mélange']
}
