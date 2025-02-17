import EgalitesEntreFractions from '../6e/6N41.js'
export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Égalités entre fractions simples'

/**
 * Écrire une fraction avec un nouveau dénominateur qui est un multiple de son dénominateur (ce multiple est inférieur à une valeur maximale de 11 par défaut)
 * @author Rémi Angot
 * 5N13-2 et 6N41
 */
export const uuid = '4718e'
export const ref = '5N13-2'
export const refs = {
  'fr-fr': ['5N13-2'],
  'fr-ch': ['9NO12-4']
}
export default function EgalitesEntreFractions5e () {
  EgalitesEntreFractions.call(this)
  this.titre = titre
  this.interactifReady = interactifReady
  this.interactifType = interactifType
}
