import { choice } from '../../lib/outils/arrayOutils'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { listeQuestionsToContenu } from '../../modules/outils.js'

import Exercice from '../deprecatedExercice.js'

import comprendreScriptMultiples from './3I12-2.js'
import completerScriptDiviseurs from './3I12-3.js'
import comprendreScriptListeMultiples from './3I12-4.js'
import completerScriptMultiple from './3I12-1.js'
export const titre = 'Différents exercices d\'algorithmique'
export const uuid = 'f56d8'

export default function ExosScratch () {
  Exercice.call(this)
  this.nbQuestions = 5
  this.typeExercice = 'Scratch'
  this.nbCols = 2
  this.nbColsCorr = 1
  const listeExos = [completerScriptMultiple, comprendreScriptMultiples, completerScriptDiviseurs, comprendreScriptListeMultiples]
  const listeParams = [
    [ // paramExo1 dans l'ordre : sup, sup2,sup3,sup4,nbQuestions
      ['1-2-3-4', '1-2', '1-2', 1, 1], ['1-4', '1-2-3', '1-2', 2, 1]
    ],
    [ // paramExo2
      ['1-2-3-4', '1-2', '1-2', 1, 1], ['1-4', '1-2-3', '1-2', 2, 1]
    ],
    [ // paramExo3
      ['1-2-3-4', 3, '1-2-3', '1-2', 1]
    ],
    [ // paramExo4
      ['1-2-3-4', '1-2', '1-2', false, 1]
    ]
  ]
  this.nouvelleVersion = function () {
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const choix = i % 4
      const exo = new listeExos[choix]()
      const paramExo = choice(listeParams[choix]);
      [exo.sup, exo.sup2, exo.sup3, exo.sup4, exo.nbQuestions] = paramExo
      exo.nouvelleVersion()

      if (this.questionJamaisPosee(i, choix, exo.listeQuestions[0])) {
        let questions = ''
        let corrections = ''
        for (let j = 0; j < exo.nbQuestions; j++) {
          questions += j === 0 ? texteEnCouleurEtGras(exo.consigne, 'black') + '<br>' : ''
          questions += exo.listeQuestions[j] + '<br>'
          corrections += exo.listeCorrections[j] + '<br>'
        }
        this.listeQuestions.push(questions)
        this.listeCorrections.push(corrections)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
