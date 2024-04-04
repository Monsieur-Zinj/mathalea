import { combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu } from '../../modules/outils.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import type { MathfieldElement } from 'mathlive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { context } from '../../modules/context'

export const titre = 'Connaître les tables de multiplications « à l\'envers »'
export const dateDePublication = '4/4/2024'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ac64a'
export const refs = {
  'fr-fr': ['6C10-9'],
  'fr-ch': []
}

/**
 * @author Rémi Angot
*/

export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 10
    this.sup = '3-4-5-6-7-8-9'
    this.comment = 'Un  des facteurs est issue des tables choisies l\'autre est compris entre 2 et 9'
  }

  nouvelleVersion () {
    this.consigne = 'Compléter avec deux nombres entiers différents de 1.'
    this.besoinFormulaireTexte = ['Tables de multiplication (séparés par un tiret)', '']
    // @ts-expect-error Il faut typer gestionnaireFormulaireTexte
    const tables = gestionnaireFormulaireTexte({
      nbQuestions: this.nbQuestions,
      saisie: this.sup,
      defaut: 9,
      max: 9,
      min: 2,
      enleveDoublons: true
    }) as number[]
    const facteurs = [2, 3, 4, 5, 6, 7, 8, 9]
    const facteurs1 = combinaisonListes(tables, this.nbQuestions)
    const facteurs2 = combinaisonListes(facteurs, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const a = facteurs1[i]
      const b = facteurs2[i]
      console.log(this.interactif)
      let texte = ''
      if (context.isDiaporama) {
        this.consigne = ''
      }
      if (this.interactif) {
        texte = remplisLesBlancs(this, i, `${a * b}= ~ %{champ1} ~ \\times ~~ %{champ2}`, KeyboardType.clavierNumbers as string)
        handleAnswers(this, i,
          {
            // bareme: (listePoints) => [listePoints[0] * listePoints[1] + listePoints[2], 2],
            champ1: { value: '' },
            champ2: { value: '' },
            callback: (exercice: Exercice, question: number) => {
              const mfe = document.querySelector(`#champTexteEx${exercice.numeroExercice}Q${question}`) as MathfieldElement
              if (mfe == null) return { isOk: false, score: { nbBonnesReponses: 0, nbReponses: 0 } }
              const facteur1 = Number(mfe.getPromptValue('champ1') || 0)
              const facteur2 = Number(mfe.getPromptValue('champ2') || 0)
              const isOk = (facteur1 * facteur2 === a * b && facteur1 !== 1 && facteur2 !== 1)
              if (isOk) {
                mfe.setPromptState('champ1', 'correct', true)
                mfe.setPromptState('champ2', 'correct', true)
              } else {
                if ((a * b) % facteur1 === 0 && facteur1 !== 1) {
                  mfe.setPromptState('champ1', 'correct', true)
                  mfe.setPromptState('champ2', 'incorrect', false)
                } else if ((a * b) % facteur2 === 0 && facteur2 !== 1) {
                  mfe.setPromptState('champ1', 'incorrect', false)
                  mfe.setPromptState('champ2', 'correct', true)
                } else {
                  mfe.setPromptState('champ1', 'incorrect', false)
                  mfe.setPromptState('champ2', 'incorrect', false)
                }
              }
              const spanReponseLigne = document.querySelector(`#resultatCheckEx${exercice.numeroExercice}Q${question}`)
              if (spanReponseLigne != null) {
                spanReponseLigne.innerHTML = isOk ? '😎' : '☹️'
              }
              return { isOk, score: { nbBonnesReponses: (isOk ? 1 : 0), nbReponses: 1 } }
            }
          }

        )
      } else {
        texte = `$${a * b}= \\quad \\times \\quad$`
      }
      const texteCorr = `$${a * b}=${a} \\times ${b}$`

      if (this.questionJamaisPosee(i, a * b)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
