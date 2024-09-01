import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique } from '../../../lib/outils/ecritures'
export const titre = 'Résoudre une équation du type $(x+a)^2=k$'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '02/05/2024'
export const uuid = '74715'
export const refs = {
  'fr-fr': ['can2L14'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class EquationsCarree extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 ' + KeyboardType.lycee
    this.formatInteractif = 'calcul'
    this.compare = fonctionComparaison
    this.optionsDeComparaison = { ensembleDeNombres: true }
  }

  nouvelleVersion () {
    switch (choice([1, 1, 2, 2, 3])) {
      case 1 :// (x+a)^2=k k est un carré
        {
          const a = randint(-10, 10, 0)
          const k1 = randint(1, 10)
          const k = k1 ** 2
          const sol1 = -k1 - a
          const sol2 = k1 - a
          this.reponse = `\\{${sol1};${sol2}\\}`
          this.question = `Donner l'ensemble $S$ des solutions de l'équation  $(x${ecritureAlgebrique(a)})^2=${k}$.
          `
          if (this.interactif) {
            this.question += `<br>
          Respecter les notations pour écrire les solutions.<br>$S=$`
          }
          this.correction = `L'équation est de la forme $X^2=k$ avec $X=(x${ecritureAlgebrique(a)})$ et $k=${k}$.<br>
          Comme $k>0$, les solutions de $(x${ecritureAlgebrique(a)})^2=${k}$ sont données par les solutions de chacune des équations :           $x${ecritureAlgebrique(a)}=-\\sqrt{${k}}$ et $x${ecritureAlgebrique(a)}=\\sqrt{${k}}$.<br>
          $x${ecritureAlgebrique(a)}=${-k1}$ a pour solution $${sol1}$ et $x${ecritureAlgebrique(a)}=${k1}$ a pour solution $${sol2}$.<br>
          Ainsi, l'ensemble des solutions de l'équation est $S=${miseEnEvidence(this.reponse)}$.
           `
        }
        break
      case 2 :// (x+a)^2=k k non carré
        {
          const a = randint(-10, 10, 0)
          const k = choice([2, 3, 5, 6, 7, 10, 11, 13, 15, 21])
          this.reponse = `\\{-\\sqrt{${k}}${ecritureAlgebrique(-a)};\\sqrt{${k}}${ecritureAlgebrique(-a)}\\}`
          this.question = `Donner l'ensemble $S$ des solutions de l'équation  $(x${ecritureAlgebrique(a)})^2=${k}$.
          `
          if (this.interactif) {
            this.question += `<br>
          Respecter les notations pour écrire les solutions.<br>$S=$`
          }
          this.correction = `L'équation est de la forme $X^2=k$ avec $X=(x${ecritureAlgebrique(a)})$ et $k=${k}$.<br>
        Comme $k>0$, les solutions de $(x${ecritureAlgebrique(a)})^2=${k}$ sont données par les solutions de chacune des équations :         $x${ecritureAlgebrique(a)}=-\\sqrt{${k}}$ et $x${ecritureAlgebrique(a)}=\\sqrt{${k}}$.<br>
        $x${ecritureAlgebrique(a)}=-\\sqrt{${k}}$ a pour solution $-\\sqrt{${k}}${ecritureAlgebrique(-a)}$ et 
        $x${ecritureAlgebrique(a)}=\\sqrt{${k}}$ a pour solution $\\sqrt{${k}}${ecritureAlgebrique(-a)}$.<br>
        Ainsi, l'ensemble des solutions de l'équation est $S=${miseEnEvidence(this.reponse)}$.
         `
        }
        break
      case 3 :// (x+a)^2=k k négatif
        {
          const a = randint(-10, 10, 0)
          const k = randint(-10, -1)
          this.reponse = '\\emptyset'
          this.question = `Donner l'ensemble $S$ des solutions de l'équation  $(x${ecritureAlgebrique(a)})^2=${k}$.
          `
          if (this.interactif) {
            this.question += `<br>
          Respecter les notations pour écrire les solutions.<br>$S=$`
          }
          this.correction = `L'équation est de la forme $X^2=k$ avec $X=(x${ecritureAlgebrique(a)})$ et $k=${k}$.<br>
        Comme $k<0$, l'équation n'a pas de solution.<br>
        Ainsi, l'ensemble des solutions de l'équation est $S=${miseEnEvidence(this.reponse)}$.
         `
        }
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = '\\hspace{-2.5cm}$S=\\ldots$'
  }
}
