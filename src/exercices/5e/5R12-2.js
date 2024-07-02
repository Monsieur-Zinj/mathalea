import { point, tracePoint } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import { labelPoint } from '../../lib/2d/textes.ts'
import { creerCouples, shuffle2tableaux } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenuSansNumero, randint, calculANePlusJamaisUtiliser, contraindreValeur } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Déterminer les coordonnées (relatives) d\'un point'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '22/01/2024'

/**
 * Lire les coordonnées d'un point du plan avec une précision allant de l'unité à 0,25.
 * @author Jean-Claude Lhote
 */
export const uuid = 'ab968'
export const ref = '5R12-2'
export const refs = {
  'fr-fr': ['5R12-2'],
  'fr-ch': ['9FA1-7']
}
export default function ReperagePointDuPlan () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.nbQuestionsModifiable = false
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.sup = 1
  this.sup2 = true
  this.sup3 = 5
  this.quartDePlan = false
  this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    let texte, texteCorr
    this.contenu = '' // Liste de questions
    this.contenuCorrection = '' // Liste de questions corrigées
    let listePoints = []
    const points = []
    let xmin, xmax, ymin, ymax
    const k = Math.pow(2, this.sup - 1)
    const nom = []
    const objets2d = []
    const nbPoints = contraindreValeur(2, 5, this.sup3, 5)
    if (this.quartDePlan) {
      xmin = 0; ymin = 0; xmax = 10; ymax = 10
    } else {
      xmin = -5; ymin = -5; xmax = 5; ymax = 5
    }
    const listeAbs = []; const listeOrd = []
    for (let i = calculANePlusJamaisUtiliser(xmin + 1 / k); i < calculANePlusJamaisUtiliser(xmax - (this.sup - 1) / k); i = calculANePlusJamaisUtiliser(i + 1 / k)) {
      listeAbs.push(i)
    }
    for (let i = calculANePlusJamaisUtiliser(ymin + 1 / k); i < calculANePlusJamaisUtiliser(ymax - (this.sup - 1) / k); i = calculANePlusJamaisUtiliser(i + 1 / k)) {
      listeOrd.push(i)
    }
    let X0 = false; let Y0 = false
    listePoints = creerCouples(listeAbs, listeOrd, 10 * k)
    for (let l = 0, lettre = randint(1, 20); l < 5; l++) {
      nom.push(lettreDepuisChiffre(l + lettre))
    } for (let j = 0; j < nbPoints; j++) {
      points.push(point(listePoints[j][0], listePoints[j][1], nom[j], 'above left'))
      if (points[j].x === 0) { X0 = true }
      if (points[j].y === 0) { Y0 = true }
    }
    if (!X0) { points[0].x = 0 }
    if (!Y0) { points[1].y = 0 }
    shuffle2tableaux(points, nom)

    if (context.isAmc) {
      this.autoCorrection[0] = {
        enonce: '',
        enonceAvant: false,
        enonceApresNumQuestion: true,
        options: { barreseparation: true },
        propositions: []
      }
    }

    texte = 'Déterminer les coordonnées des points'
    texteCorr = 'Les coordonnées des points sont :<br>'
    for (let i = 0; i < nbPoints - 1; i++) {
      texte += ` $${nom[i]}$,`
      texteCorr += ` $${nom[i]}(${miseEnEvidence(texNombre(points[i].x))};${miseEnEvidence(texNombre(points[i].y))})$,`
      if (context.isAmc) {
        this.autoCorrection[0].propositions.push(
          {
            type: 'AMCNum',
            propositions: [{
              texte: '',
              statut: '',
              multicolsBegin: true,
              reponse: {
                texte: `Abscisse de $${nom[i]}$ :`,
                valeur: points[i].x,
                param: {
                  digits: 1,
                  decimals: this.sup - 1,
                  signe: !this.quartDePlan,
                  approx: 0
                }
              }
            }]
          },
          {
            type: 'AMCNum',
            propositions: [{
              texte: '',
              statut: '',
              multicolsEnd: true,
              reponse: {
                texte: `Ordonnée de $${nom[i]}$ :`,
                valeur: points[i].y,
                param: {
                  digits: 1,
                  decimals: this.sup - 1,
                  signe: !this.quartDePlan,
                  approx: 0
                }
              }
            }]
          }
        )
      }
    }
    texte = texte.slice(0, texte.length - 1) + ` et $${nom[nbPoints - 1]}$.<br>`
    texteCorr = texteCorr.slice(0, texteCorr.length - 1) + ` et $${nom[nbPoints - 1]}(${miseEnEvidence(texNombre(points[nbPoints - 1].x))};${miseEnEvidence(texNombre(points[nbPoints - 1].y))})$.`
    if (this.sup2) {
      objets2d.push(repere({
        xMin: xmin - 1,
        yMin: ymin - 1,
        xMax: xmax + 1,
        yMax: ymax + 1,
        grilleSecondaire: true,
        grilleSecondaireDistance: 1 / k,
        grilleSecondaireXMin: xmin - 1,
        grilleSecondaireYMin: ymin - 1,
        grilleSecondaireXMax: xmax + 1,
        grilleSecondaireYMax: ymax + 1
      }))
    } else {
      objets2d.push(repere({ xMin: xmin - 1, yMin: ymin - 1, xMax: xmax + 1, yMax: ymax + 1 }))
    }
    for (let i = 0; i < nbPoints; i++) {
      objets2d.push(tracePoint(points[i], 'red'), labelPoint(points[i]))
    }
    texte += '<br>' + mathalea2d({ xmin: xmin - 1, ymin: ymin - 1, xmax: xmax + 1, ymax: ymax + 1, pixelsParCm: 30, scale: 0.75 }, objets2d)

    if (context.isAmc) {
      this.autoCorrection[0].enonce = texte
    }
    this.listeQuestions.push(texte)
    this.listeCorrections.push(texteCorr)

    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, "1 : Coordonnées entières\n2 : Coordonnées 'en demis'\n3 : Coordonnées 'en quarts'"]
  this.besoinFormulaire2CaseACocher = ['Grille de lecture']
  this.besoinFormulaire3Numerique = ['Nombre de points (entre 2 et 5)', 5]
}
