import { droiteGraduee } from '../../lib/2d/reperes.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import { stringNombre } from '../../lib/outils/texNombre'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { arrondi } from '../../lib/outils/nombres'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Lire l\'abscisse décimale d\'un point'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDeModifImportante = '31/10/2023'

/**
 * Lire l'abscisse décimale d'un point
 * @author Jean-Claude Lhote et Rémi Angot
 */
export const uuid = 'c1888'
export const ref = '6N30'
export const refs = {
  'fr-fr': ['6N30'],
  'fr-ch': ['9NO7-1']
}
export default function LireAbscisseDecimale () {
  Exercice.call(this)
  this.consigne = "Lire l'abscisse de chacun des points suivants."
  this.nbQuestions = 3
  this.nbQuestionsModifiable = true
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.sup = 1
  this.listePackages = 'tkz-euclide'
  this.interactif = false
  this.nouvelleVersion = function () {
    this.autoCorrection = []
    // numeroExercice est 0 pour l'exercice 1
    let typesDeQuestions
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.contenu = '' // Liste de questions
    this.contenuCorrection = '' // Liste de questions corrigées
    if (this.sup === 4) {
      typesDeQuestions = combinaisonListes([1, 2, 3], this.nbQuestions)
    } else {
      typesDeQuestions = combinaisonListes(
        [this.sup],
        this.nbQuestions
      )
    }

    this.contenu = this.consigne
    for (let i = 0, d = [], abs0, l1, l2, l3, x1, x2, x3, x11, x22, x33, xA, xB, xC, pas1, pas2, thick1, thick2, texte = '', texteCorr = '', cpt = 0; i < this.nbQuestions && cpt < 50;) {
      l1 = lettreDepuisChiffre(i * 3 + 1)
      l2 = lettreDepuisChiffre(i * 3 + 2)
      l3 = lettreDepuisChiffre(i * 3 + 3)
      if (context.isAmc) {
        this.autoCorrection[i] = { propositions: [{ statut: 4, feedback: '' }] }
      }
      switch (typesDeQuestions[i]) {
        case 1: // Placer des décimaux sur un axe (1 décimale)
          abs0 = randint(0, 9)
          pas1 = 1
          pas2 = 10
          break

        case 2: // Placer des décimaux sur un axe (2 décimales)
          abs0 = randint(0, 90) / 10
          pas1 = 10
          pas2 = 10
          break

        case 3: // Placer des décimaux sur un axe (3 décimales)
          abs0 = randint(0, 990) / 100
          pas1 = 100
          pas2 = 10
          break
      }
      x1 = randint(0, 1)
      x2 = randint(3, 4)
      // x3 = randint(5, 6)
      x3 = 6
      x11 = randint(1, 9)
      x22 = randint(1, 9)
      x33 = randint(1, 9)
      xA = calculANePlusJamaisUtiliser(x1 + x11 / pas2)
      xB = calculANePlusJamaisUtiliser(x2 + x22 / pas2)
      xC = calculANePlusJamaisUtiliser(x3 + x33 / pas2)
      thick1 = randint(0, 3)
      thick2 = randint(2, 6, thick1)
      d[2 * i] = droiteGraduee({
        Unite: 4,
        Min: 0,
        Max: 7.1,
        axeStyle: '->',
        pointTaille: 5,
        pointStyle: 'x',
        labelsPrincipaux: false,
        thickSec: true,
        thickSecDist: 1 / pas2,
        labelListe: [[thick1, `${stringNombre(abs0 + thick1 / pas1, 1 + Math.log10(pas1))}`], [thick2, `${stringNombre(abs0 + thick2 / pas1, 1 + Math.log10(pas1))}`]],
        pointListe: [[xA, l1], [xB, l2], [xC, l3]]
      })
      d[2 * i + 1] = droiteGraduee({
        Unite: 4,
        Min: 0,
        Max: 7.1,
        axeStyle: '->',
        pointTaille: 5,
        pointStyle: 'x',
        labelsPrincipaux: false,
        thickSec: true,
        thickSecDist: 1 / pas2,
        labelListe: [
          // [0, `${stringNombre(abs0)}`],
          [xA, stringNombre(xA / pas1 + abs0, 1 + Math.log10(pas1))],
          [xB, stringNombre(xB / pas1 + abs0, 1 + Math.log10(pas1))],
          [xC, stringNombre(xC / pas1 + abs0, 1 + Math.log10(pas1))]
        ],
        labelColor: '#f15929',
        labelDistance: 1.4,
        labelScale: 1.2,
        pointListe: [[xA, l1], [xB, l2], [xC, l3]]

      })

      texte = mathalea2d({ xmin: -2, ymin: -1, xmax: 30, ymax: 2, pixelsParCm: 20, scale: 0.5 }, d[2 * i])
      texteCorr = mathalea2d({ xmin: -2, ymin: -2, xmax: 30, ymax: 2, pixelsParCm: 20, scale: 0.5 }, d[2 * i], d[2 * i + 1])

      if (this.interactif && context.isHtml) {
        setReponse(this, 3 * i, arrondi(xA / pas1 + abs0, 1 + Math.log10(pas1)))
        setReponse(this, 3 * i + 1, arrondi(xB / pas1 + abs0, 1 + Math.log10(pas1)))
        setReponse(this, 3 * i + 2, arrondi(xC / pas1 + abs0, 1 + Math.log10(pas1)))
        texte += `<br><br>$${l1}$` + sp(1) + ajouteChampTexteMathLive(this, 3 * i)
        texte += sp(6) + `$${l2}$` + sp(1) + ajouteChampTexteMathLive(this, 3 * i + 1)
        texte += sp(6) + `$${l3}$` + sp(1) + ajouteChampTexteMathLive(this, 3 * i + 2)
      } else {
        if (context.isAmc) {
          this.autoCorrection[i].enonce = texte
          this.autoCorrection[i].propositions[0].texte = texteCorr
          this.autoCorrection[i].propositions[0].statut = 1
        }
      }
      if (this.questionJamaisPosee(i, texte)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = [
    'Niveau de difficulté',
    4,
    '1 : Une seule décimale\n2 : Deux décimales \n3 : Trois décimales\n4 : Mélange'
  ]
}
