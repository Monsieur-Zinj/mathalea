import Exercice from '../Exercice'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom'
import { randint } from '../../modules/outils'
import { orangeMathalea } from 'apigeom/src/elements/defaultValues.js'
import bluePoint from './svg/blueCirclePoint.svg'
import redPoint from './svg/redPoint.svg'
import remove from 'apigeom/src/assets/svg/restart.svg'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { choice } from '../../lib/outils/arrayOutils'
import { context } from '../../modules/context'

export const dateDePublication = '15/07/2024'
export const titre = 'Résoudre une grille de SquarO'
export const interactifReady = true
export const interactifType = 'custom'

/** Résoudre une grille de SquarO
 * @author Eric Elter
 * Soutenu par Rémi Angot pour l'aide pour le développement avec ApiGeom
 */

// export const ref = 'EN-SquarO'
export const uuid = 'e2024'
export const refs = {
  'fr-fr': ['EN-SquarO'],
  'fr-ch': []
}

class jeutest extends Exercice {
  // On déclare des propriétés supplémentaires pour cet exercice afin de pouvoir les réutiliser dans la correction
  figure!: Figure
  figureCorrection!: Figure
  idApigeom!: string
  goodAnswers: Array<{ x: number; y: number }>
  nbSommets: Array<number>
  longueur:number
  largeur:number

  constructor () {
    super()
    this.goodAnswers = []
    this.nbSommets = []
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.reponse = ''
    this.formatChampTexte = 'none'
    this.exoCustomResultat = true
    this.besoinFormulaireTexte = [
      'Longueur de la grille',
      'Choisir un nombre entier entre 2 et 15.'
    ]
    this.besoinFormulaire2Texte = [
      'Hauteur de la grille',
      'Choisir un nombre entier entre 2 et 15.'
    ]
    this.besoinFormulaire4Texte = [
      'Nombre de points bleus déjà affichés',
      '1 : Un seul point\n2 : Deux points\n3 : Trois points\n4 : Le quart des points\n5 : Le tiers des points\n6 : La moitié des points\n7 : Aucun'
    ]
    this.sup = 5
    this.sup2 = 5
    this.sup4 = 7
    this.longueur = this.sup
    this.largeur = this.sup2
  }

