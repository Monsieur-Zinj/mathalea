import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { puissanceEnProduit } from '../../lib/outils/puissance'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import { fraction } from '../../modules/fractions.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { sp } from '../../lib/outils/outilString.js'

export const titre = 'Donner l\'écriture entière d\'une puissance'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * Donner l'écriture décimale d'une puissance de 10
 * @author Rémi Angot
 */
export const uuid = '36f8b'
export const ref = '4C30-3'
export const refs = {
  'fr-fr': ['4C30-3'],
  'fr-ch': ['9NO5-2']
}
export default function EcritureDecimalePuissance () {
  Exercice.call(this)
  this.nbQuestions = 4
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = 1 // exposants positifs par défaut

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    const listeDeCalculs = combinaisonListes([[2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [6, 3], [7, 2], [7, 3], [8, 2], [8, 3], [9, 2], [9, 3]], this.nbQuestions)

    let listeTypeDeQuestions
    if (this.sup === 1) {
      listeTypeDeQuestions = combinaisonListes(['+'], this.nbQuestions)
      this.consigne = "Donner l'écriture sous la forme d'un nombre entier."
      this.consigne = this.nbQuestions === 1
        ? "Donner l'écriture du nombre suivant sous la forme d'un nombre entier."
        : "Donner l'écriture des nombres suivants sous la forme d'un nombre entier."
    } else if (this.sup === 2) {
      listeTypeDeQuestions = combinaisonListes(['-'], this.nbQuestions)
      this.consigne = this.nbQuestions === 1
        ? "Donner l'écriture du nombre suivant sous la forme d'une fraction."
        : "Donner l'écriture des nombres suivants sous la forme d'une fraction."
    } else if (this.sup === 3) {
      listeTypeDeQuestions = combinaisonListes(['+', '-'], this.nbQuestions)
      this.consigne = this.nbQuestions === 1
        ? "Donner l'écriture du nombre suivant sous la forme d'un nombre entier ou d'une fraction."
        : "Donner l'écriture des nombres suivants sous la forme d'un nombre entier ou d'une fraction."
    }
    for (let i = 0, texte, texteCorr, a, n, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (listeTypeDeQuestions[i]) {
        case '+':
          a = listeDeCalculs[i][0]
          n = listeDeCalculs[i][1]
          texte = `$${a}^{${n}}$`
          texteCorr = `$${a}^{${n}}=${puissanceEnProduit(a, n)}=${miseEnEvidence(texNombre(a ** n, 0))}$`
          setReponse(this, i, a ** n)
          break
        case '-':
          a = listeDeCalculs[i][0]
          n = listeDeCalculs[i][1]
          texte = `$${a}^{${-n}}$`
          texteCorr = `$${a}^{${-n}}=\\dfrac{1}{${a}^{${n}}}=\\dfrac{1}{${puissanceEnProduit(a, n)}}=${miseEnEvidence('\\dfrac{1}{' + texNombre(a ** n, 0)) + '}'}$`
          setReponse(this, i, fraction(1, a ** n), { formatInteractif: 'fraction' })
          break
      }

      texte += ajouteChampTexteMathLive(this, i, 'inline largeur15 nospacebefore', { texteAvant: sp(2) + '$=$' + sp(2) })

      if (this.questionJamaisPosee(i, listeTypeDeQuestions[i], a, n)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = false // A garder pour le clone 3C10-1
}
