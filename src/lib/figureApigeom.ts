import type Exercice from '../exercices/Exercice'
import type Figure from 'apigeom'
import { context } from '../modules/context'
import { ajouteFeedback } from './interactif/questionMathLive'

export default function figureApigeom ({ exercice, idApigeom, figure, animation = false, question = 0 }: { exercice: Exercice, idApigeom: string, figure: Figure, animation?: boolean, question?: number}) {
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
    console.log(zoom)
    console.log(figure.initial)
    figure.zoom(zoom, { changeHeight: true, changeWidth: true})
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
  })

  return `<div class="m-6" id="${idApigeom}"></div>` + ajouteFeedback(exercice, question)
}
