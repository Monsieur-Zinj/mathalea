import Question1 from '../can/T1/canT1S01'
import Question2 from '../can/T1/canT1S02'
import Question3 from '../can/T1/canT1S03'
import Question4 from '../can/T1/canT1S04'
import Question5 from '../can/T1/canT1S05'
import Question6 from '../can/T1/canT1S06'
import Question7 from '../can/T1/canT1S07'


import MetaExercice from '../MetaExerciceCan.js'
import Exercice from '../Exercice'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'

export const titre = 'Limites de suites'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ff9d1'
export const refs = {
    'fr-fr': ['TS1-0'],
    'fr-ch': []
}
export const dateDePublication = '16/08/2024'

/**
 * compilation des cans de terminale sur les suites
 * @author Jean-Claude Lhote
*/

const exercices = [
    Question1,
    Question2,
    Question3,
    Question4,
    Question5,
    Question6,
    Question7
] as unknown

const questions = exercices as Exercice[]

export default class LimitesSuites extends Exercice {
    constructor() {
        super()
        this.nbQuestions = 5
    }
    nouvelleVersion() {
        this.reinit()
        const exos = combinaisonListes(questions, this.nbQuestions * 2)
        for (let i = 0, index = 0; i < this.nbQuestions;) {
            const Exo = exos[index]
            const question = new Exo
            question.nouvelleVersion()
            const texte = question.question as string
            const texteCorr = question.correction as string
            const reponse = question.reponse as string
            if (this.questionJamaisPosee(i, texte)) {
                this.listeQuestions.push(texte + ajouteChampTexteMathLive(this, i, 'inline ' + KeyboardType.lycee))
                this.listeCorrections.push(texteCorr)
                handleAnswers(this, i, { reponse: { value: reponse } })
                i++
            }
            index++
        }
    }
}