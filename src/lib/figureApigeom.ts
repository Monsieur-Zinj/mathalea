import type Exercice from '../exercices/Exercice'
import type Figure from 'apigeom'
import { context } from '../modules/context'
import { ajouteFeedback } from './interactif/questionMathLive'

/**
 * Insère une figure apigeom dans la sortie HTML de l'exercice
 * defaultAction permet de sélectionner le bouton activé par défaut
 */
export default function figureApigeom ({ exercice, idApigeom, figure, animation = false, question = 0, defaultAction }: { exercice: Exercice, idApigeom: string, figure: Figure, animation?: boolean, question?: number, defaultAction ?: string }): string {
  if (!context.isHtml) return ''
  // Styles par défaut
  figure.isDynamic = !!exercice.interactif
  figure.divButtons.style.display = (exercice.interactif || animation) ? 'grid' : 'none'
  figure.divUserMessage.style.fontSize = '1em'
  figure.divUserMessage.style.pointerEvents = 'none'
  figure.divUserMessage.style.removeProperty('color')
  figure.divUserMessage.classList.add('text-coopmaths-struct')
  if (!exercice.interactif) {
    figure.divUserMessage.style.display = 'none'
  }

  // Pour revoir la copie de l'élève dans Capytale
  document.addEventListener(idApigeom, (event: Event) => {
    const customEvent = event as CustomEvent
    const json = customEvent.detail
    figure.loadJson(JSON.parse(json))
  })

  document.addEventListener('zoomChanged', (event: Event) => {
    const customEvent = event as CustomEvent
    const zoom = Number(customEvent.detail.zoom)
    figure.zoom(zoom, { changeHeight: true, changeWidth: true, changeLeft: false, changeBottom: false })
  })

  document.addEventListener('exercicesAffiches', () => {
    if (!context.isHtml) return
    const container = document.querySelector(`#${idApigeom}`) as HTMLDivElement
    if (container == null) return
    container.innerHTML = ''
    figure.setContainer(container)
    if (animation) {
      figure.divUserMessage.innerHTML = ''
      figure.restart()
      setTimeout(() => {
        figure.buttons.get('PLAY')?.click()
      }, 3000)
    }
    if (defaultAction) {
      figure.buttons.get(defaultAction)?.click()
    }
  })

  return `<div class="m-6" id="${idApigeom}"></div>` + ajouteFeedback(exercice, question)
}
