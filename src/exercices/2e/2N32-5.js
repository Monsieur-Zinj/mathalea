import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { expressionDeveloppeeEtReduiteCompare } from '../../lib/interactif/comparisonFunctions'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'

export const titre = 'Appliquer la double distributivité avec les racines carrées'
export const dateDeModifImportante = '25/04/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * @author Stéphane Guyon
 */
export const uuid = '660de'
export const ref = '2N32-5'
export const refs = {
  'fr-fr': ['2N32-5'],
  'fr-ch': ['11NO1-8']
}
export default function DoubleDistributiviteAvecRacineCarree () {
  Exercice.call(this)
  this.nbQuestions = 5
  this.nbCols = 2
  this.nbColsCorr = 2

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const typesDeQuestionsDisponibles = [1, 2]; let typesDeQuestions
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    this.consigne = this.nbQuestions === 1 ? 'Effectuer le calcul suivant.' : 'Effectuer les calculs suivants.'
    for (let i = 0, texte, texteCorr, reponse, a1, a2, a, b1, b2, aa1, bb, aa2, aaa, bb1, bb2, bb3, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      switch (typesDeQuestions) {
        // Cas par cas, on définit le type de nombres que l'on souhaite
        // Combien de chiffres ? Quelles valeurs ?
        case 1:
          a1 = randint(2, 9) * choice([-1, 1])
          a = randint(2, 11, [4, 8, 9])
          b1 = randint(2, 9) * choice([-1, 1])
          a2 = randint(2, 9)
          b2 = randint(2, 9) * choice([-1, 1])
          aa1 = a1 * a2 * a
          bb = b1 * b2
          aa2 = a1 * b2 + b1 * a2
          aaa = aa1 + bb
          if (aa2 === 0) {
            b2 = -b2
            bb = b1 * b2
            aa2 = a1 * b2 + b1 * a2
            aaa = aa1 + bb
          }
          texte = `\\left(${a1}\\sqrt{${a}}${ecritureAlgebrique(b1)}\\right)\\left(${a2}\\sqrt{${a}}${ecritureAlgebrique(b2)}\\right)`
          reponse = `${aa2} \\sqrt{${a}}${ecritureAlgebrique(aaa)}`
          texteCorr = `$${texte}=${a1}\\sqrt{${a}}\\times ${a2}\\sqrt{${a}}${ecritureAlgebrique(a1)}\\sqrt{${a}} \\times ${ecritureParentheseSiNegatif(b2)}
                    ${ecritureAlgebrique(b1)} \\times ${a2}\\sqrt{${a}}${ecritureAlgebrique(b1)} \\times ${ecritureParentheseSiNegatif(b2)}$<br>
                    $\\phantom{${texte}}=${a1}\\times ${a}\\times ${a2}+ \\left( ${a1} \\times ${ecritureParentheseSiNegatif(b2)}${ecritureAlgebrique(b1)} \\times ${a2}\\right)\\sqrt{${a}} ${ecritureAlgebrique(bb)}$<br>
                    $\\phantom{${texte}}=${aa1}${ecritureAlgebrique(aa2)} \\sqrt{${a}}${ecritureAlgebrique(bb)}$<br>
                    $\\phantom{${texte}}=${miseEnEvidence(reponse)}$`
          break
        case 2:
          a1 = randint(2, 9) * choice([-1, 1])
          a = randint(2, 11, [4, 8, 9])
          b1 = randint(2, 9) * choice([-1, 1])
          b2 = randint(2, 9)
          a2 = randint(2, 9)
          aa1 = a1 * b2
          aa2 = a1 * a2
          bb = b1 * b2
          bb1 = b1 * a2
          bb2 = bb + aa2 * a
          bb3 = aa1 + bb1
          texte = `\\left(${a1}\\sqrt{${a}}${ecritureAlgebrique(b1)}\\right)\\left(${b2} ${ecritureAlgebrique(a2)}\\sqrt{${a}}\\right)`
          reponse = `${bb3}\\sqrt{${a}}${ecritureAlgebrique(bb2)}`
          texteCorr = `$${texte}=${a1}\\sqrt{${a}}\\times ${b2}${ecritureAlgebrique(a1)}\\sqrt{${a}} \\times ${ecritureParentheseSiNegatif(a2)}\\sqrt{${a}}${ecritureAlgebrique(b1)} \\times ${b2}  ${ecritureAlgebrique(b1)}  \\times ${a2}\\sqrt{${a}}$<br>
                    $\\phantom{${texte}}=${aa1}\\sqrt{${a}} ${ecritureAlgebrique(aa2)}\\times ${a} ${ecritureAlgebrique(bb)} ${ecritureAlgebrique(bb1)} \\sqrt{${a}}   $<br>
                    $\\phantom{${texte}}=${miseEnEvidence(reponse)}$`
          break
      }
      texte = `$${texte}$`
      texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore', { texteAvant: '$=$' })
      handleAnswers(this, i, { reponse: { value: reponse, compare: expressionDeveloppeeEtReduiteCompare } }, { formatInteractif: 'calcul' })

      if (this.questionJamaisPosee(i, a1, a2, a, b1, b2)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
