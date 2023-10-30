import type Exercice from 'src/exercices/ExerciceTs'
import type Figure from 'apigeom'
import { context } from '../modules/context'

export default function figureApigeom ({ exercice, idApigeom, figure }: { exercice: Exercice, idApigeom: string, figure: Figure}) {
  // Styles par défaut
  figure.isDynamic = !!exercice.interactif
  figure.divButtons.style.display = exercice.interactif ? 'grid' : 'none'
  figure.divUserMessage.style.fontSize = '1em'
  figure.divUserMessage.style.pointerEvents = 'none'

  // Pour revoir la copie de l'élève dans Capytale
  document.addEventListener(idApigeom, (event: Event) => {
    const customEvent = event as CustomEvent
    const json = customEvent.detail
    figure.loadJson(JSON.parse(json))
  })

  document.addEventListener('exercicesAffiches', () => {
    if (!context.isHtml) return
    const container = document.querySelector(`#${idApigeom}`) as HTMLDivElement
    if (container == null) return
    container.innerHTML = ''
    figure.setContainer(container)
  })

  return `<div class="m-6" id="${idApigeom}"></div><div class="m-6" id="feedback${idApigeom}"></div>`
}
