import { codageAngleDroit } from '../../../lib/2d/angles.js'
import { milieu, point, tracePoint } from '../../../lib/2d/points.js'
import { segment } from '../../../lib/2d/segmentsVecteurs.js'
import { labelPoint, texteParPosition } from '../../../lib/2d/textes.ts'
import { choice } from '../../../lib/outils/arrayOutils'
import { stringNombre, texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { randint } from '../../../modules/outils.js'
import { fraction } from '../../../modules/fractions.js'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Calculer une aire, un périmètre ou une longueur'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModificationImportante = '15/09/2024'
/**
 * @author Gilles Mora
 * Référence can4G08
 * Date de publication septembre 2021
*/
export const uuid = 'b1a48'
export const ref = 'can4G08'
export const refs = {
  'fr-fr': ['can4G08'],
  'fr-ch': []
}
export default function QuestionsAiresEtPerimetres () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.formatChampTexte = 'largeur01 inline'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let a, b, c, n, d, A, B, C, D, N, a1, maFraction
    const objets = []
    switch (choice([1, 2, 3, 4, 5, 6, 7])) { //
      case 1://
        a = randint(3, 9)
        b = randint(0, 1)
        this.question = `Un carré de côté ${a} cm a le même périmètre qu'un rectangle de largeur ${a - b} cm et de longueur ${a + 1} cm ?`
        if (b === 0) {
          this.correction = `${texteEnCouleurEtGras('Faux')} car $4\\times ${a}$ cm$\\neq 2\\times ${a}$ cm$ + 2\\times ${a + 1}$ cm.`
          this.reponse = 'F'
        } else {
          this.correction = `${texteEnCouleurEtGras('Vrai')} car $4\\times ${a}$ cm = $2\\times ${a - 1}$ cm $ + 2\\times ${a + 1}$ cm$= ${4 * a}$ cm.`
          this.reponse = 'V'
        }
        this.ignoreCasse = true
        this.formatChampTexte = 'largeur01 inline ' + KeyboardType.vFON
        if (this.interactif) { this.question += '<br> Vrai (V) ou Faux (F)' }
        this.canEnonce = this.question// 'Compléter'
        this.canReponseACompleter = ''
        break
      case 2:// aire d'un carré connaissant son perimètre
        a = randint(2, 10)
        this.reponse = a * a
        this.formatInteractif = 'calcul'
        this.question = `Quelle est l'aire d'un carré en cm$^2$ dont le périmètre est $${4 * a}$ cm ? `

        this.correction = `Le côté du carré est $${4 * a}\\div 4=${a}$, donc son aire est : $${a}\\times ${a}=${miseEnEvidence(a ** 2)}$ cm$^2$.`
        this.canEnonce = this.question// 'Compléter'
        this.canReponseACompleter = '$\\ldots$ cm'
        break
      case 3:// perimètre d'un carré connaissant son aire
        a = randint(1, 10)
        c = a * a
        this.reponse = 4 * a
        this.formatInteractif = 'calcul'
        this.question = `Déterminer le périmètre (en cm) d'un carré d'aire $${c}$ cm$^2$. `
        this.correction = `Le côté du carré est $\\sqrt{${c}}=${a}$.<br>
         Son périmètre est donc $4\\times ${a}=${miseEnEvidence(4 * a)}$ cm.`
        this.canEnonce = this.question// 'Compléter'
        this.canReponseACompleter = '$\\ldots$ cm'
        break

      case 4:// côté d'un carré connaissant son perimètre
        a1 = randint(5, 20)
        a = a1 * 4
        this.reponse = a1
        this.formatInteractif = 'calcul'
        this.question = `Le périmètre d'un carré est $${a}$ cm. <br>Quelle est la longueur (en cm) du côté du carré ? `
        this.correction = `Le côté du carré est $${a}\\div 4=${miseEnEvidence(a1)}$.`
        this.canEnonce = this.question// 'Compléter'
        this.canReponseACompleter = '$\\ldots$ cm'
        break
      case 5:// périmètre d'une figure
        a = randint(1, 3)//
        b = randint(4, 7)//
        n = randint(7, 12)
        c = randint(1, 6) + randint(3, 9) / 10
        d = n - c
        A = point(0, 0, 'P')
        B = point(7, 1, 'Q', 'below')
        C = point(6.5, 4, 'R')
        D = point(2, 5, 'R')

        objets.push(segment(A, B), segment(B, C), segment(C, D), segment(D, A), tracePoint(A, B, C, D))
        objets.push(texteParPosition(`${texNombre(b)} m`, milieu(A, D).x - 0.5, milieu(A, D).y),
          texteParPosition(`${stringNombre(a)} m`, milieu(B, C).x + 0.5, milieu(B, C).y),
          texteParPosition(`${stringNombre(c)} m`, milieu(A, B).x, milieu(A, B).y - 0.5),
          texteParPosition(`${stringNombre(d)} m`, milieu(C, D).x, milieu(C, D).y + 0.5))

        this.question = `Quel est le périmètre de cette figure (en m) ?<br>
        
        `
        this.question += mathalea2d({ xmin: -1, ymin: -1, xmax: 8, ymax: 6, pixelsParCm: 20, mainlevee: true, amplitude: 0.5, scale: 0.7, style: 'margin: auto' }, objets)
        this.correction = ` Le périmètre est donné par : $${texNombre(a)}+${texNombre(b)}+${texNombre(c)}+${texNombre(d)}=${miseEnEvidence(a + b + c + d)}$.<br>`
        this.reponse = a + b + c + d
        this.formatInteractif = 'calcul'
        this.canEnonce = this.question// 'Compléter'
        this.canReponseACompleter = '$\\ldots$ m'
        break
      case 6:// agrandissement/réduction
        N = choice(['a', 'b', 'c'])
        if (N === 'a') {
          a = randint(2, 7)// aire
          c = randint(2, 4)// coefficient
          this.question = `Les longueurs d'un rectangle de $${a}$ cm$^2$  sont multipliées par $${c}$.<br>

          Quelle est l'aire (en cm$^2$) du rectangle ainsi obtenu ?
          `
          this.formatInteractif = 'calcul'
          this.correction = ` Si les longueurs sont multiplées par $k$, les aires sont multipliées par $k^2$, soit ici par $${c}^2=${c ** 2}$.<br>
          Ainsi, l'aire du nouveau rectangle est : $${a}\\times ${c * c}=${miseEnEvidence(a * c * c)}$ cm$^2$.
      <br>`

          this.reponse = a * c * c
          this.canEnonce = this.question// 'Compléter'
          this.canReponseACompleter = '$\\ldots$ cm$^2$'
        } else if (N === 'b') {
          n = randint(1, 3)
          d = randint(n + 1, 10)
          maFraction = fraction(n, d).simplifie()
          this.reponse = maFraction.puissanceFraction(2)
          this.question = `Les longueurs d'un triangle sont multipliées par $${maFraction.texFraction}$.<br>

          Par combien est multipliée son aire  ?
          `

          this.correction = ` Si les longueurs sont multiplées par $k$, les aires sont multipliées par $k^2$.<br>
          Ainsi, l'aire a été multipliée par : $\\left(${maFraction.texFraction}\\right)^2=${miseEnEvidence(this.reponse.texFraction)}$.
      <br>`

          this.formatInteractif = 'fractionEgale'
          this.canEnonce = this.question// 'Compléter'
          this.canReponseACompleter = ''
        } else { // N === 'c'
          n = randint(1, 3)
          d = randint(n + 1, 10)
          maFraction = fraction(n, d).simplifie()
          const maFractionAuCarre = maFraction.puissanceFraction(2).texFraction
          this.question = `L'aire d'un parallélogramme a été multipliée par $${maFractionAuCarre}$.<br>
          
          Par combien ont été multipliées les longueurs de ses côtés ?
          `

          this.correction = ` Si les aires sont multiplées par $k$, les longueurs sont multipliées par $\\sqrt{k}$.<br>
          Ainsi, les longueurs ont été multipliées par : $\\sqrt{${maFractionAuCarre}=${miseEnEvidence(maFraction.texFraction)}$.
      <br>`
          this.reponse = maFraction
          this.formatInteractif = 'fractionEgale'
          this.canEnonce = this.question// 'Compléter'
          this.canReponseACompleter = ''
        }
        break
      case 7:// longueur à trouver à partir d'une aire triangle rectangle
        a = randint(2, 10)//
        b = randint(1, 5) * a
        A = point(0, 0, 'A', 'below')
        B = point(8, 0, 'B', 'below')
        C = point(6, 3.46, 'C')

        objets.push(segment(A, B), segment(B, C), segment(C, A), labelPoint(A, B, C), tracePoint(A, B, C), codageAngleDroit(A, C, B))
        objets.push(texteParPosition(`${texNombre(a)} m`, milieu(B, C).x + 0.5, milieu(B, C).y + 0.5)
        )

        this.question = ` L'aire du triangle $ABC$ est $${b}$ m$^2$. <br>
        Donner la longueur $AC$ (en m).<br>
        
        `
        this.question += mathalea2d({ xmin: -1, ymin: -1, xmax: 9, ymax: 4.5, pixelsParCm: 20, mainlevee: true, amplitude: 0.5, scale: 0.7, style: 'margin: auto' }, objets)
        this.correction = ` L'aire de ce triangle rectangle est donnée par : $\\dfrac{BC\\times AC}{2}$.<br>
          On cherche $AC$ telle que $\\dfrac{${a}\\times AC}{2}=${b}$. <br>
          $AC=\\dfrac{2\\times ${b}}{${a}}=${miseEnEvidence(new FractionEtendue(2 * b, a).simplifie().texFraction)}$ m.
      <br>`
        this.reponse = 2 * b / a
        this.formatInteractif = 'calcul'
        this.canEnonce = this.question// 'Compléter'
        this.canReponseACompleter = '$\\ldots$ m'
        break
    }
  }
}
