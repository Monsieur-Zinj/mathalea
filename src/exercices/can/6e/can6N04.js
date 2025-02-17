import { droiteGraduee } from '../../../lib/2d/reperes.js'
import { latex2d } from '../../../lib/2d/textes.ts'
import { texFractionReduite } from '../../../lib/outils/deprecatedFractions.js'
import { pgcd } from '../../../lib/outils/primalite'
import { context } from '../../../modules/context.js'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
export const titre = 'Lire une abscisse sur une droite graduée'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDePublication = '29/08/2021'
export const dateDeModifImportante = '12/10/2024'
/*!
 * @author Jean-Claude Lhote et Gilles Mora
 * Créé pendant l'été 2021
 * Référence can6N04
 */
export const uuid = 'ca515'
export const ref = 'can6N04'
export const refs = {
  'fr-fr': ['can6N04'],
  'fr-ch': []
}
export default function AbscisseFractionnaire () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.formatInteractif = 'fractionEgale'
  this.consigne = ''

  this.nouvelleVersion = function () {
    const a = randint(2, 6) // dénominateur
    let b = randint(2, a * 4 - 1)
    do {
      b = randint(2, a * 4 - 1) // numérateur
    } while (b % a === 0)
    const c = new FractionEtendue(b, a)
    this.reponse = c
    this.question = 'Déterminer l\'abscisse du point $A$.<br>'

    this.question += mathalea2d({ xmin: -1, ymin: -1.5, xmax: 14, ymax: 1.5, scale: 0.5, pixelsParCm: 30, style: 'margin: auto' }, latex2d('A', 3 * b / a, 0.6, { color: 'blue', letterSize: '' }), droiteGraduee({
      Unite: 3,
      Min: 0,
      Max: 4.2,
      x: 0,
      y: 0,
      thickSecDist: 1 / a,
      thickSec: true,
      thickOffset: 0,
      axeStyle: '->',
      pointListe: [[b / a, '']],
      pointCouleur: 'blue',
      pointTaille: 3,
      pointStyle: 'x',
      labelsPrincipaux: true,
      step1: 1,
      step2: 1
    }))
    if (pgcd(a, b) === 1) {
      this.correction = `L'unité est divisée en $${a}$ intervalles.<br>
    Une graduation correspond donc à $\\dfrac{1}{${a}}$. <br>
     Comme le point $A$ est situé à $${b}$ graduations de l'origine,
      l'abscisse du point $A$ est donc $\\dfrac{1}{${a}}\\times ${b}$, soit  $${miseEnEvidence(`\\dfrac{${b}}{${a}}`)}$.<br>
      `
    } else {
      this.correction = `L'unité est divisée en $${a}$ intervalles.<br>
      Une graduation correspond donc à $\\dfrac{1}{${a}}$. <br>
       Comme le point $A$ est situé à $${b}$ graduations de l'origine,
        l'abscisse du point $A$ est donc $\\dfrac{1}{${a}}\\times ${b}$, soit  $\\dfrac{${b}}{${a}}$ que l'on peut simplifier en $${miseEnEvidence(`${texFractionReduite(b, a)}`)}$.<br>
        `
    }
    if (context.isAmc) {
      this.autoCorrection[0] = {
        enonce: this.question,
        options: { multicols: true },
        propositions: [
          {
            type: 'AMCNum',
            propositions: [{
              texte: this.correction,
              statut: '',
              reponse: {
                texte: 'Numérateur',
                valeur: b,
                param: {
                  digits: b > 9 ? 2 : 1,
                  decimals: 0,
                  signe: false,
                  approx: 0
                }
              }
            }]
          },
          {
            type: 'AMCNum',
            propositions: [{
              texte: '',
              statut: '',
              reponse: {
                texte: 'Dénominateur',
                valeur: a,
                param: {
                  digits: 1,
                  decimals: 0,
                  signe: false,
                  approx: 0
                }
              }
            }]
          }
        ]
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
