import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { arrondi } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.ts'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { approximatelyCompare } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Exprimer une fraction sous la forme d\'une valeur approchée d\'un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '06/02/2021'
export const dateDeModifImportante = '10/01/2024'

/**
 * Déterminer une valeur approchée d'un pourcentage à l'aide de la calculatrice
 * @author Rémi Angot
 * Ajout de l'interactivité par Guillaume Valmont le 17/03/2022
 * Amélioration de l'interactivité par Eric Elter le 10/01/2024
 */
export const uuid = '6b534'
export const ref = '5N11-4'
export const refs = {
  'fr-fr': ['5N11-4'],
  'fr-ch': ['9NO14-7']
}
export default function ValeurApprocheeDePourcentages () {
  Exercice.call(this)
  this.titre = titre
  this.nbQuestions = 6
  this.nbCols = 2 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 2 // Uniquement pour la sortie LaTeX
  this.sup = 1 // Niveau de difficulté
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const denominateurDisponibles = [100, 200, 300, 1000]
    const listeTypeDeQuestions = combinaisonListes(denominateurDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    this.consigne = this.interactif
      ? (this.sup === 1
          ? "À l'aide de la calculatrice, donner une valeur sous la forme d'un pourcentage à l'unité près."
          : "À l'aide de la calculatrice, donner une valeur sous la forme d'un pourcentage au dixième près."
        )
      : (this.sup === 1
          ? "À l'aide de la calculatrice, donner une valeur approchée au centième près du quotient puis l'écrire sous la forme d'un pourcentage à l'unité près."
          : "À l'aide de la calculatrice, donner une valeur approchée au millième près du quotient puis l'écrire sous la forme d'un pourcentage au dixième près."
        )

    for (let i = 0, texte, texteCorr, num, den, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      den = randint(10, listeTypeDeQuestions[i])
      num = randint(1, den - 8)
      while (Math.round(num * 10000 / den) === 10000 * num / den) {
        den = randint(10, listeTypeDeQuestions[i])
        num = randint(1, den - 8)
      }
      texte = `$\\dfrac{${num}}{${den}}\\approx$`
      texte += remplisLesBlancs(this, i, '%{champ1}\\text{ soit environ }%{champ2}\\%', 'inline50', '\\ldots\\ldots\\ldots')
      // this.interactif ? '$' : '\\ldots\\ldots\\ldots $ soit environ $\\ldots\\ldots\\ldots~\\%$'
      // texte += ajouteChampTexteMathLive(this, i, 'inline largeur01 nospacebefore', { texteApres: ' %' })

      if (this.sup === 1) {
        texteCorr = `$\\dfrac{${num}}{${den}}\\approx ${texNombre(num / den, 2)} $ soit environ $${miseEnEvidence(texNombre(num / den * 100, 0))}~\\%$ $\\left(\\text{car } ${texNombre(num / den, 2)}=\\dfrac{${arrondi(num / den * 100, 0)}}{100}\\right)$.`
        // setReponse(this, i, arrondi(num / den * 100, 0))
        handleAnswers(this, i, {
          bareme: (listePoints) => [listePoints[0] + listePoints[1], 2],
          champ1: { value: (num / den).toFixed(3), options: { tolerance: 0.01 }, compare: approximatelyCompare },
          champ2: { value: (100 * num / den).toFixed(0), options: { tolerance: 1 }, compare: approximatelyCompare }
        }, { formatInteractif: 'fillInTheBlank' })
      }
      if (this.sup === 2) {
        texteCorr = `$\\dfrac{${num}}{${den}}\\approx ${texNombre(num / den, 3)} $ soit environ $${miseEnEvidence(texNombre(num / den * 100, 1))}~\\%$ $\\left(\\text{car } ${texNombre(num / den, 3)}=\\dfrac{${arrondi(num / den * 100, 1)}}{100}\\right)$.`
        // setReponse(this, i, arrondi(num / den * 100, 0))
        handleAnswers(this, i, {
          bareme: (listePoints) => [listePoints[0] + listePoints[1], 2],
          champ1: { value: (num / den).toFixed(3), options: { tolerance: 0.001 }, compare: approximatelyCompare },
          champ2: { value: (100 * num / den).toFixed(1), options: { tolerance: 0.1 }, compare: approximatelyCompare }
        }, { formatInteractif: 'fillInTheBlank' })
      }

      if (this.questionJamaisPosee(i, num, den)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de précision', 2, "1 : Donner un pourcentage à l'unité près\n2 : Donner un pourcentage au dixième près"]
}
