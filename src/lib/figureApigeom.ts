import type Exercice from 'src/exercices/ExerciceTs'
import type Figure from 'apigeom'
import { context } from '../modules/context'

export default function figureApigeom ({ exercice, idApigeom, figure }: { exercice: Exercice, idApigeom: string, figure: Figure}) {
  // Styles par défaut
  figure.divButtons.classList.add('mb-10')
  figure.divButtons.style.display = 'flex'
  figure.isDynamic = !!exercice.interactif
  figure.divButtons.style.display = exercice.interactif ? 'flex' : 'none'
  figure.divUserMessage.style.fontSize = '1em'
  figure.divUserMessage.style.pointerEvents = 'none'
  figure.divUserMessage.style.top = '-50px'

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
    if (figure.container == null) {
      container.innerHTML = ''
      container.appendChild(figure.divButtons)
      figure.setContainer(container)
    }
  })

  return `<div class="m-6" id="${idApigeom}"></div><div class="m-6" id="feedback${idApigeom}"></div>`
}
