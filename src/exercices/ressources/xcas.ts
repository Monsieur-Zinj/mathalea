import { xcas } from '../../modules/outils.js'
import { mathaleaRenderDiv } from '../../lib/mathalea.js'
import { createButon, createTextInput } from './components.js'

class xCas {
  typeExercice: string
  titre: string
  html: HTMLDivElement
  constructor () {
    this.typeExercice = 'html xcas'
    this.titre = 'xCas'
    this.html = document.createElement('div')
    const intro = document.createElement('p')
    const field = createTextInput({ autoCorrect: false })
    const button = createButon({ title: 'Exécuter' })
    const result = document.createElement('div')
    result.classList.add('p-2', 'mt-4')
    result.style.lineHeight = '3'
    this.html.append(intro, field, button, result)
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
