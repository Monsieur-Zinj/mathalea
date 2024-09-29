import { choice } from '../../lib/outils/arrayOutils.js'
import { texteGras } from '../../lib/format/style.js'
import { arrondi } from '../../lib/outils/nombres.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import { randint } from '../../modules/outils.js'
export const titre = 'Calculer la somme des termes d\'une suite géométrique'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '28/12/2022'

/**
 * Calculer \sum_{k=0}^n u_k, avec n et (u_n) (suite géométrique) données
 * @author Rémi Angot
 * Référence 1N13
*/
export const ref = '1AL11-5c'
export const refs = {
  'fr-fr': ['1AL11-5c'],
  'fr-ch': []
}

export const uuid = '974a9'
export default class SommeSuiteGeometrique extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 2
    this.spacingCorr = 3
    this.correctionDetaillee = true
    this.correctionDetailleeDisponible = true
  }

  nouvelleVersion () {
    const premierTerme = randint(2, 10)
    const premierRang = choice([0, 1])
    const q = arrondi(randint(2, 19, 10) / 10, 1)
    const n = choice([10, 12, 15])
    const u = choice(['u', 'v', 'w'])
    const besoinDArrondi = arrondi(premierTerme * (1 - q ** (n + 1)) / (1 - q), 7) !== arrondi(premierTerme * (1 - q ** (n + 1)) / (1 - q), 3)
    if (premierRang === 0) {
      this.question = `Soit $${u}$ la suite géométrique de premier terme $${u}_0 = ${premierTerme}$ et de raison $${texNombre(q)}$.`
      this.question += `<br>Calculer $\\displaystyle S = ${u}_0 + ${u}_1 + ... + ${u}_{${n}} =\\sum_{k=0}^{${n}}${u}_k$`
      this.question += besoinDArrondi ? ' et donner un arrondi au millième près.' : '.'
      this.reponse = arrondi(premierTerme * (1 - q ** (n + 1)) / (1 - q), 3)
      if (this.correctionDetaillee) {
        this.consigneCorrection = `${texteGras('Rappel')} : $1 + q + q^2 + ... + q^n = \\dfrac{1 - q^{n + 1}}{1 - q}$.`
        this.correction = `$S = \\underbrace{${premierTerme}}_{${u}_0} + (\\underbrace{${premierTerme} \\times ${texNombre(q)}}_{${u}_1}) + (\\underbrace{${premierTerme} \\times${texNombre(q)}^2}_{${u}_2}) + ... + (\\underbrace{${premierTerme} \\times ${texNombre(q)}^{${n}}}_{${u}_{${n}}})$`
        this.correction += `<br>$S = ${premierTerme} \\times (1 + ${texNombre(q)} + ${texNombre(q)}^2 + ... + ${texNombre(q)}^{${n}})$`
        this.correction += `<br>$S = ${premierTerme} \\times \\dfrac{1-${texNombre(q)}^{${n + 1}}}{1-${texNombre(q)}}$`
      } else {
        this.consigneCorrection = `${texteGras('Rappel')} : La somme $S$ de plusieurs termes consécutifs d'une suite géométrique de raison $q$ est telle que : `
        this.consigneCorrection += '<br>$S=\\left(1^\\text{er}\\text{ terme}\\times \\dfrac{1-q^{\\text{nombre de termes}}}{1-q}\\right)$.'
        this.correction = `D'après la formule du cours : $S = ${premierTerme} \\times \\dfrac{1-${texNombre(q)}^{${n + 1}}}{1-${texNombre(q)}}$.`
      }
    } else {
      this.question = `Soit $${u}$ la suite géométrique de premier terme $${u}_1 = ${premierTerme}$ et de raison $${texNombre(q)}$.`
      this.question += `<br>Calculer $\\displaystyle S = ${u}_1 + ${u}_2 + ... + ${u}_{${n}} =\\sum_{k=1}^{${n}}${u}_k$`
      this.question += besoinDArrondi ? ' et donner un arrondi au millième près.' : '.'
      this.reponse = arrondi(premierTerme * (1 - q ** (n)) / (1 - q), 3)
      if (this.correctionDetaillee) {
        this.consigneCorrection = `${texteGras('Rappel')} : $1 + q + q^2 + ... + q^n = \\dfrac{1 - q^{n + 1}}{1 - q}$.`
        this.correction = `$S = \\underbrace{${premierTerme}}_{${u}_1} + (\\underbrace{${premierTerme} \\times ${texNombre(q)}}_{${u}_2}) + (\\underbrace{${premierTerme} \\times${texNombre(q)}^2}_{${u}_3}) + ... + (\\underbrace{${premierTerme} \\times ${texNombre(q)}^{${n - 1}}}_{${u}_{${n}}})$`
        this.correction += `<br>$S = ${premierTerme} \\times (1 + ${texNombre(q)} + ${texNombre(q)}^2 + ... + ${texNombre(q)}^{${n - 1}})$`
        this.correction += `<br>$S = ${premierTerme} \\times \\dfrac{1-${texNombre(q)}^{${n}}}{1-${texNombre(q)}}$`
      } else {
        this.consigneCorrection = `${texteGras('Rappel')} : La somme $S$ de plusieurs termes consécutifs d'une suite géométrique de raison $q$ est telle que : `
        this.consigneCorrection += '<br>$S=\\left(1^\\text{er}\\text{ terme}\\times \\dfrac{1-q^{\\text{nombre de termes}}}{1-q}\\right)$.'
        this.correction = `D'après la formule du cours : $S = ${premierTerme} \\times \\dfrac{1-${texNombre(q)}^{${n}}}{1-${texNombre(q)}}$.`
      }
    }
    this.correction += `<br>$S ${besoinDArrondi ? '\\approx' : '='} ${texNombre(this.reponse)}$`
  }
}
