import { codageAngleDroit } from '../../../lib/2d/angles.js'
import { milieu, point, pointAdistance } from '../../../lib/2d/points.js'
import { polygoneAvecNom } from '../../../lib/2d/polygones.js'
import { texteParPosition } from '../../../lib/2d/textes.ts'
import { miseEnEvidence, texteEnCouleur } from '../../../lib/outils/embellissements'
import { extraireRacineCarree } from '../../../lib/outils/calculs'
import { creerNomDePolygone } from '../../../lib/outils/outilString.js'
import { texNombre, texRacineCarree } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Calculer un côté avec le théorème de Pythagore'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export const uuid = '4b711'
export const ref = 'can4G04'
export const refs = {
  'fr-fr': ['can4G04'],
  'fr-ch': []
}
export default function CalculCotePythagore () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.formatChampTexte = ''
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    const nom = creerNomDePolygone(3, ['QD'])
    const a = randint(2, 5)//
    const b = randint(6, 10)//
    const c2 = b ** 2 - a ** 2
    const A = point(0, 0, nom[0])
    const B = pointAdistance(A, a, -90, nom[1])
    const C = pointAdistance(B, Math.sqrt(c2), 0, nom[2])
    const pol = polygoneAvecNom(A, B, C) // polygoneAvecNom s'occupe du placement des noms des sommets
    const objets = []
    const xmin = Math.min(A.x, B.x, C.x) - 1
    const ymin = Math.min(A.y, B.y, C.y) - 1
    const xmax = Math.max(A.x, B.x, C.x) + 1
    const ymax = Math.max(A.y, B.y, C.y) + 1

    const reduction = extraireRacineCarree(c2)
    const reductible = (reduction[0] !== 1)

    objets.push(pol[0], pol[1], codageAngleDroit(A, B, C)) // pol[0], c'est le tracé et pol[1] ce sont les labels
    objets.push(texteParPosition(`${texNombre(b)}`, milieu(C, A).x, milieu(C, A).y + 0.4),
      texteParPosition(`${texNombre(a)}`, milieu(B, A).x - 0.3, milieu(B, A).y + 0.2)
    )
    this.question = `Sur cette figure, déterminer la valeur exacte de $${nom[1]}${nom[2]}$.<br>`
    this.question += mathalea2d({ xmin, ymin, xmax, ymax, pixelsParCm: 25, mainlevee: false, amplitude: 0.3, scale: 0.5, style: 'margin: auto' }, objets)
    this.correction = ` On utilise le théorème de Pythagore dans le triangle $${nom[0]}${nom[1]}${nom[2]}$,  rectangle en $${nom[1]}$.<br>
      On obtient :<br><br>
      $\\begin{aligned}
        ${nom[0]}${nom[1]}^2+${nom[1]}${nom[2]}^2&=${nom[0]}${nom[2]}^2\\\\
        ${nom[1]}${nom[2]}^2&=${nom[0]}${nom[2]}^2-${nom[0]}${nom[1]}^2\\\\
        ${nom[1]}${nom[2]}^2&=${b}^2-${a}^2\\\\
        ${nom[1]}${nom[2]}^2&=${b ** 2}-${a ** 2}\\\\
        ${nom[1]}${nom[2]}^2&=${c2}\\\\
        ${nom[1]}${nom[2]}&=${miseEnEvidence('\\sqrt{' + c2 + '}')}
        \\end{aligned}$
        ${reductible ? `En simplifiant, on obtient : $${nom[1]}${nom[2]} = ${miseEnEvidence(texRacineCarree(c2))}$.` : ''}
        <br>`
    this.correction += texteEnCouleur(`Mentalement : <br>
    La longueur $${nom[1]}${nom[2]}$ est donnée par la racine carrée de la différence des carrés de $${b}$ et de $${a}$.<br>
    Cette différence vaut $${b ** 2}-${a ** 2}=${c2}$. <br>
    La valeur cherchée est donc : $\\sqrt{${c2}}${reductible ? '=' + texRacineCarree(c2) : ''}$.`, 'blue')
    this.reponse = [`\\sqrt{${c2}}`, `${Math.sqrt(c2)}`, texRacineCarree(c2)]
    this.canEnonce = this.question
    this.canReponseACompleter = `$${nom[1]}${nom[2]}=\\ldots$`
  }
}
