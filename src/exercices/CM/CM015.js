import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Somme de deux nombres mariés'
export const amcReady = true
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'

/**
 * Somme de deux nombres dont les chiffres des unités sont des compléments à 10
 * @author Rémi Angot
 * Référence CM015
 */
export const uuid = 'fbd32'
export const ref = 'CM015'
export const refs = {
  'fr-fr': ['CM015'],
  'fr-ch': []
}
export default function SommeDeDeuxNombresMaries () {
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
      let i = 0, texte, texteCorr, a, b, u1, u2, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      u1 = randint(1, 9)
      u2 = 10 - u1
      a = randint(1, 9) * 10 + u1
      b = randint(1, 9) * 10 + u2

      texte = `$${a}+${b}=$`
      texteCorr = `$${a}+${b}=${a + b}$`
      setReponse(this, i, a + b)
      if (this.interactif) texte += ajouteChampTexteMathLive(this, i, '')

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
