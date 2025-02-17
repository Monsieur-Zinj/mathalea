import { enleveElement } from '../../../lib/outils/arrayOutils'
import { context } from '../../../modules/context.js'
import { propositionsQcm } from '../../../lib/interactif/qcm.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Trouver la bonne unité'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'qcmMono'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6M02
 */
export const uuid = 'ac56a'
export const ref = 'can6M02'
export const refs = {
  'fr-fr': ['can6M02'],
  'fr-ch': []
}
export default function LaBonneUnite () {
  Exercice.call(this)
  this.nbQuestions = 1

  const hauteurs = [
    ['chaise', 75, 115, ' cm'],
    ['grue', 120, 250, ' dm'],
    ['tour', 50, 180, ' m'],
    ['girafe', 40, 50, ' dm'],
    ['coline', 75, 150, ' m']
  ]
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const unites = [' cm', ' dm', ' m']
      const a = randint(0, 4)
      const b = randint(hauteurs[a][1], hauteurs[a][2])
      enleveElement(unites, hauteurs[a][3])
      let texte = `Choisir parmi les propositions suivantes la hauteur d'une ${hauteurs[a][0]}.<br>`
      this.canEnonce = texte
      this.autoCorrection[i] = {
        enonce: texte,
        propositions: [
          {
            texte: `$${b}$${hauteurs[a][3]}`,
            statut: true
          },
          {
            texte: `$${b}$${unites[0]}`,
            statut: false
          },
          {
            texte: `$${b}$${unites[1]}`,
            statut: false
          }
        ]
      }
      const monQcm = propositionsQcm(this, i)
      if (!context.isAmc) {
        texte += monQcm.texte
      }
      const texteCorr = `La hauteur d'une ${hauteurs[a][0]} est ${b} ${hauteurs[a][3]}.`
      if (this.questionJamaisPosee(i, a, b)) {
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
