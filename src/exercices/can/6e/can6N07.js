import { droiteGraduee } from '../../../lib/2d/reperes.js'
import { latex2d } from '../../../lib/2d/textes.ts'
import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import { calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
export const titre = 'Lire l\'abscisse décimale d\'un point sur une droite graduée'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '29/08/2021'
export const dateDeModifImportante = '12/10/2024'
/*!
 * Jean-Claude Lhote
 * Publié le 11 / 09 / 2021
 * Référence can6N07
 */
export const uuid = '34d01'
export const ref = 'can6N07'
export const refs = {
  'fr-fr': ['can6N07'],
  'fr-ch': []
}
export default function LireAbscisseDecimaleDeFraction () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.consigne = ''
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    let a
    switch (choice([1, 2])) { //
      case 1:// droite graduée     /4 resultat décimal
        a = choice([1, 3, 5, 6, 7, 9, 10, 11]) // numérateur
        this.reponse = calculANePlusJamaisUtiliser(a / 4)
        this.question = `Determiner l'abscisse du point $A$.<br>
        On donnera le résultat sous  forme décimale.<br>`

        this.question += mathalea2d({ xmin: -1, ymin: -1, xmax: 14, ymax: 1, pixelsParCm: 35, scale: 0.6, style: 'margin: auto' }, latex2d('A', 3 * a / 4, 0.6, { color: 'blue', letterSize: '' }), droiteGraduee({
          Unite: 3,
          Min: 0,
          Max: 3.2,
          x: 0,
          y: 0,
          thickSecDist: 1 / 4,
          thickSec: true,
          thickoffset: 0,
          axeStyle: '|->',
          pointListe: [[a / 4, '']],
          pointCouleur: 'blue',
          pointStyle: 'x',
          labelsPrincipaux: true,
          step1: 1,
          step2: 1
        }))
        this.correction = `L'abscisse du point A est $\\dfrac{${a}}{${4}}=${miseEnEvidence(texNombre(this.reponse, 2))}$`

        break
      case 2:// droite graduée     /5 resultat décimal
        a = choice([1, 2, 3, 4, 6, 7, 8, 9]) // numérateur
        this.reponse = calculANePlusJamaisUtiliser(a / 5)
        this.question = `Determiner l'abscisse du point $A$.<br>
        On donnera le résultat sous  forme décimale.<br>
    
    `

        this.question += mathalea2d({ xmin: -1, ymin: -1, xmax: 14, ymax: 1, pixelsParCm: 35, scale: 0.6, style: 'margin: auto' }, latex2d('A', 3 * a / 5, 0.6, { color: 'blue', letterSize: '' }), droiteGraduee({
          Unite: 3,
          Min: 0,
          Max: 3.2,
          x: 0,
          y: 0,
          thickSecDist: 1 / 5,
          thickSec: true,
          thickoffset: 0,
          axeStyle: '|->',
          pointListe: [[a / 5, '']],
          pointCouleur: 'blue',
          pointStyle: 'x',
          labelsPrincipaux: true,
          step1: 1,
          step2: 1
        }))
        this.correction = `L'abscisse du point A est $\\dfrac{${a}}{${5}}=${miseEnEvidence(texNombre(this.reponse, 2))}$`

        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
