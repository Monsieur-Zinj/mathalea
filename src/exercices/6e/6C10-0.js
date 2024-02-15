import { ExoRose } from './_Roses.js'
export const titre = 'Résoudre une Rose additive'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDePublication = '12/08/2022'
export const dateDeModifImportante = '26/09/2023'
/**
 * Travailler les tables d'addition autrement
 * @author Jean-Claude Lhote
 */

export const uuid = '322a0'
export const ref = '6C10-0'
export const refs = {
  'fr-fr': ['6C10-0'],
  'fr-ch': []
}
export default function RoseAdditive () { // c'est l'ExoRose zéro contenu dans _Roses.js
  ExoRose.call(this) // Héritage de la classe Exercice()
  this.operation = 'addition'
  this.typeDonnees = 'entiers'
  this.besoinFormulaireNumerique = ['Valeur maximale (entre 10 et 30) des termes', 30]
  this.besoinFormulaire2Numerique = ['Nombre de termes (entre 3 et 9)', 9]
  this.besoinFormulaire3Numerique = ['Type de questions', 4, '1 : Calculer les sommes\n2 : Calculer les termes manquants\n3 : Course aux nombres 1\n4 : Course aux nombres 2']
}
