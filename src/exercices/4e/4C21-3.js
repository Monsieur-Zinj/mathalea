import { ExoRose } from '../6e/_Roses.js'
export const titre = 'Résoudre une Rose additive avec des fractions'
export const interactifReady = true
export const interactifType = 'custom'
export const dateDePublication = '12/08/2022'

/**
 * Travailler les sommes de fractions
 * @author Jean-Claude Lhote
 */

export const uuid = '0576d'
export const ref = '4C21-3'
export default function RoseAdditive4F2 () { // c'est l'ExoRose zéro contenu dans _Roses.js
  ExoRose.call(this) // Héritage de la classe Exercice()
  this.operation = 'addition'
  this.typeDonnees = 'fractions dénominateurs multiples'
  this.besoinFormulaireNumerique = ['Valeur maximale (entre 10 et 30) des termes', 30]
  this.besoinFormulaire2Numerique = ['Nombre de termes entre 3 et 5', 5]
  this.besoinFormulaire3Numerique = ['Type de questions', 4, '1 : Calculer les sommes\n2 : Calculer les termes manquants\n3 : Course aux nombres 1\n4 : Course aux nombres 2']
}
