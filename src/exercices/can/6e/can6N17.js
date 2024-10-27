import { droiteGraduee } from '../../../lib/2d/reperes.js'
import { latex2d } from '../../../lib/2d/textes.ts'
import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import Decimal from 'decimal.js'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
export const titre = 'Lire une abscisse sur une droite graduée avec des décimaux'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '29/08/2022'
export const dateDeModifImportante = '12/10/2024'
/*!
 * @author Gilles Mora
 *
 */
export const uuid = 'aa22e'
export const ref = 'can6N17'
export const refs = {
  'fr-fr': ['can6N17'],
  'fr-ch': []
}
export default function AbscisseDroiteDecimaux () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.formatInteractif = 'calcul'
  this.consigne = ''
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    let d, abs0, abs1, abs2, x1, partieDec1, partieDec2, partieDec3

    const choix1 = choice(['a', 'b'])//, 'b'
    if (choix1 === 'a') { // graduation de 0,02 en 0,02
      partieDec1 = new Decimal(randint(1, 9)).div(choice([10, 100]))
      abs0 = new Decimal(randint(0, 9)).add(partieDec1)
      partieDec2 = new Decimal(1).div(100)
      abs1 = abs0.add(partieDec2)
      partieDec3 = new Decimal(2).div(100)
      abs2 = abs0.add(partieDec3)
      x1 = new Decimal(2 * randint(1, 9, 5)).div(10)
      d = droiteGraduee({
        Unite: 4,
        Min: 0,
        Max: 2.1,
        thickSecDist: 0.2,
        axeStyle: '->',
        pointTaille: 3,
        pointStyle: 'x',
        labelsPrincipaux: false,
        thickSec: true,
        labelListe: [[0, `${texNombre(abs0, 2)}`], [1, `${texNombre(abs1, 2)}`], [2, `${texNombre(abs2, 2)}`]],
        pointListe: [[x1, '']]
      })
      this.reponse = new Decimal(x1).div(100).add(abs0)
      this.question = 'Déterminer l\'abscisse du point $A$. <br>' + mathalea2d({ xmin: -0.5, ymin: -1, xmax: 10, ymax: 1, pixelsParCm: 35, scale: 0.75 }, latex2d('A', 4 * x1, 0.5, { color: 'blue', letterSize: '' }), d)
      this.correction = `Entre $${texNombre(abs0)}$ et $${texNombre(abs1)}$, il y a $5$ intervalles. Une graduation correspond donc à $0,002$. <br>
      Ainsi, l'abscisse du point $A$ est $${miseEnEvidence(texNombre(this.reponse, 4))}$.`
    }

    if (choix1 === 'b') { // graduation de 0,025 en 0,025
      partieDec1 = new Decimal(randint(1, 9)).div(choice([10, 100]))
      abs0 = new Decimal(randint(0, 9)).add(partieDec1)

      partieDec2 = new Decimal(1).div(100)
      abs1 = abs0.add(partieDec2)
      partieDec3 = new Decimal(2).div(100)
      abs2 = abs0.add(partieDec3)
      x1 = new Decimal(choice([25, 50, 75, 125, 150, 175])).div(100)
      d = droiteGraduee({
        Unite: 4,
        Min: 0,
        Max: 2.1,
        thickSecDist: 0.25,
        axeStyle: '->',
        pointTaille: 3,
        pointStyle: 'x',
        labelsPrincipaux: false,
        thickSec: true,
        labelListe: [[0, `${texNombre(abs0, 2)}`], [1, `${texNombre(abs1, 2)}`], [2, `${texNombre(abs2, 2)}`]],
        pointListe: [[x1, '']]
      })
      this.reponse = new Decimal(x1).div(100).add(abs0)
      this.question = 'Déterminer l\'abscisse du point $A$. <br>' + mathalea2d({ xmin: -0.5, ymin: -1, xmax: 10, ymax: 1, pixelsParCm: 35, scale: 0.75 }, latex2d('A', 4 * x1, 0.5, { color: 'blue', letterSize: '' }), d)
      this.correction = `Entre $${texNombre(abs0)}$ et $${texNombre(abs1)}$, il y a $4$ intervalles. Une graduation correspond donc à $${texNombre(0.0025)}$. <br>
      Ainsi, l'abscisse du point $A$ est $${miseEnEvidence(texNombre(this.reponse, 4))}$.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
