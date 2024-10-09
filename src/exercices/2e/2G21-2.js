import { choice } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom'
import { rangeMinMax } from '../../lib/outils/nombres'
import { lettreDepuisChiffre } from '../../lib/outils/outilString'
import { orangeMathalea } from 'apigeom/src/elements/defaultValues'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'

export const titre = 'Construire un point à partir d\'une égalité vectorielle sur une grille'
export const interactifReady = true
export const interactifType = 'custom'
export const dateDePublication = '17/08/2024'

/** Construire un point à partir d'une égalité vectorielle sur une grille
 * @author  Eric Elter
 */
export const uuid = '6cf42'
export const ref = '2G21-2'
export const refs = {
  'fr-fr': ['2G21-2'],
  'fr-ch': []
}
export default function SommeDeVecteurs () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = 1

  this.nouvelleVersion = function () {
    this.longueur = 10
    this.largeur = 10
    /**
     * @type {Figure[]}
     */
    this.figure = []
    let choix = 1
    let choixU
    let choixV
    const xSomme = []
    const ySomme = []
    const nomExtremite = []
    const pointExtremite = []
    const listeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 3,
      melange: 4,
      defaut: 1,
      nbQuestions: this.nbQuestions
    })

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      choix = listeDeQuestions[i] === 4 ? randint(1, 3) : listeDeQuestions[i]
      switch (choix) {
        case 1 :
          choixU = 'origine'
          choixV = 'origine'
          break
        case 2 :
          if (choice([false, true])) {
            choixU = 'origine'
            choixV = 'pas0rigine'
          } else {
            choixV = 'origine'
            choixU = 'pas0rigine'
          }
          break
        case 3 :
          choixU = 'pas0rigine'
          choixV = 'pas0rigine'
          break
      }
      this.idApigeom = `apigeomEx${this.numeroExercice}${i}EE`
      this.figure[i] = new Figure({
        xMin: -this.longueur - 0.25, // On enlève 0.25 unités
        yMin: -this.largeur - 0.25,
        width: 0.65 * (this.longueur * 2 * 30 + 20), // On ajoute 20 pixels
        height: 0.65 * (this.largeur * 2 * 30 + 20),
        border: false,
        scale: 0.65
      })

      // Préparation de la correction animée
      const figureCorrection = new Figure({
        xMin: -this.longueur - 0.25, // On enlève 0.25 unités
        yMin: -this.largeur - 0.25,
        width: 0.65 * (this.longueur * 2 * 30 + 20), // On ajoute 20 pixels
        height: 0.65 * (this.largeur * 2 * 30 + 20),
        border: false,
        scale: 0.65
      })

      this.figure[i].grid = this.figure[i].create('Grid', {
        strokeWidthGrid: 1,
        yMin: -this.largeur + 0.1,
        yMax: this.largeur - 0.1,
        xMax: this.longueur - 0.1,
        xMin: -this.longueur + 0.1,
        axeX: true,
        axeY: true,
        ldistancePointIntermediaireProjOrthogonalelX: true,
        ldistancePointIntermediaireProjOrthogonalelY: true,
        repereOij: true
      })

      figureCorrection.grid = figureCorrection.create('Grid', {
        strokeWidthGrid: 1,
        yMin: -this.largeur + 0.1,
        yMax: this.largeur - 0.1,
        xMax: this.longueur - 0.1,
        xMin: -this.longueur + 0.1,
        axeX: true,
        axeY: true,
        ldistancePointIntermediaireProjOrthogonalelX: true,
        ldistancePointIntermediaireProjOrthogonalelY: true,
        repereOij: true
      })

      this.figure[i].snapGrid = true
      this.figure[i].setToolbar({
        tools: ['DRAG', 'REMOVE', 'VECTOR', 'POINT', 'SET_OPTIONS', 'NAME_POINT', 'ZOOM_IN', 'ZOOM_OUT', 'GRID']
        // position: 'top'
      })
      this.figure[i].options.thickness = 3
      this.figure[i].options.color = 'blue'
      this.figure[i].buttons.get('POINT')?.click()

      /*
      On construit au hasard :
      1. le point origine
      2. le vecteur somme (vecteur solution)
      3. le vecteur1, le vecteur 2 et le pointIntermédiaire (= extrémité vecteur1 = origine vecteur2)
      On s'arrange pour que les vecteurs soient sur la grille et qu'ils soient assez séparés pour être distinguables
      */

      let xOrigin
      let yOrigin
      xSomme[i] = randint(0, 14) * choice([-1, 1])
      ySomme[i] = randint(0, 14) * choice([-1, 1])
      if (xSomme[i] <= -10) xOrigin = randint(5, 9)
      else if (xSomme[i] <= -6) xOrigin = randint(1, 9)
      else if (xSomme[i] <= -2) xOrigin = choice(rangeMinMax(-3, 9))
      else if (xSomme[i] >= 10) xOrigin = choice(rangeMinMax(-9, -5))
      else if (xSomme[i] >= 6) xOrigin = choice(rangeMinMax(-9, -1))
      else if (xSomme[i] >= 2) xOrigin = choice(rangeMinMax(-9, 3))
      else xOrigin = choice(rangeMinMax(-9, 8))
      if (ySomme[i] <= -10) yOrigin = randint(5, 9)
      else if (ySomme[i] <= -6) yOrigin = randint(1, 9)
      else if (ySomme[i] <= -2) yOrigin = choice(rangeMinMax(-3, 9))
      else if (ySomme[i] >= 10) yOrigin = choice(rangeMinMax(-9, -5))
      else if (ySomme[i] >= 6) yOrigin = choice(rangeMinMax(-9, -1))
      else if (ySomme[i] >= 2) yOrigin = choice(rangeMinMax(-9, 3))
      else yOrigin = choice(rangeMinMax(-9, 8))

      const numeroOrigine = randint(1, 26, [15]) // 15 : Pour éviter le point O
      const nomOrigine = lettreDepuisChiffre(numeroOrigine)
      const numeroExtremite = randint(1, 26, [15, numeroOrigine])
      nomExtremite[i] = lettreDepuisChiffre(numeroExtremite)
      let pointOrigine = this.figure[i].create('Point', { x: xOrigin, y: yOrigin, label: nomOrigine, color: 'black', thickness: 3, isSelectable: false })
      const pointOrigineCorrection = figureCorrection.create('Point', { x: xOrigin, y: yOrigin, label: nomOrigine, color: 'black', thickness: 3, isSelectable: false })
      pointExtremite[i] = this.figure[i].create('Point', { x: xOrigin + xSomme[i], y: yOrigin + ySomme[i], isVisible: false })
      const longueurVecteurSomme = Math.sqrt(xSomme[i] * xSomme[i] + ySomme[i] * ySomme[i])

      let PointIntermediaire
      let distanceOrigineProjOrthogonal
      let distancePointIntermediaireProjOrthogonal
      let distanceVecteurSommeProfOrthogonal
      let vecteur1
      let vecteur2
      let xPointIntermediaire
      let yPointIntermediaire

      do {
        xPointIntermediaire = choice(rangeMinMax(-9, 9, xOrigin))
        yPointIntermediaire = choice(rangeMinMax(-9, 9, yOrigin))
        PointIntermediaire = this.figure[i].create('Point', { x: xPointIntermediaire, y: yPointIntermediaire, isVisible: false })
        distanceOrigineProjOrthogonal = ((PointIntermediaire.x - pointOrigine.x) * xSomme[i] + (PointIntermediaire.y - pointOrigine.y) * ySomme[i]) / Math.sqrt(xSomme[i] * xSomme[i] + ySomme[i] * ySomme[i])
        distancePointIntermediaireProjOrthogonal = Math.sqrt((PointIntermediaire.x - pointOrigine.x) * (PointIntermediaire.x - pointOrigine.x) + (PointIntermediaire.y - pointOrigine.y) * (PointIntermediaire.y - pointOrigine.y))
        vecteur1 = this.figure[i].create('VectorByPoints', { point1: pointOrigine, point2: PointIntermediaire, isVisible: false })
        vecteur2 = this.figure[i].create('VectorByPoints', { point1: PointIntermediaire, point2: pointExtremite[i], isVisible: false })
        distanceVecteurSommeProfOrthogonal = Math.sqrt(distancePointIntermediaireProjOrthogonal * distancePointIntermediaireProjOrthogonal - distanceOrigineProjOrthogonal * distanceOrigineProjOrthogonal)
      } while (!(distanceVecteurSommeProfOrthogonal > 1 && distanceVecteurSommeProfOrthogonal * longueurVecteurSomme / 2 > 4 && pointOrigine.x + vecteur2.x < 9 && pointOrigine.x + vecteur2.x > -9 && pointOrigine.y + vecteur2.y < 9 && pointOrigine.y + vecteur2.y > -9))
      /* Explications des conditions du while
      distanceVecteurSommeProfOrthogonal > 1 : Pour que le projeté orthogonal de point1 sur le vecteur somme soit assez loin du vecteur (pour éviter des vecteurs presque colinéaires)
      distanceVecteurSommeProfOrthogonal * longueurVecteurSomme / 2 > 4 : Pour que le triangle formé par vecteur1, vecteur2 et vecteurSomme ait une aire suffisamment grande (pour éviter des vecteurs presque colinéaires)
      Autres conditions : pour que le PointIntermediaire soit sur la grille
      */
      let pointOrigineChoix2X
      let pointOrigineChoix2Y
      let pointOrigineChoix2
      if (choixU === 'origine') {
        this.figure[i].create('Vector', { origin: pointOrigine, x: vecteur1.x, y: vecteur1.y, color: 'blue', thickness: 3, label: '\\vec{u}', isSelectable: false })
        figureCorrection.create('Vector', { origin: pointOrigine, x: vecteur1.x, y: vecteur1.y, color: 'blue', thickness: 3, label: '\\vec{u}', isSelectable: false })
      } else {
        pointOrigineChoix2X = choice(rangeMinMax(Math.max(-9, -9 - vecteur1.x), Math.min(9, 9 - vecteur1.x), xOrigin))
        pointOrigineChoix2Y = choice(rangeMinMax(Math.max(-9, -9 - vecteur1.y), Math.min(9, 9 - vecteur1.y), yOrigin))
        pointOrigineChoix2 = this.figure[i].create('Point', { x: pointOrigineChoix2X, y: pointOrigineChoix2Y, isVisible: false })
        this.figure[i].create('Vector', { origin: pointOrigineChoix2, x: vecteur1.x, y: vecteur1.y, color: 'blue', thickness: 3, label: '\\vec{u}', isSelectable: false })
        figureCorrection.create('Vector', { origin: pointOrigineChoix2, x: vecteur1.x, y: vecteur1.y, color: 'blue', thickness: 3, label: '\\vec{u}', isSelectable: false })
      }

      let pointOrigineChoix3X
      let pointOrigineChoix3Y
      let pointOrigineChoix3
      if (choixV === 'origine') {
        this.figure[i].create('Vector', { origin: pointOrigine, x: vecteur2.x, y: vecteur2.y, color: 'blue', thickness: 3, label: '\\vec{v}', isSelectable: false })
        figureCorrection.create('Vector', { origin: pointOrigine, x: vecteur2.x, y: vecteur2.y, color: 'blue', thickness: 3, label: '\\vec{v}', isSelectable: false })
      } else {
        pointOrigineChoix3X = choice(rangeMinMax(Math.max(-9, -9 - vecteur2.x), Math.min(9, 9 - vecteur2.x), xOrigin))
        pointOrigineChoix3Y = choice(rangeMinMax(Math.max(-9, -9 - vecteur2.y), Math.min(9, 9 - vecteur2.y), yOrigin))
        pointOrigineChoix3 = this.figure[i].create('Point', { x: pointOrigineChoix3X, y: pointOrigineChoix3Y, isVisible: false })
        this.figure[i].create('Vector', { origin: pointOrigineChoix3, x: vecteur2.x, y: vecteur2.y, color: 'blue', thickness: 3, label: '\\vec{v}', isSelectable: false })
        figureCorrection.create('Vector', { origin: pointOrigineChoix3, x: vecteur2.x, y: vecteur2.y, color: 'blue', thickness: 3, label: '\\vec{v}', isSelectable: false })
      }

      pointOrigine = this.figure[i].create('Point', { x: xOrigin, y: yOrigin, label: nomOrigine, color: 'black', thickness: 3, isSelectable: false })
      figureCorrection.create('Point', { x: xOrigin, y: yOrigin, label: nomOrigine, color: 'black', thickness: 3, isSelectable: false })
      texte = `Construire le point $${nomExtremite[i]}$ tel que $\\overrightarrow{${nomOrigine}${nomExtremite[i]}} = \\vec{u} + \\vec{v}$.<br>`
      texte += figureApigeom({
        exercice: this,
        idApigeom: this.idApigeom,
        figure: this.figure[i],
        question: i
      })

      figureCorrection.options.animationStepInterval = 250
      figureCorrection.grid.color = 'gray'
      figureCorrection.grid.colorLabel = 'gray'

      /* const vectorsBlue = [...figureCorrection.elements.values()].filter(e => e.color === 'blue')
      for (let ee = 0; ee < vectorsBlue.length; ee++) {
        if (vectorsBlue[ee]) {
          vectorsBlue[ee].opacity = 0.5
        }
      } */
      figureCorrection.setToolbar({ position: 'top', tools: ['RESTART', 'PLAY_SKIP_BACK', 'PLAY', 'PLAY_SKIP_FORWARD', 'PAUSE'] })
      // figureCorrection.grid.isVisible = false
      // const visibleGrid = () => {
      // figureCorrection.grid.isVisible = !figureCorrection.grid.isVisible
      // figureCorrection.grid.isVisible = false
      // }

      /* figureCorrection.addCustomButton({
        action: visibleGrid,
        tooltip: 'Cacher/Afficher la grille',
        url: 'toto'
      }) */

      const pointAnimation = []
      const vecteurAnimation = []
      if (choixV === 'origine' && choixU === 'origine') {
        for (let ee = 0; ee < 11; ee++) {
          pointAnimation[ee] = figureCorrection.create('Point', { x: xOrigin + (xPointIntermediaire - xOrigin) * ee / 10, y: yOrigin + (yPointIntermediaire - yOrigin) * ee / 10, isVisible: false })
          vecteurAnimation[ee] = figureCorrection.create('Vector', { origin: pointAnimation[ee], x: vecteur2.x, y: vecteur2.y, color: 'green', thickness: 3, label: '\\vec{v}' })
          figureCorrection.saveState()
          if (ee !== 10) vecteurAnimation[ee].hide()
        }
      } else if (choixV === 'origine' && choixU !== 'origine') {
        for (let ee = 0; ee < 11; ee++) {
          pointAnimation[ee] = figureCorrection.create('Point', { x: pointOrigineChoix2X + (xOrigin + vecteur2.x - pointOrigineChoix2X) * ee / 10, y: pointOrigineChoix2Y + (yOrigin + vecteur2.y - pointOrigineChoix2Y) * ee / 10, isVisible: false })
          vecteurAnimation[ee] = figureCorrection.create('Vector', { origin: pointAnimation[ee], x: vecteur1.x, y: vecteur1.y, color: 'green', thickness: 3, label: '\\vec{u}' })
          figureCorrection.saveState()
          if (ee !== 10) vecteurAnimation[ee].hide()
        }
      } else if (choixV !== 'origine' && choixU === 'origine') {
        for (let ee = 0; ee < 11; ee++) {
          pointAnimation[ee] = figureCorrection.create('Point', { x: pointOrigineChoix3X + (xPointIntermediaire - pointOrigineChoix3X) * ee / 10, y: pointOrigineChoix3Y + (yPointIntermediaire - pointOrigineChoix3Y) * ee / 10, isVisible: false })
          vecteurAnimation[ee] = figureCorrection.create('Vector', { origin: pointAnimation[ee], x: vecteur2.x, y: vecteur2.y, color: 'green', thickness: 3, label: '\\vec{v}' })
          figureCorrection.saveState()
          if (ee !== 10) vecteurAnimation[ee].hide()
        }
      } else { // (choixV !== 'origine' && choixU !== 'origine')
        for (let ee = 0; ee < 11; ee++) {
          pointAnimation[ee] = figureCorrection.create('Point', { x: pointOrigineChoix2X + (xOrigin - pointOrigineChoix2X) * ee / 10, y: pointOrigineChoix2Y + (yOrigin - pointOrigineChoix2Y) * ee / 10, isVisible: false })
          vecteurAnimation[ee] = figureCorrection.create('Vector', { origin: pointAnimation[ee], x: vecteur1.x, y: vecteur1.y, color: 'green', thickness: 3, label: '\\vec{u}' })
          figureCorrection.saveState()
          if (ee !== 10) vecteurAnimation[ee].hide()
        }
        for (let ee = 0; ee < 11; ee++) {
          pointAnimation[ee] = figureCorrection.create('Point', { x: pointOrigineChoix3X + (xPointIntermediaire - pointOrigineChoix3X) * ee / 10, y: pointOrigineChoix3Y + (yPointIntermediaire - pointOrigineChoix3Y) * ee / 10, isVisible: false })
          vecteurAnimation[ee] = figureCorrection.create('Vector', { origin: pointAnimation[ee], x: vecteur2.x, y: vecteur2.y, color: 'green', thickness: 3, label: '\\vec{v}' })
          figureCorrection.saveState()
          if (ee !== 10) vecteurAnimation[ee].hide()
        }
      }

      figureCorrection.create('Vector', { origin: pointOrigineCorrection, x: xSomme[i], y: ySomme[i], color: orangeMathalea, thickness: 3 })
      figureCorrection.create('Point', { x: pointExtremite[i].x, y: pointExtremite[i].y, colorLabel: orangeMathalea, color: orangeMathalea, label: nomExtremite[i] })

      figureCorrection.saveState()

      const emplacementPourFigureCorrection = figureApigeom({ animation: true, exercice: this, idApigeom: `apigeomEx${this.numeroExercice}${i}Correction`, figure: figureCorrection })
      texteCorr = emplacementPourFigureCorrection
      texteCorr += `Le point $${nomExtremite[i]}$ tel que $\\overrightarrow{${nomOrigine}${nomExtremite[i]}} = \\vec{u} + \\vec{v}$ a pour coordonnées ${texteEnCouleurEtGras('(' + pointExtremite[i].x + ' ; ' + pointExtremite[i].y + ')')}.<br>`

      this.correctionInteractive = (i) => {
        this.answers = {}
        // Sauvegarde de la réponse pour Capytale
        this.answers[this.idApigeom] = this.figure[i].json
        const divFeedback = document.querySelector(
          `#feedbackEx${this.numeroExercice}Q${i}`
        )
        this.figure[i].isDynamic = false
        this.figure[i].divButtons.style.display = 'none'
        this.figure[i].divUserMessage.style.display = 'none'
        const nbPoints = [...this.figure[i].elements.values()].filter(
          (e) => e.type === 'Point' && e.isVisible && !e.isChild
        ).length
        const isValid = nbPoints > 1

        if (!isValid) {
          divFeedback.innerHTML = 'Aucun point n\'a été créé.'
          return 'KO'
        }

        const resultatCheck = this.figure[i].checkCoords({ label: nomExtremite[i], x: pointExtremite[i].x, y: pointExtremite[i].y })
        divFeedback.innerHTML = resultatCheck.message
        return resultatCheck.isValid ? 'OK' : 'KO'
      }

      if (this.questionJamaisPosee(i, xSomme[i], xSomme[i])) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Situations différentes ', '1 : 2 vecteurs depuis l\'origine\n2 : 1 seul vecteur depuis l\'origine\n3 : Aucun vecteur depuis l\'origine\n4 : Mélange']
}
