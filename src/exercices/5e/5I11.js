/* eslint-disable camelcase */
import NoteLaCouleur6e from '../6e/6I11.js'
export const titre = 'Note la couleur (scratch) 5e'
export const interactifReady = true
export const interactifType = 'listeDeroulante'
export const dateDeModifImportante = '27/12/2023'

export const uuid = 'a7650'
export const ref = '5I11'
export const refs = {
  'fr-fr': ['5I11'],
  'fr-ch': []
}
export default function NoteLaCouleur5e () {
  NoteLaCouleur6e.call(this)
  this.relatif = true
}
