import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { expressionDeveloppeeEtReduiteCompare } from '../../../lib/interactif/comparisonFunctions'
import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, reduireAxPlusB, rienSi1 } from '../../../lib/outils/ecritures'
export const titre = 'Déterminer un seuil avec un fonction affine'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '03/05/2024'
export const uuid = '127d3'
export const refs = {
  'fr-fr': ['can2F21'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class seuilFctAff extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 nospacebefore ' + KeyboardType.clavierDeBase
    this.formatInteractif = 'calcul'
    this.compare = expressionDeveloppeeEtReduiteCompare
  }

  nouvelleVersion () {
    const nom = ['f', 'g', 'h']
    const nomF = choice(nom)
    const m = randint(1, 10)
    const k = randint(-10, -2)
    const p = k * m + randint(1, m)
    const choix = choice([true, false])
    if (Number.isInteger(-p / m)) {
      choix ? this.reponse = String(Math.ceil(-p / m) + 1) : this.reponse = String(Math.ceil(-p / m) - 1)
    } else { choix ? this.reponse = String(Math.ceil(-p / m)) : this.reponse = String(Math.floor(-p / m)) }
    this.question = `Soit la fonction $${nomF}$ 
    définie par $${nomF}(x)=${reduireAxPlusB(m, p)}$.<br>
    Déterminer le plus  ${choix ? 'petit ' : 'grand'} entier naturel $n$ tel que 
    $${nomF}(n)$ soit strictement ${choix ? 'positif.' : 'négatif.'}
    `
    this.correction = `On cherche le plus  ${choix ? 'petit ' : 'grand'} entier naturel $n$ vérifiant ${choix ? `$${nomF}(n)>0$` : `$${nomF}(n)<0$`}
    .<br>`
    if (Number.isInteger(-p / m)) {
      this.correction += `Comme ${choix ? `$${rienSi1(m)}n${ecritureAlgebrique(p)}>0$` : `$${rienSi1(m)}n${ecritureAlgebrique(p)}<0$`} équivaut à 
      ${choix ? `$n>${Math.ceil(-p / m)}$` : `$n<${Math.ceil(-p / m)}$`}  , le plus ${choix ? 'petit ' : 'grand'} entier naturel $n$ est donc $${miseEnEvidence(this.reponse)}$.`
    } else {
      this.correction += `Comme  ${choix ? `$${rienSi1(m)}n${ecritureAlgebrique(p)}>0$` : `$${rienSi1(m)}n${ecritureAlgebrique(p)}<0$`} équivaut à 
      ${choix ? `$n>\\dfrac{${-p}}{${m}}$` : `$n<\\dfrac{${-p}}{${m}}$`}, le plus ${choix ? 'petit ' : 'grand'} entier naturel $n$ est donc $${miseEnEvidence(this.reponse)}$.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
