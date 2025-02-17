import { droite } from '../../../lib/2d/droites.js'
import { milieu, point, tracePoint } from '../../../lib/2d/points.js'
import { repere } from '../../../lib/2d/reperes.js'
import { segment } from '../../../lib/2d/segmentsVecteurs.js'
import { texteParPosition } from '../../../lib/2d/textes.ts'
import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique } from '../../../lib/outils/ecritures'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { randint } from '../../../modules/outils.js'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
export const titre = 'Déterminer une équation de droite (graphique)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '15/11/2022'
export const dateDeModifImportante = '12/10/2024'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can2G20
 *
*/

export const uuid = '1f967'
export const ref = 'can2G20'
export const refs = {
  'fr-fr': ['can2G20'],
  'fr-ch': []
}
export default function EquationDroite () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.formatChampTexte = ''
  this.nbQuestions = 1
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    let xA, yA, xB, yB, o, A, B, Bx, By, sABx, sBBx, maFraction, lA, traceA, lB, lABx, lBBx, lABx2, lBBx2, sBAx, Ax, sAxA, traceB, d, r1, xmin, xmax, ymin, ymax, objet, objetC, objetC2
    switch (choice([1, 2])) {
      case 1:
        xA = 0
        yA = randint(1, 4)
        xB = randint(-4, 4, 0)
        yB = randint(0, 4)
        o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
        A = point(xA, yA)
        B = point(xB, yB)
        Bx = point(B.x, A.y)
        sABx = segment(A, Bx)
        sBBx = segment(B, Bx)
        maFraction = new FractionEtendue(yB - yA, xB - xA)
        sBBx.epaisseur = 2
        sBBx.pointilles = 5
        sABx.epaisseur = 2
        sABx.pointilles = 5
        lA = texteParPosition('A', xA, yA + 0.5, 'milieu', 'black', 1.5)
        traceA = tracePoint(A, 'black') // Variable qui trace les points avec une croix
        lB = texteParPosition('B', xB, yB + 0.5, 'milieu', 'black', 1.5)
        lABx = texteParPosition(`${xB - xA}`, milieu(A, Bx).x, A.y + 0.3, 'milieu', 'red', 1.5)
        lBBx = texteParPosition(`${yB - yA}`, B.x + 0.5, milieu(B, Bx).y, 'milieu', 'blue', 1.5)
        traceB = tracePoint(B, 'black') // Variable qui trace les points avec une croix
        d = droite(A, B, '', 'blue')
        d.epaisseur = 2
        traceA.taille = 3
        traceA.epaisseur = 2
        traceB.taille = 3
        traceB.epaisseur = 2
        xmin = -5
        ymin = -1
        xmax = 5
        ymax = 5
        r1 = repere({
          xMin: xmin,
          xMax: xmax,
          xUnite: 1,
          yMin: ymin,
          yMax: ymax,
          yUnite: 1,
          thickHauteur: 0.1,
          xLabelMin: xmin + 1,
          xLabelMax: xmax - 1,
          yLabelMax: ymax - 1,
          yLabelMin: ymin + 1,
          axeXStyle: '->',
          axeYStyle: '->',
          yLabelDistance: 1,
          yLabelEcart: 0.3,
          grilleSecondaire: true,
          grilleSecondaireYDistance: 1,
          grilleSecondaireXDistance: 1,
          grilleSecondaireYMin: ymin,
          grilleSecondaireYMax: ymax,
          grilleSecondaireXMin: xmin,
          grilleSecondaireXMax: xmax
        })
        objet = mathalea2d({ xmin, xmax, ymin: ymin - 0.25, ymax: ymax + 0.25, pixelsParCm: 30, scale: 0.75, style: 'margin: auto' }, d, r1, traceB, o)
        objetC = mathalea2d({ xmin, xmax, ymin, ymax: ymax + 0.25, pixelsParCm: 30, scale: 0.75, style: 'margin: auto' }, d, r1, traceA, lA, lB, traceB, o, sABx, sBBx, lABx, lBBx)
        this.reponse = [`y=${maFraction.texFraction}x + ${yA}`, `y=\\frac{${yB - yA}}{${xB - xA}}x + ${yA}`, `y=\\frac{${yA - yB}}{${xA - xB}}x + ${yA}`]
        this.question = 'Donner l\'équation réduite de la droite.<br>'
        this.question += `${objet}`
        if (yB === yA) {
          this.correction = `La droite est horizontale. On en déduit que son coefficient directeur est $m=0$.<br>
          Son ordonnée à l'origine est $${yA}$, ainsi l'équation réduite de la droite est $${miseEnEvidence(`y=${yA}`)}$.
       `
        } else {
          this.correction = `Le coefficient directeur $m$ de la droite $(AB)$ est donné par : <br>
    $m=\\dfrac{${miseEnEvidence(yB - yA, 'blue')}}{${miseEnEvidence(xB - xA, 'red')}}${maFraction.texSimplificationAvecEtapes()}$.
<br>`
          if ((yB - yA) / xB === 1) { this.correction += `Son ordonnée à l'origine est $${yA}$, ainsi l'équation réduite de la droite est $${miseEnEvidence(`y=x${yA === 0 ? '' : `${ecritureAlgebrique(yA)}`}`)}$.` }
          if ((yB - yA) / xB === -1) { this.correction += `Son ordonnée à l'origine est $${yA}$, ainsi l'équation réduite de la droite est $${miseEnEvidence(`y=-x${yA === 0 ? '' : `${ecritureAlgebrique(yA)}`}`)}$.` }
          if ((yB - yA) / xB !== -1 && (yB - yA) / xB !== 1) { this.correction += `Son ordonnée à l'origine est $${yA}$, ainsi l'équation réduite de la droite est $${miseEnEvidence(`y=${maFraction.texFractionSimplifiee}x${yA === 0 ? '' : `${ecritureAlgebrique(yA)}`}`)}$.` }
          this.correction += `<br>

          ${objetC}<br>

          `
        }

        this.canEnonce = this.question
        this.canReponseACompleter = ''

        break

      case 2:
        xA = 0
        yA = randint(-5, 5) / 2
        xB = randint(-4, 4, 0)
        yB = randint(-5, 5, 0) / 2
        o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
        A = point(xA, yA)
        B = point(xB, yB)
        Bx = point(B.x, A.y)
        By = point(A.y, B.y)
        Ax = point(A.x, B.y)
        sABx = segment(A, Bx)
        sBBx = segment(B, Bx)
        sBAx = segment(B, Ax)
        sAxA = segment(Ax, A)
        maFraction = new FractionEtendue(2 * (yB - yA), xB - xA)
        sBBx.epaisseur = 2
        sBBx.pointilles = 5
        sABx.epaisseur = 2
        sABx.pointilles = 5
        sBAx.epaisseur = 2
        sBAx.pointilles = 5
        lA = texteParPosition('A', xA, yA + 0.5, 'milieu', 'black', 1.5)
        traceA = tracePoint(A, 'black') // Variable qui trace les points avec une croix
        lB = texteParPosition('B', xB, yB + 0.5, 'milieu', 'black', 1.5)
        if (yA > yB) { lABx = texteParPosition(`${xB - xA}`, milieu(A, Bx).x, A.y + 0.3, 'milieu', 'red', 1.5) } else { lABx = texteParPosition(`${xB - xA}`, milieu(A, Bx).x, A.y - 0.3, 'milieu', 'red', 1.5) }
        if (yA > yB) { lABx2 = texteParPosition(`${xA - xB}`, milieu(B, Ax).x, B.y - 0.3, 'milieu', 'red', 1.5) } else { lABx2 = texteParPosition(`${xA - xB}`, milieu(B, Ax).x, B.y + 0.3, 'milieu', 'red', 1.5) }
        lBBx = texteParPosition(`${2 * (yB - yA)}`, B.x + 0.5, milieu(B, Bx).y, 'milieu', 'blue', 1.5)
        lBBx2 = texteParPosition(`${2 * (yA - yB)}`, A.x + 0.3, milieu(By, A).y, 'milieu', 'blue', 1.5)
        traceB = tracePoint(B, 'black') // Variable qui trace les points avec une croix
        d = droite(A, B, '', 'blue')
        d.epaisseur = 2
        traceA.taille = 3
        traceA.epaisseur = 2
        traceB.taille = 3
        traceB.epaisseur = 2
        xmin = -5
        ymin = -3
        xmax = 5
        ymax = 3
        r1 = repere({
          xMin: xmin,
          xMax: xmax,
          xUnite: 1,
          yMin: 2 * ymin,
          yMax: 2 * ymax,
          yUnite: 0.5,
          thickHauteur: 0.1,
          xLabelMin: xmin + 1,
          xLabelMax: xmax - 1,
          yLabelMax: 2 * ymax - 2,
          yLabelMin: 2 * ymin + 2,
          axeXStyle: '->',
          axeYStyle: '->',
          yLabelDistance: 2,
          yLabelEcart: 0.5,
          grilleYDistance: 0.5
        })
        objet = mathalea2d({ xmin, xmax, ymin: ymin - 0.25, ymax: ymax + 0.25, pixelsParCm: 30, scale: 0.75, style: 'margin: auto' }, d, r1, traceB, o)
        objetC = mathalea2d({ xmin, xmax, ymin, ymax: ymax + 0.25, pixelsParCm: 30, scale: 0.75, style: 'margin: auto' }, d, r1, traceA, lA, lB, traceB, o, sABx, sBBx, lABx, lBBx)
        objetC2 = mathalea2d({ xmin, xmax, ymin, ymax: ymax + 0.25, pixelsParCm: 30, scale: 0.75, style: 'margin: auto' }, d, r1, traceA, lA, lB, traceB, o, lABx2, sBAx, sAxA, lBBx2)
        this.question = 'Donner l\'équation réduite de la droite.<br>'
        this.question += `${objet}`
        if (yB === yA) {
          this.correction = `La droite est horizontale. On en déduit que son coefficient directeur est $m=0$.<br>
        Son ordonnée à l'origine est $${2 * yA}$, ainsi l'équation réduite de la droite est $${miseEnEvidence(`y=${2 * yA}`)}$.
     `
        } else {
          if (xB > xA) {
            this.correction = `Le coefficient directeur $m$ de la droite $(AB)$ est donné par : <br>
    $m=\\dfrac{${miseEnEvidence(2 * yB - 2 * yA, 'blue')}}{${miseEnEvidence(xB - xA, 'red')}}${maFraction.texSimplificationAvecEtapes()}$.
<br>`
            if (2 * (yB - yA) / xB === 1) { this.correction += `Son ordonnée à l'origine est $${2 * yA}$, ainsi l'équation réduite de la droite est $${miseEnEvidence(`y=x${ecritureAlgebrique(2 * yA)}`)}$.` }
            if (2 * (yB - yA) / xB === -1) { this.correction += `Son ordonnée à l'origine est $${2 * yA}$, ainsi l'équation réduite de la droite est $${miseEnEvidence(`y=-x${ecritureAlgebrique(2 * yA)}`)}$.` }
            if (2 * (yB - yA) / xB !== -1 && 2 * (yB - yA) / xB !== 1) { this.correction += `Son ordonnée à l'origine est $${2 * yA}$, ainsi l'équation réduite de la droite est $${miseEnEvidence(`y=${maFraction.texFractionSimplifiee}x${ecritureAlgebrique(2 * yA)}`)}$.` }
            this.correction += `<br>

          ${objetC}<br>

          `
          } else {
            this.correction = `Le coefficient directeur $m$ de la droite $(AB)$ est donné par : <br>
      $m=\\dfrac{${miseEnEvidence(2 * yA - 2 * yB, 'blue')}}{${miseEnEvidence(xA - xB, 'red')}}${maFraction.texSimplificationAvecEtapes()}$.
  <br>`
            if (2 * (yB - yA) / xB === 1) { this.correction += `Son ordonnée à l'origine est $${2 * yA}$, ainsi l'équation réduite de la droite est $${miseEnEvidence(`y=x${ecritureAlgebrique(2 * yA)}`)}$.` }
            if (2 * (yB - yA) / xB === -1) { this.correction += `Son ordonnée à l'origine est $${2 * yA}$, ainsi l'équation réduite de la droite est $y=-x${ecritureAlgebrique(2 * yA)}$.` }
            if (2 * (yB - yA) / xB !== -1 && 2 * (yB - yA) / xB !== 1) { this.correction += `Son ordonnée à l'origine est $${2 * yA}$, ainsi l'équation réduite de la droite est $${miseEnEvidence(`y=${maFraction.texFractionSimplifiee}x${ecritureAlgebrique(2 * yA)}`)}$.` }
            this.correction += `<br>

            ${objetC2}<br>

            `
          }
        }

        this.canEnonce = this.question
        this.canReponseACompleter = ''
        if (yA !== 0) {
          this.reponse = [`y=${maFraction.texFractionSimplifiee}x + ${2 * yA}`, `y=\\frac{${2 * yB - 2 * yA}}{${xB - xA}}x + ${2 * yA}`]
        } else {
          this.reponse = [`y=${maFraction.texFractionSimplifiee}x `, `y=\\frac{${2 * yB - 2 * yA}}{${xB - xA}}x`]
        }

        break
    }
    if (this.interactif) { this.question += 'Donner l\'écriture la plus simple possible. ' }
  }
}
