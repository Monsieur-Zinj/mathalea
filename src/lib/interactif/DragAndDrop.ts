import type Exercice from '../../exercices/Exercice.js'
import { context } from '../../modules/context.js'
import { shuffle } from '../outils/arrayOutils'
import { get } from '../html/dom.js'
import { messageFeedback } from '../../modules/messages.js'
import { toutPourUnPoint } from './mathLive.js'

export type Etiquette = {
  id: string // Un numéro unique par étiquette ! (valeur réservée : 0 pour signaler l'absence d'étiquette !)
  contenu: string // Ce que contient l'étiquette (aussi bien du texte, que du latex, qu'une image...)
  callback?: (e: Event) => void // @todo à implémenter.
}
/*
L'utilisation de l'interactif façon drag&drop nécessite la déclaration des bonnes réponses avec handleHanswers() :
Un exemple :
handleHanswers(this, i, {
rectangle1: {value: etiquetteId, callback?: ()=>void},
rectangle2: {value: etiquetteId, callback?: ()=>void},
....,
{formatInteractif: 'dnd'})

La fonction de callback est exécutée sur le rectangle (div) correspondant.
Par exemple, on peut imaginer un fonction qui regarde le textContent de l'élément précédent et qui,
si c'est un nombre supérieur à 1, ajoute un 's' au contenu de l'étiquette 'droppée' dans le rectangle.
Ce n'est qu'une idée, je ne sais même pas si c'est réalisable, ni même souhaitable à l'heure où je mets au point ces fonctions !
En fait, c'était pour éviter de doubler le nombre d'étiquettes avec des singuliers et des pluriels...
Pour l'instant, l'utilisation de cette callback n'est pas implémentée.
*/
type DragHandler = (e: DragEvent) => void
type TouchHandler = (e: TouchEvent) => void
/*
function dontTouchSpanInside (element: HTMLSpanElement | HTMLDivElement) {
  const childs = element.querySelectorAll('span')
  if (childs.length === 0 && element instanceof HTMLSpanElement) element.draggable = false
  else {
    for (const child of childs) {
      if (child instanceof HTMLSpanElement) dontTouchSpanInside(child)
    }
  }
}
*/
function dragStartHandler (e: DragEvent) {
  if (e.target instanceof HTMLElement) {
    e.dataTransfer?.setData('text/plain', e.target.id)
  }
}
function dragOverHandler (e: DragEvent) {
  e.preventDefault() // Nécessaire pour autoriser le drop
}
function dropHandler (e: DragEvent) {
  e.preventDefault()
  const etiquetteId = e.dataTransfer?.getData('text/plain')
  if (etiquetteId) {
    const etiquette = document.getElementById(etiquetteId)
    if (etiquette && e.target instanceof HTMLElement) {
      e.target.appendChild(etiquette)
      e.target.classList.remove('hovered') // Enlève l'effet après le drop
    }
  }
}

function touchStartHandler (e: TouchEvent) {
  let target = e.target as HTMLElement

  // Si le touch a été déclenché sur un élément interne (comme un <span>), on remonte jusqu'au parent <div>
  while (target && target.tagName !== 'DIV') {
    target = target.parentElement as HTMLElement
  }

  if (target?.classList.contains('etiquette')) {
    const touch = e.touches[0]
    target.dataset.touchId = touch.identifier.toString()
  }
}

