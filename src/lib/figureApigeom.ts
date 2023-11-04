import type Exercice from 'src/exercices/ExerciceTs'
import type Figure from 'apigeom'
import { context } from '../modules/context'

export default function figureApigeom ({ exercice, idApigeom, figure }: { exercice: Exercice, idApigeom: string, figure: Figure}) {
  if (!context.isHtml) return ''
  // Styles par défaut
  figure.isDynamic = !!exercice.interactif
  figure.divButtons.style.display = exercice.interactif ? 'grid' : 'none'
  figure.divUserMessage.style.fontSize = '1em'
  figure.divUserMessage.style.pointerEvents = 'none'
  figure.divUserMessage.style.removeProperty('color')
  figure.divUserMessage.classList.add('text-coopmaths-struct')

  // Pour revoir la copie de l'élève dans Capytale
  document.addEventListener(idApigeom, (event: Event) => {
    const customEvent = event as CustomEvent
    const json = customEvent.detail
    figure.loadJson(JSON.parse(json))
  })

  let alreadydone = false
  document.addEventListener('exercicesAffiches', () => {
    if (alreadydone) return
    alreadydone = true
    if (!context.isHtml) return
    const container = document.querySelector(`#${idApigeom}`) as HTMLDivElement
    if (container == null) return
    container.innerHTML = ''
    figure.setContainer(container)
  })

  return `<div class="m-6" id="${idApigeom}"></div><div class="m-6 text-coopmaths-struct" id="feedback${idApigeom}"></div>`
}
