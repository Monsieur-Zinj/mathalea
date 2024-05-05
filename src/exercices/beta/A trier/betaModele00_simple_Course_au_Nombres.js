import Exercice from '../../Exercice'
import { randint } from '../../../modules/outils.js'
import { texNombre } from '../../../lib/outils/texNombre'
export const titre = 'Somme de deux entiers'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '25/10/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '24/10/2021' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = '57cf4'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Rémi Angot
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
  }

  nouvelleVersion () {
    const a = randint(1, 10)
    const b = randint(1, 10)
    this.question = `$${texNombre(a, 0)}+${texNombre(b, 0)}$`
    this.correction = `$${texNombre(a, 0)} + ${texNombre(b, 0)} = ${texNombre(a + b, 0)}$`
    this.reponse = a + b
  }
}