function touchMoveHandler (e: TouchEvent) {
  e.preventDefault()
  const touch = e.changedTouches[0]
  let etiquette = touch.target as HTMLElement
  while (etiquette && etiquette.tagName !== 'DIV') {
    etiquette = etiquette.parentElement as HTMLElement
  }

  if (etiquette) {
    if (etiquette.parentElement) {
      const top = etiquette.parentElement.offsetTop
      const left = etiquette.parentElement.offsetLeft
      const rectangleBounds = etiquette.parentElement.getBoundingClientRect()
      if (rectangleBounds) {
        const touchX = touch.clientX
        const touchY = touch.clientY
        ;(etiquette as HTMLDivElement).style.position = 'absolute'
        ;(etiquette as HTMLDivElement).style.left =
          `${touchX - rectangleBounds.left + left + touch.radiusX}px`
        ;(etiquette as HTMLDivElement).style.top =
          `${touchY - rectangleBounds.top + top - touch.radiusY * 2}px`
      }
    }
    const rectangles = document.querySelectorAll('div.rectangleDND')
    for (const rectangle of rectangles) {
      const rectangleBounds = rectangle.getBoundingClientRect()
      const isHovered =
        touch.clientX > rectangleBounds.left &&
        touch.clientX < rectangleBounds.right &&
        touch.clientY > rectangleBounds.top &&
        touch.clientY < rectangleBounds.bottom
      if (isHovered) {
        rectangle.classList.add('hovered')
      } else {
        rectangle.classList.remove('hovered')
      }
    }
  }
}

function touchEndHandler (e: TouchEvent) {
  const touch = e.changedTouches[0]
  let etiquette = touch.target as HTMLElement
  while (etiquette && etiquette.tagName !== 'DIV') {
    etiquette = etiquette.parentElement as HTMLElement
  }
  if (etiquette) {
    const centerX = touch.clientX
    const centerY = touch.clientY
    const rectangles = document.querySelectorAll('div.rectangleDND')
    let dropTarget: HTMLDivElement | null = null
    for (const rectangle of rectangles) {
      const rectangleBounds = rectangle.getBoundingClientRect()
      if (
        centerX > rectangleBounds.left &&
        centerX < rectangleBounds.right &&
        centerY > rectangleBounds.top &&
        centerY < rectangleBounds.bottom
      ) {
        dropTarget = rectangle as HTMLDivElement
        break
      }
    }
    if (!dropTarget) return
    console.log(`DropTarget : ${dropTarget}`)
    if (dropTarget?.classList.contains('rectangleDND')) {
      dropTarget.appendChild(etiquette)
      dropTarget.classList.remove('hovered') // Enlève l'effet après le drop
    }
    (etiquette as HTMLDivElement).style.position = 'static'
    delete (etiquette as HTMLDivElement).dataset.touchId
  }
}

function dragEnterHandler (e: DragEvent) {
  if (
    e.target instanceof HTMLElement &&
    e.target.classList.contains('rectangleDND')
  ) {
    e.target.classList.add('hovered')
  }
}

function dragLeaveHandler (e: DragEvent) {
  if (
    e.target instanceof HTMLElement &&
    e.target.classList.contains('rectangleDND')
  ) {
    e.target.classList.remove('hovered')
  }
}
/**
 * C'est la fonction utilisée par exerciceInteractif pour vérifier ce type de question
 * @param exercice
 * @param question
 * @returns
 */
