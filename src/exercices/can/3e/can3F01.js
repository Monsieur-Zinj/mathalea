import { repere } from '../../../lib/2d/reperes.js'
import { texteParPosition } from '../../../lib/2d/textes.ts'
import { spline } from '../../../lib/mathFonctions/Spline.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const dateDeModifImportante = '26/10/2023'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Lire une image graphiquement'
/*!
 * @author Gilles Mora
  *
 * Référence can3F01
*/
export const uuid = '966a6'
export const ref = 'can3F01'
export const refs = {
  'fr-fr': ['can3F01'],
  'fr-ch': []
}
export default function ImageSpline () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 1
  this.formatChampTexte = 'largeur01 inline'
  this.nouvelleVersion = function () {
    const noeuds1 = [{ x: -4, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: -3, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: -2, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: -1, y: 2, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 0, y: 1, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 2, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 3, y: -2, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 4, y: 0, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: 5, y: 1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }
    ]
    const noeuds2 = [{ x: -4, y: 0, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: -3, y: 2, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: -2, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: -1, y: 2, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 0, y: 0, deriveeGauche: -1, deriveeDroit: -1, isVisible: true },
      { x: 2, y: -1, deriveeGauche: 0, deriveeDroit: 0, isVisible: true },
      { x: 3, y: 0, deriveeGauche: 2, deriveeDroit: 2, isVisible: true },
      { x: 4, y: 2, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: 5, y: 3, deriveeGauche: 0, deriveeDroit: 0, isVisible: true }
    ]
    const mesFonctions = [noeuds1, noeuds2]
    function aleatoiriseCourbe (listeFonctions) {
      const coeffX = choice([-1, 1]) // symétries ou pas
      const coeffY = choice([-1, 1])
      const deltaX = randint(-2, +2) // translations
      const deltaY = randint(-1, 1)// randint(-2, +2)
      const choix = choice(listeFonctions)
      return choix.map((noeud) => Object({
        x: (noeud.x + deltaX) * coeffX,
        y: (noeud.y + deltaY) * coeffY,
        deriveeGauche: noeud.deriveeGauche * coeffX * coeffY,
        deriveeDroit: noeud.deriveeDroit * coeffX * coeffY,
        isVisible: noeud.isVisible
      }))
    }
    let bornes = {}
    const antecedent = randint(0, 8)
    const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
    const nuage = aleatoiriseCourbe(mesFonctions)
    const theSpline = spline(nuage)
    this.spline = theSpline
    bornes = theSpline.trouveMaxes()
    const repere1 = repere({
      xMin: bornes.xMin - 1,
      xMax: bornes.xMax + 1,
      yMin: bornes.yMin - 1,
      yMax: bornes.yMax + 1,
      grilleX: false,
      grilleY: false,
      grilleSecondaire: true,
      grilleSecondaireYDistance: 1,
      grilleSecondaireXDistance: 1,
      grilleSecondaireYMin: bornes.yMin - 1,
      grilleSecondaireYMax: bornes.yMax + 1,
      grilleSecondaireXMin: bornes.xMin - 1,
      grilleSecondaireXMax: bornes.xMax + 1
    })
    const courbe1 = theSpline.courbe({
      repere: repere1,
      epaisseur: 1.5,
      ajouteNoeuds: true,
      optionsNoeuds: { color: 'blue', taille: 2, style: 'x', epaisseur: 2 },
      color: 'blue'
    })
    const objetsEnonce = [repere1, courbe1]

    this.reponse = theSpline.y[antecedent]
    this.question = `Quelle est l'image de $${theSpline.x[antecedent]}$ ?
    ` + mathalea2d(Object.assign({ pixelsParCm: 30, scale: 0.7, style: 'margin: auto' }, { xmin: bornes.xMin - 1, ymin: bornes.yMin - 1, xmax: bornes.xMax + 1, ymax: bornes.yMax + 1 }), objetsEnonce, o)// fixeBordures(objetsEnonce))
    this.correction = `Pour lire l'image de $${theSpline.x[antecedent]}$, on place la valeur de $${theSpline.x[antecedent]}$ sur l'axe des abscisses (axe de lecture  des antécédents) et on lit
    son image  sur l'axe des ordonnées (axe de lecture des images). On obtient :  $f(${theSpline.x[antecedent]})=${theSpline.y[antecedent]}$`
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
