import { droite } from '../../lib/2d/droites.js'
import RepereBuilder from '../../lib/2d/RepereBuilder'
import { tableauSignesFonction, trouveFonctionAffine } from '../../lib/mathFonctions/etudeFonction.js'
import { rationnalise } from '../../lib/mathFonctions/outilsMaths.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { randint } from '../../modules/outils.js'
import Exercice from '../Exercice'

export const titre = 'Lecture graphique du signe d\'une fonction affine'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '11/07/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '11/07/2023' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'e39b8'
export const ref = '200F3-01'

/**
 * trois niveaux, trouver les signes d'une fonction affine
 * @author Jean-Claude Lhote
 * Référence
 */
export default class LectureSigneAffine extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.sup = 3
    this.besoinFormulaireNumerique = ['Niveau', 3]
  }

  nouvelleVersion () {
    // Dans ce modèle, j'ai pris la première question du fichier Doc-Automatismes-2de-acOT-GTCAN-2023.pdf.
    // La question posée est de lister tous les diviseurs d'un entier.
    // Selon le niveau choisi, on augmente la difficulté de l'entier choisi.
    // Le reste est identique pour les trois niveaux
    // Le bloc décidant de l'aléatoire
    let a, b
    switch (this.sup) {
      case 1: // coefficient nul
        a = 0
        b = randint(-4, 4, 0)
        break
      case 2: { // coefficient entier relatif
        const y = randint(-3, 3, 0)
        const x = randint(-3, 3, 0)
                ;[a, b] = trouveFonctionAffine(0, y, x, 0)
      }
        break
      case 3: // coefficient rationnel
        b = 0
        a = Math.random() < 0.5 ? randint(-3, 3, 0) : 1 / randint(-4, 4, 0)
        break
    }
    a = rationnalise(a)
    b = rationnalise(b)
    const fonction = x => a.produitFraction(rationnalise(x)).sommeFraction(b)
    const tableau = tableauSignesFonction(fonction,
      -6,
      6,
      {
        step: 1,
        substituts: [
          { antVal: -6, antTex: '-\\infty' },
          { antVal: 6, antTex: '+\\infty' }
        ]
      })
    const repere = new RepereBuilder({ xMin: -6, xMax: 6, yMin: -6, yMax: 6 }).buildStandard()
    const d = droite(a.valeurDecimale, -1, b.valeurDecimale)
    this.question = 'Dresser le tableau de signes de la fonction représentée ci-dessous.<br>' + mathalea2d(Object.assign({}, fixeBordures([repere, d])), [repere, d])
    this.correction = 'Le tableau de signes de la fonction est représenté ci-dessous.<br>' + tableau
    this.reponse = '' // @fixme compléter choisir la forme de la réponse
  }
}
