import { randint } from '../../modules/outils'
import Exercice from '../Exercice'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureNombreRelatif } from '../../lib/outils/ecritures'
import type { MathfieldElement } from 'mathlive'
import { ComputeEngine } from '@cortex-js/compute-engine'
import { context } from '../../modules/context'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Transformer une soustraction en addition puis calculer'
export const dateDePublication = '13/11/2023'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Transformer une soustraction en addition puis calculer
 * @author Rémi Angot
 */
export const uuid = 'f2db1'
export const ref = '5R21-1'

type TypeQuestionsDisponibles = '+-' | '--' | '-+'
const ce = new ComputeEngine()

class SoustractionRelatifs extends Exercice {
  listeA: number[] = []
  listeB: number[] = []
  typeQuestionsDisponibles = ['+-', '--', '-+'] as TypeQuestionsDisponibles[]
  constructor () {
    super()
    this.nbQuestions = 5
  }

  nouvelleVersion (): void {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    const listeTypeQuestions = combinaisonListes(this.typeQuestionsDisponibles, this.nbQuestions) as TypeQuestionsDisponibles[]
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let a = randint(2, 10)
      let b = randint(2, 10)
      switch (listeTypeQuestions[i]) {
        case '+-':
          b *= -1
          break
        case '--':
          a *= -1
          b *= -1
          break
        case '-+':
          a *= -1
          break
      }
      this.listeA[i] = a
      this.listeB[i] = b
      texte = `$${ecritureNombreRelatif(a)} - ${ecritureNombreRelatif(b)}$`
      texteCorr = `$${ecritureNombreRelatif(a)} - ${ecritureNombreRelatif(b)} = ${miseEnEvidence(ecritureNombreRelatif(a))} + ${miseEnEvidence(ecritureNombreRelatif(-b))} = ${miseEnEvidence(ecritureNombreRelatif(a - b))}$`

      if (this.interactif) {
        texte = `<math-field readonly class="fillInTheBlanks" style="font-size:2em" id="champTexteEx${this.numeroExercice}Q${i}">
        ${ecritureNombreRelatif(a)} - ${ecritureNombreRelatif(b)} = (\\placeholder[place1]{}) + (\\placeholder[place2]{}) = \\placeholder[place3]{}
      </math-field><span class="ml-2" id="resultatCheckEx${this.numeroExercice}Q${i}"></span>`
      }

      if (this.questionJamaisPosee(i, a, b, listeTypeQuestions[i])) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: '',
            enonceAvant: false,
            propositions: [
              {
                type: 'AMCOpen',
                propositions: [{
                  enonce: this.titre + ' : ' + texte,
                  texte: texteCorr,
                  statut: 1,
                  pointilles: false
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: 'Résultat du calcul : ',
                    valeur: [a - b],
                    param: {
                      digits: 2,
                      decimals: 0,
                      signe: true,
                      approx: 0
                    }
                  }
                }]
              }
            ]
          }
        }
        i++
      }
      cpt++
    }
  }

  correctionInteractive = (i?: number) => {
    if (i === undefined) return ''
    if (this.answers === undefined) this.answers = {}
    let result: 'OK' | 'KO' = 'KO'
    const mf = document.querySelector(`#champTexteEx${this.numeroExercice}Q${i}`) as MathfieldElement
    this.answers[`Ex${this.numeroExercice}Q${i}`] = mf.getValue()
    const divFeedback = document.querySelector(`#resultatCheckEx${this.numeroExercice}Q${i}`) as HTMLDivElement
    const a = this.listeA[i]
    const b = this.listeB[i]
    const test1 = ce.parse(mf.getPromptValue('place1')).isSame(ce.parse(`${a}`))
    const test2 = ce.parse(mf.getPromptValue('place2')).isSame(ce.parse(`${-b}`))
    const test3 = ce.parse(mf.getPromptValue('place3')).isSame(ce.parse(`(${a - b})`)) || ce.parse(mf.getPromptValue('place3')).isSame(ce.parse(`${a - b}`))
    if (test1 && test2 && test3) {
      result = 'OK'
      divFeedback.innerHTML = '😎'
    } else {
      divFeedback.innerHTML = '☹️'
    }
    if (!test1) {
      mf.setPromptState('place1', 'incorrect', true)
    } else {
      mf.setPromptState('place1', 'correct', true)
    }
    if (!test2) {
      mf.setPromptState('place2', 'incorrect', true)
    } else {
      mf.setPromptState('place2', 'correct', true)
    }
    if (!test3) {
      mf.setPromptState('place3', 'incorrect', true)
    } else {
      mf.setPromptState('place3', 'correct', true)
    }
    return result
  }
}

export default SoustractionRelatifs
