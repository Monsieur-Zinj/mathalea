import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { propositionsQcm } from '../../lib/interactif/qcm'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { choice } from '../../lib/outils/arrayOutils'
import { gestionnaireFormulaireTexte, randint } from '../../modules/outils'
import Exercice from '../Exercice'

export const interactifReady = true
export const dateDePublication = '17/08/2024'
export const interactifType = 'mathLive'
export const titre = 'Angles et vocabulaire'
export const uuid = 'ed9f4'
export const refs = {
  'fr-fr': ['5G30-0'],
  'fr-ch': []
}
/**
 * Utiliser le vocabulaire complémentaires et supplémentaires pour qualifier des paires d'angles ou calculer des mesures d'angles
 * @author Jean-Claude Lhote
 */
export default class AnglesEtVocabulaire extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 5
    this.besoinFormulaireTexte = [
      'Type de questions (nombre séparés par des tirets)',
      '1 : Qcm vocabulaire\n2 : Calculer le complémentaire\n3 : Calculer le supplémentaire\n4 : Mélange'
    ]
  }

  nouvelleVersion () {
    this.reinit()
    const listeTypesDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 3,
      defaut: 4,
      melange: 4,
      nbQuestions: this.nbQuestions
    })
    for (let i = 0; i < this.nbQuestions;) {
      let a = randint(1, 89)
      let b: number
      let texte: string
      let texteCorr: string
      let goodAnswer: string
      switch (listeTypesDeQuestions[i]) {
        case 1:
          {
            const choix = randint(1, 3)
            switch (choix) {
              case 1: // ni l'un ni l'autre
                b = randint(1, 89, [90 - a, 180 - a])
                goodAnswer = 'aucun'
                break
              case 2: // complémentaires
                b = 90 - a
                goodAnswer = 'complémentaires'
                break
              default: // supplémentaires
                b = 180 - a
                goodAnswer = 'supplémentaires'
            }
            texte = `L'angle $\\widehat{xOy}$ mesure $${a}^\\circ$ et l'angle $\\widehat{yOz}$ mesure $${b}^\\circ$ que sont-ils l'un pour l'autre ?`
            this.autoCorrection[i] = {
              propositions: [
                {
                  texte: 'complémentaires',
                  statut: goodAnswer === 'complémentaires'
                },
                {
                  texte: 'supplémentaires',
                  statut: goodAnswer === 'supplémentaires'
                },
                {
                  texte: "ni l'un, ni l'autre",
                  statut: goodAnswer === 'aucun'
                }
              ],
              options: {
                ordered: true
              }
            }
            const monQcm = propositionsQcm(this, i)
            texte += monQcm.texte
            texteCorr = `$\\widehat{xOy}+\\widehat{yOz}=${a}^\\circ+${b}^\\circ=${a + b}^\\circ$.<br>`
            texteCorr +=
              'Les deux angles ne sont ni complémentaires ni supplémentaires.'
          }
          break
        case 2:
          b = 90 - a
          texte = `L'angle $\\widehat{xOy}$ mesure $${a}^\\circ$. Combien mesure l'angle $\\widehat{yOz}$ s'ils sont complémentaires l'un de l'autre ?`
          texteCorr = `Deux angles complémentaires sont deux angles dont la somme vaut $90^\\circ$. Alors $\\widehat{yOz}=90^\\circ-${a}^\\circ=${90 - a}^\\circ$`
          goodAnswer = `${90 - a}^\\circ`
          break

        default:
          a = 2 * a + choice([0, 1]) // Ainsi, on peut avoir a>90
          b = 180 - a
          texte = `L'angle $\\widehat{xOy}$ mesure $${a}^\\circ$. Combien mesure l'angle $\\widehat{yOz}$ s'ils sont supplémentaires l'un de l'autre ?`
          texteCorr = `Deux angles supplémentaires sont deux angles dont la somme vaut $180^\\circ$. Alors $\\widehat{yOz}=180^\\circ-${a}^\\circ=${180 - a}^\\circ$`
          goodAnswer = `${180 - a}^\\circ`
          break
      }
      if (this.questionJamaisPosee(i, a, b, listeTypesDeQuestions[i])) {
        if (listeTypesDeQuestions[i] !== 1) {
          texte += ajouteChampTexteMathLive(
            this,
            i,
            ` ${KeyboardType.nombresEtDegre}`
          )
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (listeTypesDeQuestions[i] !== 1) {
          handleAnswers(
            this,
            i,
            {
              reponse: {
                value: goodAnswer,
                compare: fonctionComparaison,
                options: { unite: true }
              }
            },
            { formatInteractif: 'mathlive' }
          )
        }
        i++
      }
    }
  }
}
