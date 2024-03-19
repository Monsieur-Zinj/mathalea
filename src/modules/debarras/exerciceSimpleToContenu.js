import { context } from '../context.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { nombreDeChiffresDansLaPartieDecimale, nombreDeChiffresDe } from '../../lib/outils/nombres.js'
import { listeQuestionsToContenu } from '../outils.js'

export function exerciceSimpleToContenu (exercice) {
  const listeQuestions = []
  const listeCorrections = []
  for (let i = 0, cpt = 0; i < exercice.nbQuestions && cpt < 50; cpt++) {
    if (exercice.questionJamaisPosee(i, exercice.question)) {
      if (context.isAmc) {
        listeQuestions.push(exercice.question + '<br>')
        listeCorrections.push(exercice.correction)
      } else {
        listeQuestions.push(exercice.question)
        listeCorrections.push(exercice.correction)
      }
      if (context.isAmc && exercice.amcType === 'AMCNum') {
        setReponse(exercice, i, exercice.reponse, {
          digits: nombreDeChiffresDe(exercice.reponse, 'aucune'),
          decimals: nombreDeChiffresDansLaPartieDecimale(exercice.reponse),
          signe: exercice.reponse < 0,
          approx: 0
        })
      }
      exercice.nouvelleVersionWrapper()
      i++
    }
  }
  exercice.listeQuestions = listeQuestions
  exercice.listeCorrections = listeCorrections
  listeQuestionsToContenu(exercice)
}