export function verifDragAndDrop (
  exercice: Exercice,
  question: number
): {
  isOk: boolean
  feedback: string
  score: { nbBonnesReponses: number; nbReponses: number }
} {
  // tout d'abord on va supprimer les listeners !
  const exoDragAndDrops = exercice.dragAndDrops
  if (exoDragAndDrops == null) {
    window.notify(
      "Problème survenu dans verifDragAndDrop : il n'y a pas d'array dragAndDrops dans exercice",
      {}
    )
    return {
      isOk: false,
      feedback: 'Un problème est survenu',
      score: { nbBonnesReponses: 0, nbReponses: 0 }
    }
  }
  const leDragAndDrop = exoDragAndDrops[question]
  for (const [element, type, listener] of leDragAndDrop.listeners) {
    element.removeEventListener(type, listener)
  }
  // fin de suppression des listeners
  const numeroExercice = exercice.numeroExercice
  const feedback = ''
  const objetReponses = exercice.autoCorrection[question].reponse?.valeur
  let nbBonnesReponses = 0
  let etiquettesAbsentes = 0
  let etiquettesMalPlacees = 0
  if (objetReponses) {
    const bareme = objetReponses.bareme ?? toutPourUnPoint

    const variables = Object.entries(objetReponses).filter(
      ([key]) => key !== 'callback' && key !== 'bareme' && key !== 'feedback'
    )

    let nbReponses = objetReponses != null ? variables.length : 0
    const rectangles = get(
      `rectanglesEx${exercice.numeroExercice}Q${question}`,
      false
    )
    if (!rectangles) {
      window.notify(
        'Un problème avec verifDragAndDrop, je ne trouve pas la zone de drop !',
        {}
      )
      return {
        isOk: false,
        feedback: 'Un problème est survenu',
        score: { nbBonnesReponses, nbReponses }
      }
    }
    if (objetReponses == null) {
      window.notify(
        "Un problème avec verifDragAndDrop, il n'y a pas de réponses de définies !",
        {}
      )
      return {
        isOk: false,
        feedback: 'Un problème est survenu',
        score: { nbBonnesReponses, nbReponses }
      }
    }
    const reponses = Object.entries(objetReponses)
    const points: number[] = []

    if (!exercice.answers) exercice.answers = {}
    for (let k = 1; k <= nbReponses; k++) {
      const rectangle = get(
        `rectangleEx${numeroExercice}Q${question}R${k}`,
        false
      )
      if (rectangle) {
        const etiquetteDedans = rectangle.querySelector('.etiquette')
        const id =
          etiquetteDedans?.id ?? `etiquetteEx${numeroExercice}Q${question}I0`
        const etiquetteId = id.split('I')[1]
        // @fixme vérifier que l'enregistrement de cet objet permet de retrouver les bonnes données.
        exercice.answers = Object.assign(
          exercice.answers,
          Object.fromEntries([
            [`rectangleEx${numeroExercice}Q${question}R${k}`, id]
          ])
        )
        const goodAnswer = reponses.find(([key]) => key === `rectangle${k}`)
        if (!etiquetteDedans) { // Faut peut-être pas compter faux si l'absence d'étiquette est normal, mais faut voir comment on fait
          // si le rectangle peut rester vide, il faut que goodAnswer[1].value soit ''
          if (goodAnswer && goodAnswer[1] != null && goodAnswer[1].value === '') {
            nbBonnesReponses++
            points.push(1)
          } else {
            rectangle.classList.add('bg-coopmaths-action-200')
            points.push(0)
            etiquettesAbsentes++
          }
        } else if (
          goodAnswer &&
          goodAnswer[1] != null &&
          etiquetteId === goodAnswer[1].value
        ) {
          etiquetteDedans?.classList.remove('bg-gray-200')
          etiquetteDedans.classList.add('bg-coopmaths-warn-100')
          nbBonnesReponses++
          points.push(1)
        } else {
          etiquetteDedans?.classList.remove('bg-gray-200')
          etiquetteDedans.classList.add('bg-coopmaths-action-200')
          points.push(0)
          if (goodAnswer && goodAnswer[1] != null && etiquetteId === '0') {
            etiquettesAbsentes++ // Normalement, ce cas a été traité par !etiquetteDedans
          } else {
            etiquettesMalPlacees++
          }
        }
      }
    }
    // gestion du feedback
    const spanReponseLigne = document.querySelector(
      `#resultatCheckEx${numeroExercice}Q${question}`
    )

    let typeFeedback = 'positive'
    let resultat: string
    if (nbBonnesReponses === nbReponses) {
      if (spanReponseLigne) {
        spanReponseLigne.innerHTML = '😎'
      }
      resultat = 'OK'
    } else {
      if (spanReponseLigne) spanReponseLigne.innerHTML = '☹️'
      typeFeedback = 'error'
      resultat = 'KO'
    }
    // Gestion du feedback global de la question
    if (spanReponseLigne) {
      (spanReponseLigne as HTMLSpanElement).style.fontSize = 'large'
    }
    const eltFeedback = get(`feedbackEx${numeroExercice}Q${question}`, false)
    let message = ''
    if (eltFeedback) {
      eltFeedback.innerHTML = ''
    }
    if (resultat === 'KO') {
      // Juste mais incomplet
      if (nbBonnesReponses > 0) {
        message = `${nbBonnesReponses} bonne${nbBonnesReponses > 1 ? 's' : ''} réponse${nbBonnesReponses > 1 ? 's' : ''}`
      }
      if (etiquettesAbsentes > 0) {
        message += ` ${etiquettesAbsentes} réponse${etiquettesAbsentes > 1 ? 's' : ''} manquante${etiquettesAbsentes > 1 ? 's' : ''}`
      }
      if (etiquettesMalPlacees > 0) {
        message += ` ${etiquettesMalPlacees} réponse${etiquettesMalPlacees > 1 ? 's' : ''} mal placée${etiquettesMalPlacees > 1 ? 's' : ''}`
      }
    } else {
      message = ''
    }

    messageFeedback({
      id: `feedbackEx${numeroExercice}Q${question}`,
      message,
      type: typeFeedback
    })
    ;[nbBonnesReponses, nbReponses] = bareme(points)

    return {
      isOk: nbBonnesReponses === nbReponses,
      feedback,
      score: { nbBonnesReponses, nbReponses }
    }
  }
  window.notify(
    "VerifDragAndDrop a un problème : il n'y a pas d'objet réponse fourni",
    {}
  )
  return {
    isOk: false,
    feedback: 'Un problème est survenu',
    score: { nbBonnesReponses: 0, nbReponses: 0 }
  }
}

