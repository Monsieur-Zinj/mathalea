import Exercice from '../Exercice.js'
import { randint } from '../../modules/outils.js'
import { createList } from '../../lib/format/lists'
export const titre = 'Somme de deux entiers'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '25/10/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '24/10/2021' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

export const uuid = 'fc42d'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Rémi Angot
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
  }

  nouvelleVersion () {
    const mesEntrees = [
      'foo',
      'bar',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc est est, porttitor quis ornare non, iaculis ut dolor. Vestibulum ipsum neque, varius ut lorem quis, posuere lobortis quam.',
      'boz'
    ]
    const listTypes = ['none', 'puces', 'carres', 'qcm', 'fleches', 'nombres', 'alpha', 'Alpha', 'roman', 'Roman']
    const a = randint(1, 10)
    const b = randint(1, 10)
    this.question = `$${a} + ${b} = ?$`
    for (const type of listTypes) {
      const maListe = createList(mesEntrees, type, 'space-y-4')
      this.question += maListe
    }
    this.correction = `$${a} + ${b} = ${a + b}$`
    this.reponse = a + b
  }
}
