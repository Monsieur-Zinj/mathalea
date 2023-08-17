import { courbe } from '../../lib/2d/courbes.js'
import { plot } from '../../lib/2d/points.js'
import RepereBuilder from '../../lib/2d/RepereBuilder'
import { spline } from '../../lib/mathFonctions/Spline.js'
import { choice } from '../../lib/outils/arrayOutils.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { randint } from '../../modules/outils.js'
import Exercice from '../Exercice.js'

export const titre = 'Lecture graphique de domaine de définition'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '11/07/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '11/07/2023' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'e46e6'
export const ref = '200F3-02'

/**
 * trois niveaux, trouver les signes d'une fonction affine
 * @author Jean-Claude Lhote
 * Référence
 */
export default class LectureEnsebleDef extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.sup = 1
    this.besoinFormulaireNumerique = ['Niveau', 3]
  }

  nouvelleVersion () {
    // Dans ce modèle, j'ai pris la première question du fichier Doc-Automatismes-2de-acOT-GTCAN-2023.pdf.
    // La question posée est de lister tous les diviseurs d'un entier.
    // Selon le niveau choisi, on augmente la difficulté de l'entier choisi.
    // Le reste est identique pour les trois niveaux
    // Le bloc décidant de l'aléatoire
    function aleatoiriseSpline (noeuds) {
      const coeffX = choice([-1, 1]) // symétries ou pas
      const coeffY = choice([-1, 1])
      const deltaX = randint(-1, +1) // translations
      const deltaY = randint(-2, +2) / 2
      // la liste des noeuds de notre fonction
      const nuage = noeuds.map((noeud) => Object({
        x: (noeud.x + deltaX) * coeffX,
        y: (noeud.y + deltaY) * coeffY,
        deriveeGauche: noeud.deriveeGauche * coeffX * coeffY,
        deriveeDroit: noeud.deriveeDroit * coeffX * coeffY,
        isVisible: noeud.isVisible
      }))
      return spline(nuage)
    }

    const noeuds1 = [
      { x: -2 + randint(-1, 1), y: 1, deriveeGauche: 1, deriveeDroit: 1, isVisible: true },
      { x: 0, y: 2, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
      { x: 3, y: -2, deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
      { x: 5 + randint(-1, 1), y: 1, deriveeGauche: 1, deriveeDroit: 1, isVisible: true }
    ]
    const noeuds2 = [
      { x: -3 + randint(-1, 1), y: 3 + randint(-1, 1), deriveeGauche: -2, deriveeDroit: -2, isVisible: true },
      { x: -1, y: 0 + randint(-1, 1), deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
      { x: 1, y: -2 + randint(0, 1), deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
      { x: 3, y: 1 + randint(-1, 1), deriveeGauche: 0, deriveeDroit: 0, isVisible: false },
      { x: 5 + randint(-1, 1), y: -2 + randint(-1, 1), deriveeGauche: -2, deriveeDroit: -2, isVisible: true }
    ]
    let courbeAvecTrace, xmin, xmax, repere
    switch (this.sup) {
      case 1: { // défini aux 2 extrémités par des points d'abscisses entières
        const spline = aleatoiriseSpline(choice([noeuds1, noeuds2]))
        const { xMin, xMax, yMin, yMax } = spline.trouveMaxes()
                ;[xmin, xmax] = [xMin, xMax]
        repere = new RepereBuilder({
          xMin: xMin - 2,
          xMax: xMax + 2,
          yMin: yMin - 2,
          yMax: yMax + 2
        }).setGrille({ grilleX: true, grilleY: true }).buildStandard()
        courbeAvecTrace = spline.courbe({
          repere,
          ajouteNoeuds: true,
          optionsNoeuds: { style: '.', epaisseur: 2 }
        })//,
        //   arc(point(spline.x[0] - 0.1, spline.y[0] - 0.1), point(spline.x[0] - 0.1, spline.y[0]), point(spline.x[0] - 0.1, spline.y[0] + 0.1), false),
        //  arc(point(spline.x[spline.n - 1] + 0.1, spline.y[spline.n - 1] + 0.1), point(spline.x[spline.n - 1] + 0.1, spline.y[spline.n - 1]), point(spline.x[spline.n - 1] + 0.1, spline.y[spline.n - 1] - 0.1), false)]
      }
        break
      case 2: { // borné à droite mais pas à gauche.
        const dx = randint(-2, 2)
        const dy = randint(-2, 2) / 2
        const signe = choice([-1, 1])
        const parabole = x => signe * (x + dx) ** 2 + dy
        repere = new RepereBuilder({
          xMin: -5,
          xMax: 5,
          yMin: -5,
          yMax: 5
        }).setGrille({ grilleX: true, grilleY: true }).buildStandard()
        if (choice([true, false])) {
          xmin = -dx - 1
          xmax = '+\\infty'
          courbeAvecTrace = [
            courbe(parabole, { repere, xMin: -dx - 1, step: 0.05, epaisseur: 1 }),
            plot(-dx - 1, parabole(-dx - 1), { rayon: 0.1 })]
        } else {
          xmax = -dx + 1
          xmin = '-\\infty'
          courbeAvecTrace = [
            courbe(parabole, { repere, xMax: -dx + 1, step: 0.05, epaisseur: 1 }),
            plot(-dx + 1, parabole(-dx + 1), { rayon: 0.1 })]
        }
      }
        break
      case 3: { // cubique non bornée
        const dx = randint(-2, 2)
        const dy = randint(-2, 2) / 2
        const signe = choice([-1, 1])
        const hyperbole = x => signe * (x + dx) * (x - dx) * x + dy
        repere = new RepereBuilder({
          xMin: -5,
          xMax: 5,
          yMin: -5,
          yMax: 5
        }).setGrille({ grilleX: true, grilleY: true }).buildStandard()
        xmin = '-\\infty'
        xmax = '+\\infty'
        courbeAvecTrace = courbe(hyperbole, { repere, xMin: -5, xMax: 5, step: 0.05, epaisseur: 1 })
      }
        break
    }

    this.question = mathalea2d(Object.assign({}, fixeBordures([repere])), [repere, courbeAvecTrace]) + 'Quel est l\'ensemble de définition de la fonction représentée ci-dessus ?'
    this.correction = `L'ensemble de définition de la fonction est $${xmin === '-\\infty' ? ']' : '['}${xmin};${xmax}${xmax === '+\\infty' ? '[' : ']'}$.`
    this.reponse = `${xmin === '-\\infty' ? '\\left\\rbrack' : '\\left\\lbrack'}${xmin};${xmax}${xmax === '+\\infty' ? '\\right\\lbrack' : '\\right\\rbrack'}`
    this.formatInteractif = 'texte'
  }
}
