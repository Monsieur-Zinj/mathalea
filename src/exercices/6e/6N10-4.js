import { choice } from '../../lib/outils/arrayOutils'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { textWithSpacesCompare } from '../../lib/interactif/comparisonFunctions'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
export const titre = 'Écrire correctement les grands nombres entiers'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'

/**
 * Supprimer les zéros inutiles, séparer les classes d'un nombre entier.
 * @author Jean-Claude Lhote
 * 6N10-4
 * Relecture : Novembre 2021 par EE
 */
export const uuid = 'dc348'
export const ref = '6N10-4'
export const refs = {
  'fr-fr': ['6N10-4'],
  'fr-ch': []
}
export default function ÉcrireNombresEntiersFormates () {
  Exercice.call(this)
  this.nbQuestions = 5
  this.nbCols = 1
  this.nbColsCorr = 1

  this.nouvelleVersion = function () {
    this.consigne = 'Écrire les nombres en chiffres en supprimant les zéros inutiles et en séparant les classes.'
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    function zeroSuperflus (n) {
      const nzero = randint(0, 2); let nombrestring = n.toString()
      for (let k = 0; k < nzero; k++) nombrestring = '0' + nombrestring
      return nombrestring
    }
    for (
      let i = 0, texte, texteCorr, a, b, c, nombre, tranche, nombrestring, cpt = 0;
      i < this.nbQuestions && cpt < 50;

    ) {
      nombre = 0
      tranche = []
      while (nombre === 0) {
        tranche.splice(0)
        for (let j = 0; j < 3; j++) {
          a = randint(1, 9)
          b = randint(1, 9)
          c = randint(1, 9)
          tranche.push(choice([0, 100, 20, 80, a, a * 100, a * 100 + b * 10 + c, a * 100 + 80 + b, a * 10, a * 100 + b * 10 + 1]))
        }
        for (let j = 0; j < 3; j++) {
          nombre += tranche[j] * 10 ** (j * 3)
        }
        if (tranche[2] === 0) nombre = 0
      }
      nombrestring = zeroSuperflus(nombre)
      texte = `$${nombrestring}$` + ajouteChampTexteMathLive(this, i, 'inline largeur25 alphanumericAvecEspace', { texteAvant: '$=$', tailleExtensible: true })
      if (context.vue !== 'diap') texteCorr = `$${nombrestring}$ s'écrit plus lisiblement $${texNombre(nombre, 0)}$.`
      else texteCorr = `${texNombre(nombre, 0)}`
      if (context.isAmc) {
        this.autoCorrection[i] =
        {
          enonce: texte + '<br>',
          propositions: [
            {
              texte: texteCorr,
              statut: 1, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
              sanscadre: true
            }
          ]
        }
      } else {
        handleAnswers(this, i, { reponse: { value: stringNombre(nombre, 0), compare: textWithSpacesCompare } }, { formatInteractif: 'calcul' })
      }

      if (this.questionJamaisPosee(i, nombre)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
