import { choice } from '../../../lib/outils/arrayOutils.js'
import Exercice from '../../Exercice.js'
import { randint } from '../../../modules/outils.js'
import { creerNomDePolygone } from '../../../lib/outils/outilString.js'
export const titre = 'Trouver la longueur d\'un côté de triangle rectangle'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '01/10/2023'

/**
 * @author Jean-Claude  Lhote
 * Référence can4G09
 * Date de publication 1/10/2023
 */
export const uuid = '96bcd'
export const ref = 'can4G09'
export default function TripletsPythagoriciens () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
  this.formatChampTexte = 'largeur15 inline'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    const listeTripletsPythagoriciens = [
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [8, 15, 17],
      [9, 12, 15],
      [12, 16, 20],
      [15, 20, 25]
    ]
    const triplet = choice(listeTripletsPythagoriciens)
    const nom = Array.from(creerNomDePolygone(3))
    const index = choice([0, 1, 2])
    this.question = `Dans le triangle $${nom.join('')}$ rectangle en $${nom[2]}$, `
    if (index < 2) { // calcul du côté d'un angle droit
      this.question += `$${nom[0]}${nom[2]}=${triplet[1 - index]}$cm, $${nom[1]}${nom[2]}=${triplet[index]}$cm.<br>Calculer $${nom[0]}${nom[1]}$.`
      this.correction = `D'après le théorème de Pythagore, $${nom[0]}${nom[1]}^2=${nom[0]}${nom[2]}^2+${nom[1]}${nom[2]}^2=${triplet[1 - index]}^2+${triplet[index]}^2=${triplet[1 - index] ** 2}+${triplet[index] ** 2}=${triplet[1 - index] ** 2 + triplet[index] ** 2}$.<br>`
      this.correction += `D'où $${nom[0]}${nom[1]}=\\sqrt{${triplet[1 - index] ** 2 + triplet[index] ** 2}}=${triplet[2]}$.`
      this.reponse = triplet[2]
    } else { // calcul de l'hypoténuse
      const index2 = randint(0, 1)
      this.question += `$${nom[0]}${nom[1]}=${triplet[2]}$cm, $${nom[index2]}${nom[2]}=${triplet[index2]}$cm.<br>Calculer $${nom[1 - index2]}${nom[2]}$.`
      this.correction = `D'après le théorème de Pythagore, $${nom[0]}${nom[1]}^2=${nom[0]}${nom[2]}^2+${nom[1]}${nom[2]}^2$.<br>`
      this.correction += `Donc $${nom[1 - index2]}${nom[2]}^2=${triplet[2]}^2-${triplet[index2]}^2=${triplet[2] ** 2}-${triplet[index2] ** 2}=${triplet[2] ** 2 - triplet[index2] ** 2}$.<br>`
      this.correction += `D'où $${nom[1 - index2]}${nom[2]}=\\sqrt{${triplet[2] ** 2 - triplet[index2] ** 2}}=${triplet[1 - index2]}$.`
      this.reponse = triplet[1 - index2]
    }
  }
}
