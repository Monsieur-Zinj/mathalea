import { repere } from '../../lib/2d/reperes.js'
import { spline } from '../../lib/mathFonctions/Spline.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import Exercice from '../deprecatedExercice.js'

export const titre = 'Interpollation par splines avec tangentes'
export const ref = 'P021'
export const refs = {
  'fr-fr': ['P021'],
  'fr-ch': []
}
export const uuid = '4c7ca'

/**
 * Trace une courbe interpolee par des splines version cubiques avec tangentes
 * @author Jean-Claude Lhote
 * Référence P021
 */
export default function TraceCourbeSpline () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 1
  this.nbQuestionsModifiable = false
  this.nbCols = 1 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  this.sup = '(-3;-2)/(-1;0)/(1;-3)/(3;4)' // liste de points
  this.sup2 = '(2;2)/(0;0)/(0;0)/(1;1)'
  this.sup3 = '1/1/1/1'
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url

  this.nouvelleVersion = function () {
    const noeuds = []
    const listeCoords = this.sup.split('/')
    const listePentes = this.sup2.split('/')
    const listeVisibles = this.sup3.split('/')
    if (listeCoords.length < 2) return
    for (let i = 0; i < listeCoords.length; i++) {
      const coordonnees = listeCoords[i].slice(1, -1).split(';')
      const x = Number(coordonnees[0].replace(',', '.'))
      const y = Number(coordonnees[1].replace(',', '.'))
      noeuds.push({ x, y })
    }
    for (let i = 0; i < noeuds.length; i++) {
      let pentes = listePentes[i].slice(1, -1).split(';')
      if (pentes == null) {
        pentes = [0, 0]
      } else {
        pentes = [Number(pentes[0].replace(',', '.')), Number(pentes[1].replace(',', '.'))]
      }
      noeuds[i].deriveeGauche = pentes[0]
      noeuds[i].deriveeDroit = pentes[1]
    }
    for (let i = 0; i < noeuds.length; i++) {
      noeuds[i].isVisible = !(listeVisibles[i] === null || listeVisibles[i] === '0')
    }

    const f = spline(noeuds)
    const { xMin, xMax, yMin, yMax } = f.trouveMaxes()
    const r = repere({ xMin, xMax, yMin, yMax })
    const c = f.courbe({ repere: r, ajouteNoeuds: true })
    const objets = [r, c]
    this.contenu = mathalea2d(Object.assign({}, fixeBordures(objets)), objets)
    this.listeQuestions[0] = this.contenu
  }
  this.besoinFormulaireTexte = ['Liste des coordonnées sous la forme: (x0;y0)/(x1;y1)/...']
  this.besoinFormulaire2Texte = ['Liste des nombres dérivés sous la forme (gauche0;droite0)/(gauche1;droite1)/...']
  this.besoinFormulaire3Texte = ['Etat visible(1)/invisible(0) de chaque noeud sous la forme 0/1/...']
}
