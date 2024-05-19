import { courbe, croche } from '../../lib/2d/courbes.js'
import { plot } from '../../lib/2d/points.js'
import RepereBuilder from '../../lib/2d/RepereBuilder'
import { spline } from '../../lib/mathFonctions/Spline.js'
import { choice } from '../../lib/outils/arrayOutils'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { randint } from '../../modules/outils.js'
import Exercice from '../Exercice'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre = 'Lecture graphique de domaine de définition'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '11/07/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '11/07/2023' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const uuid = 'e46e6'
export const ref = '200F3-02'
export const refs = {
  'fr-fr': ['200F3-02'],
  'fr-ch': ['11FA7-5']
}

/**
 * trois niveaux, trouver les signes d'une fonction affine
 * @author Jean-Claude Lhote
 */
export default class LectureEnsebleDef extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.sup = 1
    this.besoinFormulaireNumerique = ['Niveau', 3]
    this.formatChampTexte = KeyboardType.clavierEnsemble
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
    let ouvertDroit, ouvertGauche
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
        ouvertGauche = Math.random() < 0.5
        ouvertDroit = Math.random() < 0.5

        courbeAvecTrace = [spline.courbe({
          repere,
          color: 'blue',
          ajouteNoeuds: false,
          optionsNoeuds: { style: '.', epaisseur: 2 }
        })]
        if (ouvertGauche) {
          courbeAvecTrace.push(
            croche(spline.x[0], spline.y[0], 'gauche', 0.1, 'blue')
          )
        } else {
          courbeAvecTrace.push(plot(spline.x[0], spline.y[0], { couleur: 'blue' }))
        }
        if (ouvertDroit) {
          courbeAvecTrace.push(
            croche(spline.x[spline.n - 1], spline.y[spline.n - 1], 'droit', 0.1, 'blue')
          )
        } else {
          courbeAvecTrace.push(plot(spline.x[spline.n - 1], spline.y[spline.n - 1], { couleur: 'blue' }))
        }
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
          ouvertGauche = false
          ouvertDroit = true
          courbeAvecTrace = [
            courbe(parabole, { repere, xMin: -dx - 1, step: 0.05, epaisseur: 1 }),
            plot(-dx - 1, parabole(-dx - 1), { rayon: 0.1 })]
        } else {
          xmax = -dx + 1
          xmin = '-\\infty'
          ouvertGauche = true
          ouvertDroit = false
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
        ouvertGauche = true
        ouvertDroit = true
        courbeAvecTrace = courbe(hyperbole, { repere, xMin: -5, xMax: 5, step: 0.05, epaisseur: 1 })
      }
        break
    }

    this.question = mathalea2d(Object.assign({}, fixeBordures([repere])), [repere, courbeAvecTrace]) + 'Quel est l\'ensemble de définition de la fonction représentée ci-dessus ?'
    this.correction = `L'ensemble de définition de la fonction est $${ouvertGauche ? ']' : '['}${xmin};${xmax}${ouvertDroit ? '[' : ']'}$.`
    this.reponse = {
      reponse: {
        value: `${ouvertGauche ? '\\left\\rbrack' : '\\left\\lbrack'}${xmin};${xmax}${ouvertDroit ? '\\right\\lbrack' : '\\right\\rbrack'}`,
        compare: fonctionComparaison,
        options: { intervalle: true }
      }
    }
  }
}
