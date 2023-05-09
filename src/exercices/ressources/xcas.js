import { xcas } from '../../modules/outils.js'
import { mathaleaRenderDiv } from '../../lib/mathalea'

class xCas {
  constructor () {
    this.typeExercice = 'html xcas'
    this.titre = 'xCas'
    this.html = document.createElement('h3')
    const intro = document.createElement('p')
    const field = document.createElement('input')
    const button = document.createElement('button')
    button.innerHTML = 'Exécuter'
    field.classList.add('mr-4', 'p-2', 'border-2', 'border-coopmaths-action', 'dark:border-coopmathsdark-action', 'focus:border-coopmaths-action-lightest', 'dark:focus:border-coopmathsdark-action-lightest', 'focus:outline-0', 'focus:ring-0', 'focus:border-1', 'bg-coopmaths-canvas', 'dark:bg-coopmathsdark-canvas', 'text-coopmaths-corpus-light', 'dark:text-coopmathsdark-corpus-light')
    field.setAttribute('autocorrect', 'off')
    field.setAttribute('spellcheck', 'false')
    button.classList.add('text-coopmaths-canvas', 'dark:text-coopmathsdark-canvas', 'bg-coopmaths-action', 'dark:bg-coopmathsdark-action',
      'hover:bg-coopmaths-action-lightest', 'dark:hover:bg-coopmathsdark-action-lightest', 'p-2')
    const result = document.createElement('div')
    result.style = 'padding: 5px; margin-top: 20px; line-height: 2.5;'
    this.html.appendChild(intro)
    this.html.appendChild(field)
    this.html.appendChild(button)
    this.html.appendChild(result)

    intro.innerHTML = '<h1 class="my-2 text-center md:text-left text-coopmaths-struct dark:text-coopmathsdark-struct text-xl md:text-l font-bold">Fonctions utiles</h1>'
    intro.innerHTML += `<ul class="mt-2 mb-5">
    <li>ifactor : décomposition en produit de facteurs premiers</li>
    <li>idivis : liste des diviseurs</li>
    <li>gcd : PGCD</li>
    <li>lcm : PPCM</li>
    <li>simplify : simplifie une expression</li>
    <li>expand : développe une expression</li>
    <li>factor : factorise une expression</li>
  </ul>`

    button.addEventListener('click', () => {
      result.innerHTML += `${field.value} <span class="mx-2">➡︎</span> $${xcas(field.value)}$`
      result.innerHTML += '<br>'
      field.value = ''
      mathaleaRenderDiv(result)
    })
  }
}

export default xCas
