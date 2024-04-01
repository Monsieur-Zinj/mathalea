import { choice } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const titre = 'Diviser un nombre décimal par 10, 100 ou 1000'
export const amcReady = true
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'
/**
 * Un entier à un 1 ou 2 chiffres, un nombre décimal avec une partie décimale à un ou 2 chiffres à diviser par 10, 100 ou 1000
 * @author Rémi Angot
 * Référence CM017
 */
export const uuid = 'fc635'
export const refs = {
  'fr-fr': ['CM017'],
  'fr-ch': []
}
export default function DiviserDecimalPar101001000 () {
  Exercice.call(this)
  this.consigne = 'Calculer.'
  this.nbQuestions = 10
  this.nbCols = 2
  this.nbColsCorr = 2
  this.tailleDiaporama = 3

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    for (
      let i = 0, texte, texteCorr, a, b, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      a = choice([
        randint(1, 9),
        randint(11, 99),
        calculANePlusJamaisUtiliser(randint(11, 99) / 10),
        calculANePlusJamaisUtiliser(randint(101, 999) / 100),
        calculANePlusJamaisUtiliser(randint(1, 9) / 10)
      ])
      b = choice([10, 100, 1000])
      texte = `$${texNombre(a)}\\div${texNombre(b)}=$`
      texteCorr = `$${texNombre(a)}\\div${texNombre(b)}=${texNombre(
                a / b
            )}$`
      setReponse(this, i, calculANePlusJamaisUtiliser(a / b))
      if (this.interactif) texte += ajouteChampTexteMathLive(this, i, 'largeur15 inline')

      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  // this.besoinFormulaireNumerique = ['Niveau de difficulté',3];
}
