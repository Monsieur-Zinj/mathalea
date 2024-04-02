import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { printlatex, randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import { signe } from '../../../lib/outils/nombres'
import { ecritureAlgebrique, rienSi1 } from '../../../lib/outils/ecritures'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Réduire une expression littérale'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '93937'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecVariable
    this.optionsChampTexte = { texteAvant: '$=$' }
    this.canOfficielle = true
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = printlatex('14x^2-10x+12')
      this.question = 'Réduis : $8x^2-9x-x+6x^2+12$   '
      this.correction = `$\\begin{aligned}
      8x^2-9x-x+6x^2+12&=\\underbrace{8x^2+6x^2}_{14x^2}\\underbrace{-9x-x}_{-10x}+12\\\\
      &=${miseEnEvidence('14x^2-10x+12')}
      \\end{aligned}$
     `
    } else {
      const choix = choice([1, 2])// 1,2
      if (choix === 1) {
        const b = randint(1, 3)
        const c = randint(1, 3)
        const d = randint(1, 5)
        const e = choice([-1, 1])
        const a = randint(1, 4, d)
        this.question = `Réduis :
      $${rienSi1(a)}x^2+${rienSi1(b)}x+${texNombre(c)}+${rienSi1(d)}x^2${signe(e)}x$ `

        if (b + e === 0) {
          this.reponse = printlatex(`${texNombre(a + d, 0)}x^2+${texNombre(c, 0)}`)
          this.correction = `$\\begin{aligned}
          ${rienSi1(a)}x^2+${rienSi1(b)}x+${texNombre(c, 0)}+${rienSi1(d)}x^2+x&=(${a} + ${d})x^2+(${b}${ecritureAlgebrique(e)})x+${texNombre(c, 0)}\\\\
          &=${miseEnEvidence(this.reponse)}
          \\end{aligned}$`
        } else {
          this.reponse = printlatex(`${texNombre(a + d, 0)}x^2+${texNombre(b + e, 0)}x+${texNombre(c, 0)}`)
          this.correction = `$\\begin{aligned}
          ${rienSi1(a)}x^2+${rienSi1(b)}x+${texNombre(c, 0)}+${rienSi1(d)}x^2+x&=(${a} + ${d})x^2+(${b}${ecritureAlgebrique(e)})x+${texNombre(c, 0)}\\\\
          &=${miseEnEvidence(this.reponse)}
          \\end{aligned}$`
        }
      }
      if (choix === 2) {
        const b = randint(-5, -2)
        const c = randint(1, 5)
        const d = randint(-5, -2)
        const e = choice([-1, 1])
        const a = randint(-5, 5, 0)
        this.question = `Réduis : 
      $${rienSi1(a)}x^2${ecritureAlgebrique(b)}x${ecritureAlgebrique(c)}${ecritureAlgebrique(d)}x^2${signe(e)}x$ `

        if (a + d === 0) {
          this.reponse = printlatex(`${texNombre(b + e)}x+${texNombre(c)}`)
          this.correction = `$\\begin{aligned}
          ${rienSi1(a)}x^2${ecritureAlgebrique(b)}x${ecritureAlgebrique(c)}${ecritureAlgebrique(d)}x^2+x&=
        (${a}${ecritureAlgebrique(d)})x^2+(${b}${ecritureAlgebrique(e)})x${ecritureAlgebrique(c)}\\\\
        &=${miseEnEvidence(this.reponse)}
        \\end{aligned}$`
        } else {
          this.reponse = printlatex(`${texNombre(a + d)}x^2${texNombre(b + e)}x+${texNombre(c)}`)
          this.correction = `$\\begin{aligned}
          ${rienSi1(a)}x^2${ecritureAlgebrique(b)}x${ecritureAlgebrique(c)}${ecritureAlgebrique(d)}x^2+x&=
        (${a}${ecritureAlgebrique(d)})x^2+(${b}${ecritureAlgebrique(e)})x${ecritureAlgebrique(c)}\\\\
        &=${miseEnEvidence(this.reponse)}
          \\end{aligned}$`
        }
      }
    }

    this.canEnonce = this.question
    this.canReponseACompleter = ''
    if (!this.interactif) {
      this.question += '.'
    }
  }
}