  nouvelleVersion (): void {
    this.consigne = 'Cette grille de SquarO est à compléter en plaçant un certain nombre de points bleus sur les sommets des cases de telle sorte que le chiffre présent dans chaque case indique le nombre de points bleus qui l’entourent parmi les 4 sommets.'
    this.consigne += '<br>Si vous le souhaitez, vous pouvez placer les points rouges en forme de croix pour signaler des positions impossibles des points bleus.'
    this.comment = 'Grâce au choix de la longueur et de la hauteur de la grille et grâce à l\'aide ci-dessus sur des points initialement affichés, vous pouvez graduer la difficulté des grilles SquarO proposés.'
    this.interactif = true
    this.largeur = Math.max(2, Math.min(parseInt(this.sup2), 15)) || 2
    this.idApigeom = `apigeomEx${this.numeroExercice}EE`
    this.figure = new Figure({
      xMin: -0.25, // On enlève 0.25 unités
      yMin: -0.25,
      width: this.longueur * 30 + 20, // On ajoute 20 pixels
      height: this.largeur * 30 + 20,
      border: false
    })
    this.figure.create('Grid', {
      strokeWidthGrid: 1,
      color: 'black',
      yMin: 0,
      yMax: this.largeur,
      xMax: this.longueur,
      xMin: 0,
      axeX: false,
      axeY: false,
      labelX: false,
      labelY: false
    })
    this.figure.snapGrid = true
    this.figure.options.color = 'blue'
    this.figure.options.shape = 'o'
    this.figure.options.labelIsVisible = false
    this.figure.setToolbar({ tools: ['DRAG', 'REMOVE'], position: 'top' })

    // Figure correction
    this.figureCorrection = new Figure({
      xMin: -0.25,
      yMin: -0.25,
      width: this.longueur * 30 + 20,
      height: this.largeur * 30 + 20,
      border: false
    })
    this.figureCorrection.create('Grid', {
      strokeWidthGrid: 1,
      color: 'black',
      yMin: 0,
      yMax: this.largeur,
      xMax: this.longueur,
      xMin: 0,
      axeX: false,
      axeY: false,
      labelX: false,
      labelY: false
    })
    this.figureCorrection.snapGrid = true
    this.figureCorrection.options.color = orangeMathalea
    this.figureCorrection.options.shape = 'o'
    this.figureCorrection.options.labelIsVisible = false

    const drawBluePoint = () => {
      this.figure.options.shape = 'o'
      this.figure.options.color = 'blue'
      this.figure.ui?.send('POINT')
    }
    const drawRedPoint = () => {
      this.figure.options.shape = 'x'
      this.figure.options.color = 'red'
      this.figure.ui?.send('POINT')
    }
    const eraseAllPoints = () => {
      for (const element of this.figure.elements.values()) {
        if (element.type === 'Point') {
          element.remove()
        }
      }
      this.figure.saveState()
    }
    this.figure.addCustomButton({
      action: drawBluePoint,
      tooltip: 'Placer un point bleu',
      url: bluePoint
    })
    this.figure.addCustomButton({
      action: drawRedPoint,
      tooltip: 'Placer un point rouge',
      url: redPoint
    })
    this.figure.addCustomButton({
      action: eraseAllPoints,
      tooltip: 'Effacer tous les points',
      url: remove
    })
    const emplacementPourFigure = figureApigeom({
      exercice: this,
      idApigeom: this.idApigeom,
      figure: this.figure
    })
    this.goodAnswers = []
    const codagePoints = []
    for (let j = 0; j <= this.largeur; j++) {
      for (let i = 0; i <= this.longueur; i++) {
        const valide = randint(0, 1)
        codagePoints.push(valide)
        if (valide === 0) {
          this.goodAnswers.push({ x: i, y: this.largeur - j })
          this.figureCorrection.create('Point', { x: i, y: this.largeur - j })
        }
      }
    }
    let nbPointsAide = 0
    switch (this.sup4) {
      case '1' :
      case '2' :
      case '3' :
        nbPointsAide = parseInt(this.sup4)
        break
      case '4' :
        nbPointsAide = this.goodAnswers.length / 4
        break
      case '5' :
        nbPointsAide = this.goodAnswers.length / 3
        break
      case '6' :
        nbPointsAide = this.goodAnswers.length / 2
        break
    }
    let toto = this.goodAnswers.slice()
    for (let i = 0; i < nbPointsAide; i++) {
      const unBonPoint = choice(toto) as { x: number; y: number }
      this.figure.create('Point', { x: unBonPoint.x, y: unBonPoint.y })
      toto = toto.filter(obj => !(obj.x === unBonPoint.x && obj.y === unBonPoint.y))
    }

    let enonce = `Cette grille doit contenir ${texteEnCouleurEtGras(this.goodAnswers.length.toString(), 'blue')} `
    enonce += this.goodAnswers.length === 1 ? 'point bleu.' : 'points bleus.'
    this.nbSommets = []
    for (let j = 0; j < this.largeur; j++) {
      for (let i = 0; i < this.longueur; i++) {
        const nbPoints = 4 - (codagePoints[i + j * (this.longueur + 1)] + codagePoints[i + 1 + j * (this.longueur + 1)] + codagePoints[i + (j + 1) * (this.longueur + 1)] + codagePoints[i + 1 + (j + 1) * (this.longueur + 1)])
        this.nbSommets.push(nbPoints)
        this.figure.create('TextByPosition', {
          anchor: 'middleCenter',
          text: nbPoints.toString(),
          x: i + 0.5,
          y: this.largeur - j - 0.5
        })
        this.figureCorrection.create('TextByPosition', {
          anchor: 'middleCenter',
          text: nbPoints.toString(),
          x: i + 0.5,
          y: this.largeur - j - 0.5
        })
      }
    }
    // Besoin de l'aide sur l'affichage du nombre de points
    if (this.interactif) {
      this.figure.divUserMessage.style.textAlign = 'left'
      const divNbPoints = document.createElement('div')
      const divCheckbox = document.createElement('div')
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.id = `${this.numeroExercice}checkboxAide`
      checkbox.checked = true
      checkbox.onchange = () => {
        divNbPoints.style.display = checkbox.checked ? 'block' : 'none'
      }
      const label = document.createElement('label')
      label.htmlFor = `${this.numeroExercice}checkboxAide`
      label.textContent = 'Afficher le nombre de points bleus présents sur la grille'
      label.classList.add('m-2')
      divCheckbox.classList.add('mt-4', 'text-coopmaths-struct')
      divNbPoints.classList.add('mt-4', 'text-coopmaths-struct')
      this.figure.divFigureAndUserMessage.appendChild(divCheckbox)
      divCheckbox.appendChild(checkbox)
      divCheckbox.appendChild(label)
      this.figure.divFigureAndUserMessage.appendChild(divNbPoints)
      this.figure.onChange(() => {
        const nbBluePoints = [...this.figure.elements.values()].filter(
        // @ts-expect-error e est un point donc a de la couleur
          (e) => e.type === 'Point' && e.color === 'blue'
        ).length
        divNbPoints.innerHTML = `Cette grille contient actuellement ${nbBluePoints} point${nbBluePoints === 1 ? '' : 's'} bleu${nbBluePoints === 1 ? '' : 's'}.`
      })
    }

    const texteCorr = 'Voici une solution possible :<br>'
    this.question = enonce + emplacementPourFigure
    this.correction = texteCorr + this.figureCorrection.getStaticHtml()

    if (!context.isHtml) {
      // this.question += 'Mon CODE LaTeX pour la figure'
      // this.correction += 'Mon CODE LaTeX pour la figure'
    }
  }