class DragAndDrop {
  exercice: Exercice
  question: number
  consigne: string
  etiquettes: Etiquette[]
  enonceATrous: string
  listeners: [Element, string, DragHandler | TouchHandler][]
  constructor ({
    exercice,
    question,
    consigne,
    etiquettes,
    enonceATrous
  }: {
    exercice: Exercice
    question: number
    consigne: string
    etiquettes: Etiquette[]
    enonceATrous: string
  }) {
    this.exercice = exercice
    this.question = question
    this.consigne = consigne
    this.etiquettes = etiquettes
    this.enonceATrous = enonceATrous
    this.listeners = []
  }

  /** Une méthode pour ajouter un contenu interactif de type Drag and drop
   *  enonceATrous est une chaine de caractères avec le format suivant: 'blabla..%{rectangle1}blabla%{rectangle2}blibli...'
   *  Les différents % { rectanglen } sont remplacés par des div rectangulaires pouvant accueillir les étiquettes.
   * @param param0
   * @returns
   */
  ajouteDragAndDrop () {
    const numeroExercice = this.exercice.numeroExercice
    if (context.isHtml) {
      let html = ''
      html += `<div class="questionDND" id="divDragAndDropEx${numeroExercice}Q${this.question}">\n\t`
      html += `<div class="consigneDND">${this.consigne}</div>\n\t`
      html += `<div  class="etiquettes" ${this.exercice.interactif ? 'style="border: 1px dashed #AAA" ' : ''} id="etiquettesEx${numeroExercice}Q${this.question}">\n\t`
      const etiquettesEnDesordre = shuffle(this.etiquettes.slice())
      for (const etiquette of etiquettesEnDesordre) {
        html += `<div class="etiquette${this.exercice.interactif ? ' dragOk' : ' noDrag'} ${this.exercice.interactif ? ' bg-gray-200' : ''}" draggable="${this.exercice.interactif ? 'true' : 'false'}" id="etiquetteEx${numeroExercice}Q${this.question}I${etiquette.id}">${etiquette.contenu}</div>\n\t`
      }
      html += '</div>'

      html += `<div class="rectangles" id="rectanglesEx${numeroExercice}Q${this.question}" >\n\t`
      let resteEnonce = this.enonceATrous
      let htmlEnonce = ''
      while (resteEnonce) {
        const chunks = /^(.*?)%\{([^}]+)}(.*?)$/.exec(resteEnonce)
        if (chunks) {
          const [, start, n, end] = chunks
          const name = n
          if (name == null) throw Error(`Définition de ${name} manquante`)
          htmlEnonce += `<span>${start}</span>`
          if (this.exercice.interactif) {
            htmlEnonce += `<div class="rectangleDND" id="rectangleEx${numeroExercice}Q${this.question}R${name.substring(9)}"></div>`
          } else {
            htmlEnonce +=
              '<hr style="height: 20px; width: 60px; border: 1px dashed #555;">'
          }
          resteEnonce = end ?? ''
        } else {
          htmlEnonce += resteEnonce
          resteEnonce = ''
        }
      }
      html += htmlEnonce
      html += `<span id="resultatCheckEx${numeroExercice}Q${this.question}"></span></div>`
      if (this.exercice.interactif) {
        // ajoutons le div#feedback
        html += `<div class ="ml-2 py-2 italic text-coopmaths-warn-darkest dark:text-coopmathsdark-warn-darkest" id="feedbackEx${numeroExercice}Q${this.question}"></div>`
        // Il faut mettre en place les listeners !
        document.addEventListener('exercicesAffiches', () => {
          const divEtiquettes = get(
            `etiquettesEx${numeroExercice}Q${this.question}`,
            false
          )
          if (divEtiquettes) {
            divEtiquettes.addEventListener('drop', dropHandler)
            divEtiquettes.addEventListener('dragover', dragOverHandler)
            divEtiquettes.addEventListener('touchmove', touchMoveHandler, {
              capture: true
            })
            divEtiquettes.addEventListener('touchend', touchEndHandler)
            this.listeners.push(
              [divEtiquettes, 'drop', dropHandler],
              [divEtiquettes, 'dragover', dragOverHandler],
              [divEtiquettes, 'touchmove', touchMoveHandler],
              [divEtiquettes, 'touchend', touchEndHandler]
            )
            for (const etiquette of divEtiquettes.querySelectorAll(
              '.etiquette'
            )) {
              (etiquette as HTMLDivElement).addEventListener(
                'dragstart',
                dragStartHandler
              )
              ;(etiquette as HTMLDivElement).addEventListener(
                'touchstart',
                touchStartHandler,
                { capture: false }
              )
              this.listeners.push(
                [etiquette, 'dragstart', dragStartHandler],
                [etiquette, 'touchstart', touchStartHandler]
              )
            }
          }

          const rectangles = get(
            `rectanglesEx${numeroExercice}Q${this.question}`,
            false
          )
          if (rectangles) {
            for (const rectangle of rectangles.querySelectorAll(
              '.rectangleDND'
            )) {
              (rectangle as HTMLDivElement).addEventListener(
                'dragover',
                dragOverHandler
              )
              ;(rectangle as HTMLDivElement).addEventListener(
                'drop',
                dropHandler
              )
              ;(rectangle as HTMLDivElement).addEventListener(
                'touchmove',
                touchMoveHandler
              )
              ;(rectangle as HTMLDivElement).addEventListener(
                'touchend',
                touchEndHandler
              )
              ;(rectangle as HTMLDivElement).addEventListener(
                'dragenter',
                dragEnterHandler
              )
              ;(rectangle as HTMLDivElement).addEventListener(
                'dragleave',
                dragLeaveHandler
              )
              this.listeners.push(
                [rectangle, 'dragover', dragOverHandler],
                [rectangle, 'drop', dropHandler],
                [rectangle, 'touchmove', touchMoveHandler],
                [rectangle, 'touchend', touchEndHandler],
                [rectangle, 'dragenter', dragEnterHandler],
                [rectangle, 'dragleave', dragLeaveHandler]
              )
            }
          }
        })
      } else {
        const divEtiquettes = get(
          `etiquettesEx${numeroExercice}Q${this.question}`,
          false
        )
        if (divEtiquettes) {
          for (const etiquette of divEtiquettes.querySelectorAll(
            '.etiquette'
          )) {
            etiquette.classList.add('noDrag')
          }
        }
      }
      return html
    }
    const latex = ''
    return latex
  }
}

export default DragAndDrop
