import { choice } from '../../../lib/outils/arrayOutils'
import { texteExposant } from '../../../lib/outils/ecritures'
import { texNombre } from '../../../lib/outils/texNombre'
import { context } from '../../../modules/context.js'
import { propositionsQcm } from '../../../lib/interactif/qcm.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Comparer des aires (V/F)'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'qcmMono'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6M01
 */
export const uuid = 'bae27'
export const ref = 'can6M08'
export const refs = {
  'fr-fr': ['can6M08'],
  'fr-ch': []
}
export default function QuestionDAires () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const a = randint(2, 9)
      const b = randint(2, 9, a)
      const c = randint(1, 3)
      let VF
      let texte
      if (choice([true, false])) {
        texte = `Est-il vrai qu'un carré de côté $${a}$ cm et un rectangle de largeur $${Math.min(a, b)}$ cm et de longueur $${Math.max(a, b)}$ cm ont une aire qui diffère de $${Math.max(a * a, a * b) - Math.min(a * a, a * b)}$ cm${texteExposant(2)} ?`
        this.canEnonce = texte
        VF = 'V'
      } else {
        VF = 'F'
        texte = `Est-il vrai qu'un carré de côté $${a}$ cm et un rectangle de largeur $${Math.min(a, b)}$ cm et de longueur $${Math.max(a, b)}$ cm ont une aire qui diffère de $${Math.max(a * a, a * b) - Math.min(a * a, a * b) + c}$ cm${texteExposant(2)} ?`
        this.canEnonce = texte
      }
      this.autoCorrection[i] = {
        enonce: texte,
        propositions: [
          {
            texte: 'Vrai',
            statut: VF === 'V'
          },
          {
            texte: 'Faux',
            statut: VF === 'F'
          }
        ]
      }
      const monQcm = propositionsQcm(this, i)
      if (!context.isAmc) {
        texte += monQcm.texte
      }
      let texteCorr = VF === 'V' ? 'Vrai' : 'Faux'
      texteCorr += `<br> $\\bullet$  le carré a une aire de $${a}\\times ${a}=${a * a}$ cm${texteExposant(2)}.<br>
    $\\bullet$  Le rectangle a une aire de $${a}\\times ${b}=${a * b}$ cm${texteExposant(2)}.`
      texteCorr += `<br>Ce qui fait ${VF === 'V' ? 'bien ' : ''} une différence de $${Math.max(a * a, a * b)} - ${Math.min(a * a, a * b)}=${Math.max(a * a, a * b) - Math.min(a * a, a * b)}$ cm${texteExposant(2)} ${VF === 'F' ? ' et non pas de ' + texNombre(Math.max(a * a, a * b) - Math.min(a * a, a * b) + c) + ' cm' + texteExposant(2) + '.' : '.'}`
      if (this.questionJamaisPosee(i, a, b, c)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(monQcm.texte)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
