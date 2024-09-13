import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import NombrePeriodique from '../../modules/NombrePeriodique'
import { max, min, round } from 'mathjs'

export const titre = 'Convertir un nombre périodique en écriture décimale en fraction irréductible'
export const dateDePublication = '12/09/2024'
export const interactifReady = false
export const uuid = '8f8bc'
export const refs = {
  'fr-ch': ['9NO12-112'],
  'fr-fr': []
}

/**
 * Description didactique de l'exercice
 * @author Nathan Scheinmann
 */

export default class NombrePeriodiqueVersFraction extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 3
    this.consigne = ''
    this.besoinFormulaireNumerique = ['Longueur maximale de la période', 4, '1\n2\n3\n4']
    this.besoinFormulaire2Numerique = ['Nombre de chiffres maximum dans la partie entière', 3, '1\n2\n3']
    this.besoinFormulaire3Numerique = ['Nombre de chiffres maximum dans la partie décimale (hors période)', 3, '0\n1\n2\n3']
    this.besoinFormulaire4CaseACocher = ['Partie entière égale à 0']
    this.besoinFormulaire5CaseACocher = ['Indiquer que la calculatrice est autorisée']
    this.sup = 2
    this.sup2 = 1
    this.sup3 = 1
    this.sup4 = false
    this.sup5 = true
  }

  nouvelleVersion () {
    this.consigne = `Transformer en fraction irréductible ${this.nbQuestions > 1 ? 'les nombres périodiques suivants' : 'le nombre périodique suivant'}.`
    if (this.sup5) {
      this.consigne += ' La calculatrice est autorisée.'
    }
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const periode = round(randint(10 ** (this.sup - 2), 10 ** this.sup - 1) / (10 ** randint(0, this.sup - 1)))
      let entier = round(randint(10 ** (this.sup2 - 2), 10 ** this.sup2 - 1) / (10 ** randint(0, this.sup2 - 1)))
      let decimal = round(randint(min(1, max(0, 10 ** (this.sup3 - 2) - 1)), 10 ** (this.sup3 - 1) - 1) / (10 ** randint(0, this.sup3 - 1)))
      if (this.sup3 === 1) {
        decimal = -1
      }
      if (this.sup4 === true) {
        entier = 0
      }
      const nombrePerio = new NombrePeriodique(entier, decimal, periode)
      let texte = ''
      let texteCorr = ''

      texte = `$${nombrePerio.toString()}$`
      texteCorr = `${nombrePerio.toFractionProcedure()}`

      if (this.questionJamaisPosee(i, periode)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
