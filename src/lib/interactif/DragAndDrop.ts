import type Exercice from '../../exercices/Exercice.js'
import { context } from '../../modules/context.js'
import { shuffle } from '../outils/arrayOutils.js'
import { get } from '../html/dom.js'
import { messageFeedback } from '../../modules/messages.js'
import { toutPourUnPoint } from './mathLive.js'

export type Etiquettes = {
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
Ce n'est qu'une idée, je ne sais même pas si c'est réalisable à l'heure où je mets au point ces fonctions !
mais on peut imaginer que cette fonction soit mutualisée.
*/

function dragStartHandler (e) {
  e.dataTransfer.setData('text/plain', e.target.id)
}
function dragOverHandler (e) {
  e.preventDefault() // Nécessaire pour autoriser le drop
}
function dropHandler (e) {
  e.preventDefault()
  const etiquetteId = e.dataTransfer.getData('text/plain')
  const etiquette = get(etiquetteId, false)
  if (etiquette) e.target.appendChild(etiquette)
}
function touchStartHandler (e) {
  const touch = e.touches[0]
  e.target.dataset.touchId = touch.identifier
}
function touchMoveHandler (e: TouchEvent) {
  e.preventDefault()
  const touch = e.touches[0]
  const etiquette = document.querySelector(
    `[data-touch-id="${touch.identifier}"]`
  )
  if (etiquette) {
    const touchX = touch.clientX
    const touchY = touch.clientY
    ;(etiquette as HTMLDivElement).style.position = 'absolute'
    ;(etiquette as HTMLDivElement).style.left =
      `${touchX - (etiquette as HTMLDivElement).offsetWidth / 2}px`
    ;(etiquette as HTMLDivElement).style.top =
      `${touchY - (etiquette as HTMLDivElement).offsetHeight / 2}px`
  }
}
function touchEndHandler (e: TouchEvent) {
  const etiquette = document.querySelector(
    `[data-touch-id="${touch.identifier}"]`
  )
  if (etiquette) {
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY)
    if (dropTarget?.classList.contains('rectangle')) {
      dropTarget.appendChild(etiquette)
    }
    (etiquette as HTMLDivElement).style.position = 'static'
    delete (etiquette as HTMLDivElement).dataset.touchId
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
    window.notify('Problème survenu dans verifDragAndDrop : il n\'y a pas d\'array dragAndDrops dans exercice', {})
    return {
      isOk: false,
      feedback: 'Un problème est survenu',
      score: { nbBonnesReponses, nbReponses }
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
  let nbMauvaisesReponses = 0
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
    exercice.answers = {}
    for (let k = 1; k <= nbReponses; k++) {
      const rectangle = get(
        `rectangleEx${numeroExercice}Q${question}R${k}`,
        false
      )
      if (rectangle) {
        const etiquetteDedans = rectangle.querySelector('.etiquette')
        const id = etiquetteDedans?.id ?? `etiquetteEx${numeroExercice}Q${question}I0`
        const etiquetteId = id.split('I')[1]
        // @fixme vérifier que l'enregistrement de cet objet permet de retrouver les bonnes données.
        exercice.answers = Object.assign(exercice.answers, Object.fromEntries([[`rectangle${k}`, etiquetteId]]))
        const goodAnswer = reponses.find(([key]) => key === `rectangle${k}`)
        if (
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
            nbMauvaisesReponses++
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
    if (spanReponseLigne) { (spanReponseLigne as HTMLSpanElement).style.fontSize = 'large' }
    const eltFeedback = get(`feedbackEx${numeroExercice}Q${question}`, false)
    let message = ''
    if (eltFeedback) {
      eltFeedback.innerHTML = ''
    }
    if (resultat === 'KO') {
    // Juste mais incomplet
      if (nbBonnesReponses > 0 && nbMauvaisesReponses === 0) {
        message = `${nbBonnesReponses} bonne${nbBonnesReponses > 1 ? 's' : ''} réponse${nbBonnesReponses > 1 ? 's' : ''}`
      } else if (nbBonnesReponses > 0 && nbMauvaisesReponses > 0) {
      // Du juste et du faux
        message = `${nbMauvaisesReponses} erreur${nbMauvaisesReponses > 1 ? 's' : ''}`
      } else if (nbBonnesReponses === 0 && nbMauvaisesReponses > 0) {
      // Que du faux
        message = `${nbMauvaisesReponses} erreur${nbMauvaisesReponses > 1 ? 's' : ''}`
      /* } else { // Aucune réponse
              message = ''
            */
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
  etiquettes: Etiquettes[]
  enonceATrous: string
  listeners: [Element, string, (e)=>void][]
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
    etiquettes: Etiquettes[]
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
            divEtiquettes.addEventListener('touchmove', touchMoveHandler)
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
              etiquette.addEventListener('dragstart', dragStartHandler)
              etiquette.addEventListener('touchstart', touchStartHandler)
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
              rectangle.addEventListener('dragover', dragOverHandler)
              rectangle.addEventListener('drop', dropHandler)
              rectangle.addEventListener('touchmove', touchMoveHandler)
              rectangle.addEventListener('touchend', touchEndHandler)
              this.listeners.push(
                [rectangle, 'dragover', dragOverHandler],
                [rectangle, 'drop', dropHandler],
                [rectangle, 'touchmove', touchMoveHandler],
                [rectangle, 'touchend', touchEndHandler]
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
          for (const etiquette of divEtiquettes.querySelectorAll('.etiquette')) {
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
