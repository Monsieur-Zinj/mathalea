import { courbeSpline } from '../../../lib/2d/courbes.js'
import { droiteParPointEtPente } from '../../../lib/2d/droites.js'
import { point } from '../../../lib/2d/points.js'
import { repere } from '../../../lib/2d/reperes.js'
import { splineCatmullRom } from '../../../lib/mathFonctions/SplineCatmullRom.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'

export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Reconnaître sur un graphique une situation de proportionnalité ou de non proportionnalité'
export const dateDePublication = '23/01/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '23/01/2021' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
/**
 * @author Guillaume Valmont
 */
export const uuid = '8171f'
export const ref = 'can4P05'
export const refs = {
  'fr-fr': ['can4P05'],
  'fr-ch': []
}
export default function ImageSpline () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const r = repere({ xMin: -7, xMax: 7, yMin: -6, yMax: 6 })
    let c
    const type = choice(['lineaire', 'affine', 'autre'])
    switch (type) {
      case 'lineaire': {
        const pente = (randint(-15, 15, 0)) / 5
        const OrdX0 = 0
        c = droiteParPointEtPente(point(0, OrdX0), pente, '', 'blue')
        this.reponse = 'oui'
        this.correction = 'C\'est une droite qui passe par l\'origine.<br>Ce graphique représente donc une situation de proportionnalité.'
      }
        break
      case 'affine': {
        const pente = (randint(-15, 15, 0)) / 5
        this.lineaire = false
        const OrdX0 = randint(Math.round(-1 + pente), Math.round(1 + pente), [pente, 0])
        c = droiteParPointEtPente(point(0, OrdX0), pente, '', 'blue')
        this.reponse = 'non'
        this.correction = 'C\'est bien une droite mais elle ne passe pas par l\'origine.<br>Ce graphique ne représente donc pas une situation de proportionnalité.'
      }
        break
      default: {
        const Y = []
        for (let x = -1; x <= 1; x++) {
          Y[x + 1] = randint(-4, 4)
        }
        const f = splineCatmullRom({ tabY: Y, x0: -6, step: 6 })
        c = courbeSpline(f, { repere: r, step: 0.1, color: 'blue', xMin: -6, xMax: 6, traceNoeuds: false })
        this.reponse = 'non'
        this.correction = 'Ce n\'est pas une droite.<br>Ce graphique ne représente donc pas une situation de proportionnalité.'
      }
        break
    }
    this.question = `Ce graphique représente-t-il une situation de proportionnalité ?<br>
    
    ${mathalea2d({ xmin: -7, xmax: 7, ymin: -6, ymax: 6, pixelsParCm: 17, style: 'margin: auto', scale: 0.6 }, r, c)}`
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
