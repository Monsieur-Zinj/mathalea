import { courbe } from '../../../lib/2d/courbes.js'
import { repere } from '../../../lib/2d/reperes.js'
import { texteParPosition } from '../../../lib/2d/textes.ts'
import { choice } from '../../../lib/outils/arrayOutils'
import { point, tracePoint } from '../../../lib/2d/points.js'
import { rienSi1 } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../../lib/interactif/gestionInteractif.js'
export const titre = 'Déterminer graphiquement la valeur de $b$ avec une parabole'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '08/06/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '11/10/2023'// j'ai enlevé c. J'ai ajoute a=-1
/**
 *
 * @author Gilles Mora
 * Référence can1F05
 */
export const uuid = '053d7'
export const ref = 'can1F05'
export const refs = {
  'fr-fr': ['can1F05'],
  'fr-ch': []
}
export default function LectureGraphiqueParabolebEtc () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.formatChampTexte = 'largeur10 inline'
  this.tailleDiaporama = 2

  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let texte, texteCorr, alpha, beta, r, o, f, a, A, traceA
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      alpha = randint(-3, 3)
      beta = randint(-2, 2)
      a = choice([-1, 1])
      o = texteParPosition('O', -0.3, -0.3, 'milieu', 'black', 1)
      A = point(alpha, beta)

      traceA = tracePoint(A, 'blue') // Variable qui trace les points avec une croix
      f = x => a * (x - alpha) ** 2 + beta
      r = repere({
        yUnite: 1,
        xMin: -5,
        yMin: -4,
        yMax: 4,
        xMax: 5,
        thickHauteur: 0.1,
        xLabelMin: -4,
        xLabelMax: 4,
        yLabelMax: 3,
        yLabelMin: -3,
        // yLabelMin: -9,
        // yLabelListe:[-8,-6,-4,-2,2,4,6,8],
        axeXStyle: '->',
        axeYStyle: '->'
      })

      texte = `La courbe représente une fonction $f$ définie par $f(x)=${rienSi1(a)}x^2+bx+c$.<br>
      Déterminer la valeur de $b$.<br>`
      texte += mathalea2d({
        xmin: -5,
        xmax: 5.05,
        ymin: -4,
        ymax: 4, // Math.max(3, f(0) + 1),
        pixelsParCm: 25,
        scale: 0.6,
        style: 'margin: auto'
      }, r, o, traceA, courbe(f, { repere: r, color: 'blue', epaisseur: 2 }))

      if (this.interactif) {
        texte += ajouteChampTexteMathLive(this, i, 'largeur10 inline nospacebefore', { texteAvant: '$b=$' })

        setReponse(this, i, -2 * a * alpha)
      }

      texteCorr = `L'abscisse du sommet de la parabole est $${alpha}$.<br>
          Comme l'abscisse du sommet est  donné par $-\\dfrac{b}{2a}$, alors $-\\dfrac{b}{2a}=${alpha}$.<br>
          L'énoncé indique que $a=${a}$, on en déduit $-\\dfrac{b}{${2 * a}}=${alpha}$, soit $b=${a * alpha * (-2)}$.`

      if (this.questionJamaisPosee(i, alpha, beta)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.listeCanEnonces.push(texte)
        this.listeCanReponsesACompleter.push('$b=\\ldots$')
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
