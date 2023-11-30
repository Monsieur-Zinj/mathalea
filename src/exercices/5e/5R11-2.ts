import { point, tracePoint } from '../../lib/2d/points.js'
import { droiteGraduee } from '../../lib/2d/reperes.js'
import { labelPoint } from '../../lib/2d/textes.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { arrondi } from '../../lib/outils/nombres.js'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../ExerciceTs'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint, egal } from '../../modules/outils.js'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'

export const titre = 'Placer un point d\'abscisse un nombre relatif'

/**
* Placer un point d'abscisse un nombre relatif
* @author Jean-Claude Lhote et Rémi Angot
* Référence 5R11-2
*/
export const uuid = '6d576'
export const ref = '5R11-2'

class PlacerPointsSurAxeRelatifs extends Exercice {
  constructor () {
    super()
    this.consigne = ''
    this.nbQuestions = 5
    this.nbQuestionsModifiable = true
    this.nbCols = 1
    this.nbColsCorr = 1
    this.spacing = 1
    this.spacingCorr = 1
    this.sup = 1
    this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, '1 : Nombre relatif à une décimale\n2 : Nombre relatif à deux décimales\n3 : Nombre relatif à trois décimales\n4 : Mélange']
    this.listePackages = ['tkz-euclide']
  }

  nouvelleVersion () {
    if (this.interactif) this.consigne = 'Placer les points sur la droite graduée, puis vérifier la réponse.'
    let typesDeQuestions
    const pointsSolutions = []
    let objets = []
    let objetsCorr = []
    const pointsNonSolutions = [] // Pour chaque question, la liste des points qui ne doivent pas être cliqués
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.contenu = '' // Liste de questions
    this.contenuCorrection = '' // Liste de questions corrigées
    if (this.sup === 4) { typesDeQuestions = combinaisonListes([1, 2, 3], this.nbQuestions) } else { typesDeQuestions = combinaisonListes([parseInt(this.sup)], this.nbQuestions) }

    this.contenu = this.consigne
    for (let i = 0, abs0, abs1, abs2, abs3, l1, l2, l3, x1, x2, x3, x11, x22, x33, A, B, C, pas1, pas2, texte, texteCorr; i < this.nbQuestions; i++) {
      pointsNonSolutions[i] = []
      pointsSolutions[i] = []
      l1 = lettreDepuisChiffre(i * 3 + 1)
      l2 = lettreDepuisChiffre(i * 3 + 2)
      l3 = lettreDepuisChiffre(i * 3 + 3)
      objets = []
      objetsCorr = []
      switch (typesDeQuestions[i]) {
        case 1: // Placer des décimaux relatifs sur un axe (1 décimale)
          abs0 = randint(-7, -3)
          pas1 = 1
          pas2 = 10
          break

        case 2: // Placer des décimaux relatifs sur un axe (2 décimales)
          abs0 = randint(-4, -2) / 10
          pas1 = 10
          pas2 = 10
          break

        default: // Placer des décimaux relatifs sur un axe (3 décimales)
          abs0 = randint(-10, -2) / 100
          pas1 = 100
          pas2 = 10
          break
      }
      x1 = randint(0, 2); x2 = randint(3, 4); x3 = randint(5, 6)
      x11 = randint(1, 9); x22 = randint(1, 9); x33 = randint(1, 3)
      abs1 = arrondi(abs0 + x1 / pas1 + x11 / pas1 / pas2, typesDeQuestions[i]) // le type de questions est égal au nombre de décimales.
      abs2 = arrondi(abs0 + x2 / pas1 + x22 / pas1 / pas2, typesDeQuestions[i])
      abs3 = arrondi(abs0 + x3 / pas1 + x33 / pas1 / pas2, typesDeQuestions[i])

      A = point(changeCoord(abs1, abs0, pas1), 0, l1, 'above')
      B = point(changeCoord(abs2, abs0, pas1), 0, l2, 'above')
      C = point(changeCoord(abs3, abs0, pas1), 0, l3, 'above')
      objets.push(droiteGraduee({
        Unite: 3 * pas1,
        Min: abs0,
        Max: abs0 + 6.9 / pas1,
        x: abs0,
        y: 0,
        thickSecDist: 1 / pas2 / pas1,
        thickSec: true,
        labelsPrincipaux: true,
        thickDistance: 1 / pas1
        // thickOffset: 2
      }))
      objetsCorr.push(droiteGraduee({
        Unite: 3 * pas1,
        Min: abs0,
        Max: abs0 + 6.9 / pas1,
        x: abs0,
        y: 0,
        thickSecDist: 1 / pas2 / pas1,
        thickSec: true,
        labelsPrincipaux: true,
        thickDistance: 1 / pas1
      }))
      if (this.interactif && !context.isAmc) {}
      const axeGradue = droiteGraduee({
        Unite: 3 * pas1,
        Min: abs0,
        Max: abs0 + 6.9 / pas1,
        x: abs0,
        y: 0,
        thickSecDist: 1 / pas2 / pas1,
        thickSec: true,
        labelsPrincipaux: true,
        thickDistance: 1 / pas1
      })
      objets.push(axeGradue)
      const t1 = tracePoint(A, 'blue')
      const t2 = tracePoint(B, 'blue')
      const t3 = tracePoint(C, 'blue')
      // @ts-expect-error
      const noms = labelPoint(A, B, C)
      t1.taille = 5
      t1.epaisseur = 2
      t2.taille = 5
      t2.epaisseur = 2
      t3.taille = 5
      t3.epaisseur = 2

      texte = `Placer les points : $${l1}(${texNombre(abs1, 5)}), ${l2}(${texNombre(abs2, 5)}), ${l3}(${texNombre(abs3, 5)})$.<br>`
      texte += mathalea2d({ xmin: abs0 - 0.5, xmax: abs0 + 22, ymin: -1, ymax: 1, scale: 0.75 }, objets)
      if (this.interactif && !context.isAmc) {
        texte += `<div id="resultatCheckEx${this.numeroExercice}Q${i}"></div>`
      }
      // @ts-expect-error
      objets.push(labelPoint(A, B, C), tracePoint(A, B, C))
      texteCorr = mathalea2d({ xmin: abs0 - 0.5, xmax: abs0 + 22, ymin: -1, ymax: 1, scale: 0.75 }, axeGradue, t1, t2, t3, noms)
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte,
          propositions: [{ texte: texteCorr, statut: 0, feedback: '' }]
        }
      }
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }

    this.exoCustomResultat = true
    this.correctionInteractive = (i: number) => {
      let result = 'KO'
      return result
    }
    listeQuestionsToContenu(this)
  }
}

export default PlacerPointsSurAxeRelatifs

// fonction qui retourne l'abscisse du point pour mathalea2d en fonction de l'abscisse de l'exercice
function changeCoord (x: number, abs0: number, pas1: number) {
  return (abs0 + (x - abs0) * 3 * pas1)
}