  correctionInteractive = () => {
    this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.idApigeom] = this.figure.json
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${0}`) as HTMLDivElement
    let isValid = true
    let validUnPoint = true
    let compteurPointsOK = 0

    /* Validation correction si unicité de la réponse mais ce n'est pas le cas
    for (let i = 0; i < this.goodAnswers.length; i++) {
      validUnPoint = this.figure.checkCoords({
        ...this.goodAnswers[i]
      }).isValid
      if (validUnPoint) compteurPointsOK++
      isValid &&= validUnPoint
    } */

    for (let j = 0; j < this.largeur; j++) {
      for (let i = 0; i < this.longueur; i++) {
        const nbPointsValides =
        (this.figure.checkCoords({ x: i, y: this.largeur - j, color: 'blue' }).isValid
          ? 1
          : 0) +
        (this.figure.checkCoords({ x: i, y: this.largeur - j - 1, color: 'blue' }).isValid
          ? 1
          : 0) +
        (this.figure.checkCoords({ x: i + 1, y: this.largeur - j, color: 'blue' }).isValid
          ? 1
          : 0) +
        (this.figure.checkCoords({ x: i + 1, y: this.largeur - j - 1, color: 'blue' }).isValid
          ? 1
          : 0)
        validUnPoint = nbPointsValides === this.nbSommets[i + j * this.longueur]
        if (validUnPoint) compteurPointsOK++
        isValid &&= validUnPoint
      }
    }

    this.figure.isDynamic = false
    this.figure.divButtons.style.display = 'none'
    this.figure.divUserMessage.style.display = 'none'
    this.figure.buttons.get('SHAKE')?.click()
    const nbPoints = [...this.figure.elements.values()].filter(
      // @ts-expect-error e est un point donc a de la couleur
      (e) => e.type !== 'pointer' && e.type === 'Point' && e.color === 'blue'
    ).length
    isValid &&= nbPoints === this.goodAnswers.length
    let message: string
    if (isValid) {
      divFeedback.innerHTML = 'Bravo !'
      return ['OK']
    }
    if (nbPoints === this.goodAnswers.length) {
      message = 'Le nombre de points placés est correct mais ' + (compteurPointsOK === 1
        ? 'seul 1 est bien placé.'
        : `seuls ${compteurPointsOK} sont bien placés.`)
    } else if (nbPoints > this.goodAnswers.length) {
      message = 'Le nombre de points placés est trop important par rapport à ce qui est attendu.'
    } else {
      message = "Le nombre de points placés n'est pas assez important par rapport à ce qui est attendu."
    }
    divFeedback.innerHTML = message
    return ['KO']
  }
}

export default jeutest
