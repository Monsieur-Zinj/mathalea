import { droite } from '../../../lib/2d/droites.js'
import { repere } from '../../../lib/2d/reperes.js'
import { segment } from '../../../lib/2d/segmentsVecteurs.js'
import { texteParPosition } from '../../../lib/2d/textes.ts'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { ecritureAlgebrique } from '../../../lib/outils/ecritures'
import { texteCentre } from '../../../lib/format/miseEnPage.js'
import { abs } from '../../../lib/outils/nombres'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d, colorToLatexOrHTML } from '../../../modules/2dGeneralites.js'
import { randint, egal } from '../../../modules/outils.js'
import FractionEtendue from '../../../modules/FractionEtendue'
export const titre = 'Lire graphiquement une fonction affine*'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '25/10/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora (2F10-02)
*/
export const uuid = 'f554f'
export const ref = 'can3F08'
export const refs = {
  'fr-fr': ['can3F08'],
  'fr-ch': []
}
export default function LectureGraphiqueFonctionAffine2 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur01 inline'
  this.formatInteractif = 'calcul'
  this.formatChampTexte = 'largeur01 inline nospacebefore'
  this.nouvelleVersion = function () {
    const o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
    let s1, s2
    const a = randint(-5, 5, [0, 4]) // numérateut coefficient directeur non nul
    const b = randint(-2, 2) // ordonnée à l'origine
    const d = randint(2, 5, [-a, a, 2 * a, -2 * a]) // dénominateur coefficient directeur non multiple du numérateur pour éviter nombre entier
    const r = repere({ xMin: -5, yMin: -5, xMax: 6, yMax: 5 })
    const c = droite(a / d, -1, b)
    const maFraction = new FractionEtendue(a, d)

    c.color = colorToLatexOrHTML('red')
    c.epaisseur = 2
    this.question = `$f$ est une fonction affine${this.interactif ? '.' : ' définie par $f(x)=\\ldots$'}<br>`
    this.question += `${mathalea2d({
        xmin: -5,
        ymin: -5,
        xmax: 6,
        ymax: 5,
pixelsParCm: 20,
scale: 0.7,
style: 'margin: auto'
        }, r, c, o)}`// On trace le graphique
    this.optionsChampTexte = { texteAvant: '$f(x)=$' }
    this.reponse = [`${new FractionEtendue(a, d).texFraction}x${ecritureAlgebrique(b)}`]
    if (egal(a * 1000 / d, Math.round(a * 1000 / d))) {
      this.reponse.push(`${a / d}x${ecritureAlgebrique(b)}`)
    }
    this.correction = `$f$ est de la forme
    $f(x)=ax+b$ avec $a$ le coefficient directeur de la droite (inclinaison de la droite par rapport à l'horizontale)
    et $b$ l'ordonnée à l'origine (ordonnée du point d'intersection entre la droite et l'axe des ordonnées).<br>
    L'ordonnée à l'origine  est $b=${b}$ et :`
    this.correction += texteCentre(`$a=\\dfrac{\\text{Dénivelé vertical}}{\\text{Déplacement horizontal}}=
    \\dfrac{${miseEnEvidence(a, 'blue')}}{${miseEnEvidence(d, 'green')}}$`)
    this.correction += `On en déduit que la fonction $f$ est définie par : $f(x)=${miseEnEvidence(`${maFraction.texFractionSimplifiee}x${ecritureAlgebrique(b)}`)}$ .<br>`
    if (a > 0) {
      s1 = segment(0, b - a, -d, b - a, 'green')
      s2 = segment(0, b - a, 0, b, 'blue')
    }
    if (a < 0) {
      s1 = segment(d, b, 0, b, 'green')
      s2 = segment(d, b, d, b - abs(a), 'blue')
    }
    s2.epaisseur = 2
    s1.epaisseur = 2
    s2.styleExtremites = '->'
    s1.styleExtremites = '<-'
    if (a !== 0) {
      this.correction += `${mathalea2d({
        xmin: -5,
        ymin: -5,
        xmax: 6,
        ymax: 5,
        pixelsParCm: 20,
        scale: 0.7,
        style: 'margin: auto'
        }, r, s1, s2, c, o)}`
    }// On trace le graphique
    this.canEnonce = `$f$ est une fonction affine. <br>
    
    Exprimer $f(x)$ en fonction de $x$.<br>`
    this.canEnonce +=
    `
    ${mathalea2d({
      xmin: -5,
      ymin: -5,
      xmax: 6,
      ymax: 5,
pixelsParCm: 20,
scale: 0.7,
style: 'margin: auto'
      }, r, c, o)}
      
      `
    this.canReponseACompleter = '$f(x)=\\ldots$'
  }
}
