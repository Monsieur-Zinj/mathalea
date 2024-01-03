import scratchblocks from 'scratchblocks'
import scratchFr from '../json/scratchFr.json'
import { get } from 'svelte/store'
import { globalOptions } from './stores/generalStore'

export default function renderScratch (selector = '') {
  // Exécuter 2 fois le rendu sur un même élément <pre> semble buguer
  // Donc le sélectionneur css ne cible que l'exercice en cours
  // pour ne pas altérer les rendus des autres exercices
  if (selector !== '') selector = selector + ' '
  scratchblocks.loadLanguages({ fr: scratchFr })
  scratchblocks.renderMatching(`${selector}pre.blocks`, {
    style: 'scratch3',
    languages: ['fr'],
    scale: 0.7
  })
  // Le code est rendu dans un svg enfant de pre.blocks
  // Quand le render passe une 2e fois, il essaie de rendre le code svg d'où le bug
  // Donc une fois le code rendu, on enlève la classe blocks pour ne plus le sélectionner
  document.querySelectorAll(`${selector}pre.blocks`).forEach(el => el.classList.remove('blocks'))
  scratchblocks.renderMatching(`${selector}code.b`, {
    inline: true,
    style: 'scratch3',
    languages: ['fr'],
    scale: 0.7
  })
}

export function scratchZoomUpdate () {
  const scratchDivs = document.getElementsByClassName('scratchblocks')
  for (const scratchDiv of scratchDivs) {
    const svgDivs = scratchDiv.getElementsByTagName('svg')
    for (const svg of svgDivs) {
      if (svg.hasAttribute('data-width') === false) {
        const originalWidth = svg.getAttribute('width')
        svg.dataset.width = originalWidth ?? undefined
      }
      if (svg.hasAttribute('data-height') === false) {
        const originalHeight = svg.getAttribute('height')
        svg.dataset.height = originalHeight ?? undefined
      }
      const w =
        Number(svg.getAttribute('data-width')) * Number(get(globalOptions).z)
      const h =
        Number(svg.getAttribute('data-height')) * Number(get(globalOptions).z)
      svg.setAttribute('width', w.toString())
      svg.setAttribute('height', h.toString())
    }
  }
}
