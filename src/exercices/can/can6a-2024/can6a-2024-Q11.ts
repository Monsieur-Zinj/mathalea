import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { sp } from '../../../lib/outils/outilString'
import { texNombre } from '../../../lib/outils/texNombre'
import { propositionsQcm } from '../../../lib/interactif/qcm'
import { randint } from '../../../modules/outils'
export const titre = 'Trouver le plus grand d\'un décimal et d\'une fraction'
export const interactifReady = true
export const interactifType = 'qcm'
export const uuid = 'e1faf'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Jean-Claude Lhote
 * Référence
*/
export default class CompareDecimalFraction extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'qcm'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    let a:string
    let b:string
    let nbA: number
    let nbB: number
    let num: number
    let den: number
    if (this.canOfficielle) {
      a = '3{,}4'
      b = '\\dfrac{7}{3}'
      nbA = 3.4
      nbB = 7 / 3
      num = 7
      den = 3
      this.reponse = '3,4'
      this.correction = `Le plus grand nombre est : $${miseEnEvidence(texNombre(3.4, 1))}$.`
    } else {
      do {
        num = randint(7, 15)
        den = randint(2, 5)
        nbA = randint(21, 49, [20, 40]) / 10
        nbB = num / den
      } while (Math.abs(nbA - nbB) <= 1)
      a = texNombre(nbA, 1)
      b = `\\dfrac{${num}}{${den}}`
    }

    this.autoCorrection[0] = {
      options: { ordered: true },
      enonce: 'Coche le plus grand nombre : ',
      propositions: [
        {
          texte: `$${a}$`,
          statut: nbA > nbB
        },
        {
          texte: `$${b}$`,
          statut: nbB > nbA
        }
      ]

    }
    const qcm = propositionsQcm(this, 0)
    if (!this.interactif) {
      this.question = 'Entoure le plus grand nombre : '
      this.question += `${sp(7)}$${a}$ ${sp(7)} $${b}$`
    } else {
      this.question = 'Coche le plus grand nombre : ' + qcm.texte
    }

    this.canEnonce = 'Entoure le plus grand nombre.'
    this.canReponseACompleter = `$${a}$ ${sp(7)} $${b}$`
    this.reponse = nbA > nbB ? a : b
    this.correction = `Le plus grand nombre est : $${miseEnEvidence(this.reponse)}$.<br><br>`
    if (nbA > nbB) {
      if (Number.isInteger(num / den)) {
        this.correction += `En effet : $\\dfrac{${num}}{${den}}=${texNombre((num / den), 0)}$`
      } else {
        if (num > den) {
          this.correction += `Comme : <br>
          $\\begin{aligned}
          \\dfrac{${num}}{${den}}&=\\dfrac{${num - (num % den)}}{${den}}+\\dfrac{${num % den}}{${den}} \\\\
          &= ${texNombre(Math.floor(num / den), 0)} +\\dfrac{${num % den}}{${den}}
          \\end{aligned}$<br>
           et  $\\dfrac{${num % den}}{${den}}<1$,`
          this.correction += ` alors $\\dfrac{${num}}{${den}}<${Math.ceil(num / den).toFixed(0)}$.`
        } else {
          this.correction += `En effet : $${num}<${den}$ donc $\\dfrac{${num}}{${den}}<1$`
        }
      }
    } else {
      if (Number.isInteger(num / den)) {
        this.correction += `En effet : $\\dfrac{${num}}{${den}}=${texNombre(num / den, 0)}$`
      } else {
        this.correction += `Comme : <br>
        $\\begin{aligned}\\dfrac{${num}}{${den}}&=\\dfrac{${num - (num % den)}}{${den}}+\\dfrac{${num % den}}{${den}} \\\\
        &= ${texNombre(Math.floor(num / den), 0)} +\\dfrac{${num % den}}{${den}}
        \\end{aligned}$<br> `
        this.correction += `alors $\\dfrac{${num}}{${den}}>${Math.floor(num / den).toFixed(0)}$.`
      }
    }
  }
}
