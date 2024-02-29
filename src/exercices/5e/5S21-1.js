/* eslint-disable camelcase */

import { choice } from '../../lib/outils/arrayOutils'
import { sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
export const titre = 'Trouver des probabilités simples'
export const dateDePublication = '01/05/2021'
/**
 * Description didactique de l'exercice
 * @author Rémi Angot et Matthieu Devillers
*/
export const uuid = '850b0'
export const ref = '5S21-1'
export const refs = {
  'fr-fr': ['5S21-1'],
  'fr-ch': []
}
export default function ProbabilitesSimples () {
  Exercice.call(this)
  this.nbQuestionsModifiable = false
  this.nbCols = 2 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  // this.sup = 1  // Niveau de difficulté
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const pG = randint(20, 60) // pG est un pourcentage
    const pN = randint(10, 100 - pG - 10)
    // const pP = 100 - pG - pN
    const sport = choice(['hand-ball', 'football', 'rugby', 'basket', 'volley-ball', 'water-polo', 'baseball'])
    this.consigne = `Lors d'un match de ${sport}, l'équipe qui reçoit un adversaire a une probabilité de $ ${texNombre(pG / 100)}$ de gagner son match`
    this.consigne += ` et $${texNombre(pN / 100)}$ de faire un match nul.`

    const question1 = 'Quelle est la probabilité, pour cette équipe, de ne pas perdre le match ?'
    let correction1 = 'Ne pas perdre un match, c\'est, soit le gagner, soit faire un match nul. La probabilité est donc : <br> <br>'
    correction1 += `P(«${sp(1)}Ne pas perdre le match${sp(1)}») $=$ P(«${sp(1)}Gagner le match${sp(1)}») + P(«${sp(1)}Match nul${sp(1)}») <br>`
    correction1 += `P(«${sp(1)}Ne pas perdre le match${sp(1)}») $= ${texNombre(pG / 100)} + ${texNombre(pN / 100)}$ <br> `
    correction1 += `P(«${sp(1)}Ne pas perdre le match${sp(1)}») $= ${texNombre((pG + pN) / 100)}$  <br>`
    const question2 = 'Quelle est la probabilité, pour cette équipe, de perdre le match ?'
    let correction2 = `L'évènement  «${sp(1)}Perdre le match${sp(1)}» est l'évènement contraire de  «${sp(1)}Ne pas perdre le match${sp(1)}». On peut donc affirmer que : <br> <br>`
    correction2 += `P(«${sp(1)}Perdre le match${sp(1)}») $+$ P(«${sp(1)}Ne pas perdre le match${sp(1)}») $= 1$ <br>`
    correction2 += `P(«${sp(1)}Perdre le match${sp(1)}») $=1-$ P(«${sp(1)}Ne pas perdre le match${sp(1)}»)<br>`
    correction2 += `P(«${sp(1)}Perdre le match${sp(1)}») $=1-${texNombre((pG + pN) / 100)}$<br>`
    correction2 += `P(«${sp(1)}Perdre le match${sp(1)}») $=${texNombre(1 - (pG + pN) / 100)}$<br>`

    this.listeQuestions.push(question1, question2)
    this.listeCorrections.push(correction1, correction2)
    listeQuestionsToContenu(this)
  }
}
