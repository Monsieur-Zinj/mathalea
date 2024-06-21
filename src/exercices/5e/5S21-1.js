/* eslint-disable camelcase */

import { choice } from '../../lib/outils/arrayOutils'
import { numAlpha, sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
export const titre = 'Trouver des probabilités simples'
export const dateDePublication = '01/05/2021'
export const interactifReady = true 
export const interactifType = 'mathLive'
/**
 * Description didactique de l'exercice
 * @author Rémi Angot et Matthieu Devillers
*/
export const uuid = '850b0'
export const ref = '5S21-1'
export const refs = {
  'fr-fr': ['5S21-1'],
  'fr-ch': ['11NO2-7']
}
export default function ProbabilitesSimples () {
  Exercice.call(this)
  this.nbQuestions = 3
  this.nbCols = 2 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  // this.sup = 1  // Niveau de difficulté
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    for(let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50 ; i++) { 
      let texte, texteCorr 

    const pG = randint(20, 60) // pG est un pourcentage
    const pN = randint(10, 100 - pG - 10)
    // const pP = 100 - pG - pN
    const sport = choice(['hand-ball', 'football', 'rugby', 'basket', 'volley-ball', 'water-polo', 'baseball'])
    texte = `Lors d'un match de ${sport}, l'équipe qui reçoit un adversaire a une probabilité de $ ${texNombre(pG / 100)}$ de gagner son match`
    texte += ` et $${texNombre(pN / 100)}$ de faire un match nul.<br>`

    texte += `${numAlpha(0)}Quelle est la probabilité, pour cette équipe, de ne pas perdre le match ?` + ajouteChampTexteMathLive(this, 2*i, 'inline largeur01')
    let correction1 = 'Ne pas perdre un match, c\'est, soit le gagner, soit faire un match nul. La probabilité est donc : <br> <br>'
    correction1 += `P(«${sp(1)}Ne pas perdre le match${sp(1)}») $=$ P(«${sp(1)}Gagner le match${sp(1)}») + P(«${sp(1)}Match nul${sp(1)}») <br>`
    correction1 += `P(«${sp(1)}Ne pas perdre le match${sp(1)}») $= ${texNombre(pG / 100)} + ${texNombre(pN / 100)}$ <br> `
    const reponse1 = texNombre((pG + pN) / 100)
    correction1 += `P(«${sp(1)}Ne pas perdre le match${sp(1)}») $= ${reponse1}$  <br>`
    texte += `<br><br>${numAlpha(1)}Quelle est la probabilité, pour cette équipe, de perdre le match ?` + ajouteChampTexteMathLive(this, 2*i+1, 'inline largeur01')
    let correction2 = `L'évènement  «${sp(1)}Perdre le match${sp(1)}» est l'évènement contraire de  «${sp(1)}Ne pas perdre le match${sp(1)}». On peut donc affirmer que : <br> <br>`
    correction2 += `P(«${sp(1)}Perdre le match${sp(1)}») $+$ P(«${sp(1)}Ne pas perdre le match${sp(1)}») $= 1$ <br>`
    correction2 += `P(«${sp(1)}Perdre le match${sp(1)}») $=1-$ P(«${sp(1)}Ne pas perdre le match${sp(1)}»)<br>`
    correction2 += `P(«${sp(1)}Perdre le match${sp(1)}») $=1-${texNombre((pG + pN) / 100)}$<br>`
    const reponse2 = texNombre(1 - (pG + pN) / 100)
    correction2 += `P(«${sp(1)}Perdre le match${sp(1)}») $=${reponse2}$<br>`
    if(this.questionJamaisPosee(i, pG)){
      handleAnswers(this, 2*i, {reponse : {value : reponse1, compare : fonctionComparaison}})
      handleAnswers(this, 2*i+1, {reponse : {value : reponse2, compare : fonctionComparaison}})
      this.listeQuestions.push(texte)
      this.listeCorrections.push(correction1, correction2)
    }
    }
    listeQuestionsToContenu(this)
  }
}
