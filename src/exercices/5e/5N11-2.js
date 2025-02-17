import TableauxEtPourcentages from './_Tableaux_et_pourcentages.js'

export const titre = 'Tableaux et pourcentages - pourcentage constant'
export const interactifReady = false

/**
 * * Tableaux et pourcentages prix constant
 * * numéro de l'exo ex : 5N11-2 fils de 5N11-pere
 * * publication initiale le 28/11/2020
 * @author Sébastien Lozano
 */
export const uuid = '5a44b'
export const ref = '5N11-2'
export const refs = {
  'fr-fr': ['5N11-2'],
  'fr-ch': ['9NO14-5']
}
export default function TableauxEtPourcentagesPourcentConstant () {
  this.exo = '5N11-2'
  TableauxEtPourcentages.call(this)
}
