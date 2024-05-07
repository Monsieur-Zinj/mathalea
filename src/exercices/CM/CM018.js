import { combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'

export const titre = 'Somme de deux nombres mariés et un entier'
export const amcReady = true
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'

/**
 * Somme de 3 nombres dont 2 ont des chiffres des unités compléments à 10
 * @author Rémi Angot
 * Référence CM018
 */
export const uuid = '678f9'
export const ref = 'CM018'
export const refs = {
  'fr-fr': ['CM018'],
  'fr-ch': []
}
export default function SommeDeDeuxNombresMariesEtUnEntier () {
  Exercice.call(this)
  this.consigne = 'Calculer.'
  this.nbQuestions = 10
  this.nbCols = 2
  this.nbColsCorr = 2
  this.tailleDiaporama = 3

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    const typesDeQuestionsDisponibles = [1, 2]
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    for (
      let i = 0, texte, texteCorr, a, b, c, u1, u2, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      u1 = randint(1, 9)
      u2 = 10 - u1
      a = randint(1, 4) * 10 + u1
      b = randint(1, 4) * 10 + u2
      c = randint(1, 100 - a - b)

      switch (listeTypeDeQuestions[i]) {
        case 1:
          texte = `$${a}+${b}+${c}=$`
          texteCorr = `$${a}+${b}+${c}=${a + b + c}$`
          break
        case 2:
          texte = `$${a}+${c}+${b}=$`
          texteCorr = `$${a}+${c}+${b}=${a + b + c}$`
          break
      }
      setReponse(this, i, a + b + c)
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
