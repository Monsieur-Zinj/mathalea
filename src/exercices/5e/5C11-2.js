import { context } from '../../modules/context.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { prenom } from '../../lib/outils/Personne'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import TrouverSolutionMathador from './_TrouverSolutionMathador.js'
import Exercice from '../deprecatedExercice.js'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
export const amcReady = true
export const amcType = 'AMCOpen'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Traduire une succession d\'opérations par une expression'

/**
 * Transformer un programme de calcul avec les 4 opérations dans un ordre aléatoire en un seul calcul.
 * @author Jean-Claude Lhote
 * Référence 5C11-2
 */
export const uuid = '3406a'
export const ref = '5C11-2'
export const refs = {
  'fr-fr': ['5C11-2'],
  'fr-ch': ['9NO6-3']
}
export default function ÉcrireUneExpressionMathador () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 4
  this.nbCols = 1
  this.nbColsCorr = 1

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    let expression, calculsSuccessifs, tirage, cible, solutionMathador, quidam
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // traduire un calcul mathador
      solutionMathador = TrouverSolutionMathador(30, 90)
      tirage = solutionMathador[0]
      cible = solutionMathador[1]
      calculsSuccessifs = solutionMathador[2]
      expression = solutionMathador[3]
      quidam = prenom()
      texte = `${quidam} a trouvé une solution mathador pour le tirage suivant $${tirage[0]}~;~${tirage[1]}~;~${tirage[2]}~;~${tirage[3]}~;~${tirage[4]}$ et pour la cible $${cible}$, voici ses calculs :<br>`
      for (let j = 0; j < 4; j++) {
        texte += `$${calculsSuccessifs[j]}$<br>`
      }
      texte += 'Écrire cette succession d\'opérations en une seule expression.' + ajouteChampTexteMathLive(this, i, 'inLine largeur10 nospacebefore', { texteAvant: '$E=$' })
      // texte += ajouteFeedback(this, i) // le feedback de fonctionComparaison avec cette option n'est pas adapté.
      texteCorr = `L'expression correspondante au calcul de ${quidam} est :<br>$${miseEnEvidence(expression)}$ ou $${miseEnEvidence(solutionMathador[4])}$.`
      handleAnswers(this, i, { reponse: { value: [expression, solutionMathador[4]], compare: fonctionComparaison, options: { operationSeulementEtNonCalcul: true } } })
      if (context.isAmc) {
        this.autoCorrection[i] =
        {
          enonce: texte,
          propositions: [
            {
              texte: texteCorr,
              statut: 1, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
              sanscadre: false, // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
              pointilles: false // EE : ce champ est facultatif et permet (si false) d'enlever les pointillés sur chaque ligne.
            }
          ]
        }
      }

      if (this.listeQuestions.indexOf(texte) === -1) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
