import { choice } from '../../lib/outils/arrayOutils'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../Exercice'
import { point, Point, pointIntersectionDD } from '../../lib/2d/points'
import { polyline } from '../../lib/2d/polygones'
import RepereBuilder from '../../lib/2d/RepereBuilder'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import { droite, droiteHorizontaleParPoint, Droite } from '../../lib/2d/droites'
import { numAlpha } from '../../lib/outils/outilString'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { approximatelyCompare } from '../../lib/interactif/comparisonFunctions'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { texNombre } from '../../lib/outils/texNombre'
import { lectureAntecedent } from '../../lib/2d/courbes'
import { texteSurSegment } from '../../lib/2d/codages'
import { segment } from '../../lib/2d/segmentsVecteurs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '05/05/2024'
export const titre = 'Lire graphiquement des quartiles et des EIQ'
export const uuid = 'b7662'
export const refs = {
  'fr-fr': ['2S30-6'],
  'fr-ch': []
}

const situations = [
  {
    label: 'des salaires en euros dans une entreprise',
    valeurs: [[1000, 5000], [1200, 4000], [800, 4000]],
    zones: [[0, 2], [0, 2], [0, 3], [0, 4], [1, 5], [2, 8], [3, 10]],
    precisionLecture: 50
  },
  {
    label: 'des tailles de haricots en millimètres dans une conserverie',
    valeurs: [[50, 160], [60, 120], [80, 200]],
    zones: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 6], [4, 7], [5, 10]],
    precisionLecture: 2
  },
  {
    label: 'des ages des habitants d\'un village',
    valeurs: [[0, 80], [30, 100], [0, 100], [20, 80]],
    zones: [[0, 3], [2, 5], [3, 6], [3, 7], [1, 5], [5, 8], [4, 6], [4, 7], [8, 10]],
    precisionLecture: 2
  }
]
const aleaPopulation = function (effectif:number, valeurMin, valeurMax, zones) {
  const pop: number[] = []
  const ecart = valeurMax - valeurMin
  for (let i = 0; i < effectif; i++) {
    const zone = choice(zones)
    const [min, max] = zone.map(el => valeurMin + ecart * el / 10)
    pop.push(Math.round(randint(min, max)))
  }
  return pop.sort((a, b) => a - b)
}

const trouveQuartiles = function (yGrecs: number[], pts: Point[]) {
  let d1: Droite, d2: Droite, d3: Droite
  for (let i = 0; i < pts.length; i++) {
    if (yGrecs[i] * 5 <= 25 && yGrecs[i + 1] * 5 > 25) {
      d1 = droite(pts[i], pts[i + 1])
    }
    if (yGrecs[i] * 5 <= 50 && yGrecs[i + 1] * 5 > 50) {
      d2 = droite(pts[i], pts[i + 1])
    }
    if (yGrecs[i] * 5 <= 75 && yGrecs[i + 1] * 5 > 75) {
      d3 = droite(pts[i], pts[i + 1])
    }
  }
  const D1 = droiteHorizontaleParPoint(point(0, 5))
  const D2 = droiteHorizontaleParPoint(point(0, 10))
  const D3 = droiteHorizontaleParPoint(point(0, 15))
  const q1 = pointIntersectionDD(d1, D1).x
  const q2 = pointIntersectionDD(d2, D2).x
  const q3 = pointIntersectionDD(d3, D3).x
  return [q1, q2, q3]
}

export default class Quartiles extends Exercice {
  constructor () {
    super()
    this.besoinFormulaireNumerique = ['Besoin option ?', 1, 'Je sais pas']
    this.sup = 1
  }

