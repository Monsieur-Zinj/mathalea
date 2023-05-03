import { xcas } from '../../modules/outils.js'
import { mathaleaRenderDiv } from '../../lib/mathalea'

export const uuid = 'fd89f'

class xCas {
  constructor () {
    this.typeExercice = 'html xcas'
    this.titre = 'xCas'
    this.html = document.createElement('h3')
    const field = document.createElement('input')
    const button = document.createElement('button')
    button.innerHTML = 'Exécuter'
    button.classList.add('text-coopmaths-action', 'dark:text-coopmathsdark-action', 'hover:text-coopmaths-action-lightest',
      'dark:hover:text-coopmathsdark-action-lightest')
    const result = document.createElement('div')
    result.style = 'padding: 5px; margin-top: 20px; line-height: 2.5;'
    this.html.appendChild(field)
    this.html.appendChild(button)
    this.html.appendChild(result)
    button.addEventListener('click', () => {
      result.innerHTML += `${field.value}$ => ${xcas(field.value)}$`
      result.innerHTML += '<br>'
      field.value = ''
      mathaleaRenderDiv(result)
    })
  }
}

export default xCas
