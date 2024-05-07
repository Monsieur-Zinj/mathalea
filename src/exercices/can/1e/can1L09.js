import { ecritureAlgebrique, reduirePolynomeDegre3, rienSi1 } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'

import { setReponse } from '../../../lib/interactif/gestionInteractif.ts'

export const titre = 'Résoudre une équation $ax^2+bx+c=c$ '
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '19/06/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 *
 * @author Gilles Mora
 * Référence can1L09
 */
export const uuid = '6adb0'
export const ref = 'can1L09'
export const refs = {
  'fr-fr': ['can1L09'],
  'fr-ch': []
}
export default function EquationSecondDegreParticuliere () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.formatChampTexte = 'largeur15 inline'
  this.tailleDiaporama = 2

  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    let texte, texteCorr, a, b, c, f
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      a = randint(-10, 10, 0)
      b = randint(-10, 10, 0)
      c = randint(-10, 10, 0)
      f = new FractionEtendue(-b, a)
      texte = `Donner l'ensemble des solutions $\\mathscr{S}$ de l'équation : $${reduirePolynomeDegre3(0, a, b, c)}=${c}$.`
      if (this.interactif) {
        texte += 'Écrire les solutions dans l\'ordre croissant :<br> $\\mathscr{S}=\\bigg\\{$'
        texte += ajouteChampTexteMathLive(this, 2 * i, 'largeur15 inline')
        texte += ' ; '
        texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur15 inline') + '$\\bigg\\}$'
        if (-b / a > 0) {
          setReponse(this, 2 * i, 0)
          setReponse(this, 2 * i + 1, f, { formatInteractif: 'fractionEgale' })
        } else {
          setReponse(this, 2 * i, f, { formatInteractif: 'fractionEgale' })
          setReponse(this, 2 * i + 1, 0)
        }
      }

      texteCorr = `L'équation $${reduirePolynomeDegre3(0, a, b, c)}=${c}$ s'écrit $${reduirePolynomeDegre3(0, a, b, 0)}=0$.<br>
          En factorisant le premier membre (facteur commun $x$), on obtient $x(${rienSi1(a)}x${ecritureAlgebrique(b)})=0$.<br>
          On reconnaît une équation produit nul dont les solutions sont : $0$ et $\\dfrac{${-b}}{${a}}${f.texSimplificationAvecEtapes()}$`

      if (this.questionJamaisPosee(i, a, b, c)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    this.canEnonce = texte
    this.canReponseACompleter = ''
  }
}