  nouvelleVersion () {
    this.reinit()
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const effectif = 100
      const situation = choice(situations)
      const valeurs = choice(situation.valeurs)
      const [valeurMin, valeurMax] = valeurs
      const echelleX = 20 / valeurMax
      const echelleY = 0.2
      const tolerance = Math.ceil(valeurMax / 100) // situation.precisionLecture
      const y: number[] = []
      const x: number[] = []
      const pop = aleaPopulation(effectif, valeurMin, valeurMax, situation.zones)
      const nbPart = randint(5, 8)
      let nbVal = 0
      let index = 0
      const pts: Point[] = []
      while (nbVal < effectif) {
        if (nbVal === 0) {
          x[index] = 0
          y[index] = 0
        } else {
          x[index] = pop[nbVal] * echelleX
          y[index] = nbVal * 100 * echelleY / effectif
        }
        pts.push(point(x[index], y[index]))
        do {
          nbVal += randint(Math.min(2, Math.round(effectif / nbPart)), Math.round(effectif / nbPart + 7))
        } while (x[index] === pop[nbVal] * echelleX) // il faut éviter d'avoir deux points sur la même valeur
        index++
      }
      pts.push(point(valeurMax * echelleX, 100 * echelleY))

      const [q1, q2, q3] = trouveQuartiles(y, pts).map(el => Math.round(el / echelleX))
      const line = polyline(pts, 'blue')
      const rep = new RepereBuilder({ xMin: 0, xMax: valeurMax, yMin: 0, yMax: 100 })
        .setUniteX(echelleX)
        .setUniteY(echelleY)
        .setThickX({ xMin: 0, xMax: valeurMax, dx: valeurMax / 10 })
        .setThickY({ yMin: 0, yMax: 100, dy: 10 })
        .setLabelX({ xMin: 0, xMax: valeurMax, dx: valeurMax / 10 })
        .setLabelY({ yMin: 0, yMax: 100, dx: 10 })
        .setGrille({ grilleX: { dx: valeurMax * echelleX / 10 }, grilleY: { dy: 2 } })
        .setGrilleSecondaire({ grilleX: { dx: valeurMax * echelleX / 100 }, grilleY: { dy: 1 } })
        .buildCustom()
      const objets2d = [line, rep]
      const fig = mathalea2d(Object.assign({ pixelsParCm: 25, scale: 1 }, fixeBordures(objets2d)), objets2d)
      const marque1 = lectureAntecedent(q1 * echelleX, 5, 1, 1, 'red', '25%', `${q1}`)
      const marque3 = lectureAntecedent(q3 * echelleX, 15, 1, 1, 'red', '75%', `${q3}`)
      const offset = Math.log10(q1) * 0.2 + 0.5
      const ecartIQ = segment(point(q1 * echelleX + offset, -1.5), point(q3 * echelleX - offset, -1.5), 'red')
      ecartIQ.styleExtremites = '<->'
      const iq = texteSurSegment(`$${texNombre(q3 - q1, 0)}$$`, point(q1 * echelleX + offset, -1.5), point(q3 * echelleX - offset, -1.5), 'red', -0.5)
      objets2d.push(marque1, marque3, ecartIQ, iq)
      const figCorrection = mathalea2d(Object.assign({ pixelsParCm: 15, scale: 0.5 }, fixeBordures(objets2d)), objets2d)
      let texte = `On donne ci-dessus la représentation graphique des fréquences cumulées croissante ${situation.label}.<br>Les réponses seront données avec la précision permise par le graphique (à $${tolerance}$ près).<br>`
      texte += `${numAlpha(0)} Donner la valeur du premier quartile.` + ajouteChampTexteMathLive(this, 3 * i, 'inlinde largeur01')
      texte += `<br>${numAlpha(1)} Donner la valeur du troisième quartile.` + ajouteChampTexteMathLive(this, 3 * i + 1, 'inlinde largeur01')
      texte += `<br>${numAlpha(2)} Donner la valeur de l'écart inter-quartile.` + ajouteChampTexteMathLive(this, 3 * i + 2, 'inlinde largeur01')
      handleAnswers(this, 3 * i, { reponse: { value: String(q1), compare: approximatelyCompare, options: { tolerance } } })
      handleAnswers(this, 3 * i + 1, { reponse: { value: String(q3), compare: approximatelyCompare, options: { tolerance } } })
      handleAnswers(this, 3 * i + 2, { reponse: { value: String(q3 - q1), compare: approximatelyCompare, options: { tolerance } } })

      let texteCorr = 'Par lecture graphique, on trouve :<br>'
      texteCorr += `${numAlpha(0)} La valeur du premier quartile est $${texNombre(q1, 0)}$`
      texteCorr += `<br>${numAlpha(1)} La valeur du troisième quartile est $${texNombre(q3, 0)}$`
      texteCorr += `<br>${numAlpha(2)} La valeur de l'écart inter-quertile est :$${texNombre(q3, 0)}-${texNombre(q1, 0)}=${texNombre(q3 - q1, 0)}$`
      texteCorr += figCorrection

      texte = fig + texte
      if (this.questionJamaisPosee(i, texte, q1, q2, q3)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
