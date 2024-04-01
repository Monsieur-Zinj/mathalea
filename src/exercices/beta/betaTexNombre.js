import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import Decimal from 'decimal.js'
import { all, create } from 'mathjs'
export const titre = 'Somme de deux entier'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '25/10/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '24/10/2021' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'efeee'
const bmath = create(all)

bmath.config({ number: 'BigNumber' })

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Rémi Angot
 * Référence
*/
export default function NomExercice () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.sup = 0.001
  this.sup2 = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    Decimal.set({ precision: 40, toExpNeg: -40, toExpPos: 40 })
    const a = 1000000000 // parseFloat(this.sup)
    this.listeQuestions = [`StringNombre :  ${stringNombre(a)}        TexNombre : $${texNombre(a)}$<br>`]
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Nombre à tester :']
  this.besoinFormulaire2Numerique = ['Précision voulue :', 6]
  this.besoinFormulaire3CaseACocher = ['Completer zéros : ']
  this.besoinFormulaire4CaseACocher = ['Aussi completer entiers : ']
}
