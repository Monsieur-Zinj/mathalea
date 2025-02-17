import ConstruireUnTriangle from '../6e/6G21.js'

export const titre = 'Construire un triangle quelconque avec les instruments et auto-vérification'
export const interactifReady = false
export const dateDePublication = '17/12/2022'

/**
 * Construire un triangle quelconque avec les instruments et auto-vérification
 *
 * @author Mickael Guironnet
 */
export const uuid = 'f4fdd'
export const ref = '6G21-2'
export const refs = {
  'fr-fr': ['6G21-2'],
  'fr-ch': ['9ES4-9']
}
export default class ConstruireUnTriangleQuelconque extends ConstruireUnTriangle {
  constructor () {
    super()
    this.titre = titre
    this.sup = 4
    this.nbQuestions = 6
  }
}
