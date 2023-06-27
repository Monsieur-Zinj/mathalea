import { xcas } from '../../modules/outils.js'
import { mathaleaRenderDiv } from '../../lib/mathalea.js'
import { createButon, createTextInput } from './components.js'
import { createList } from '../../lib/format/lists.js'
import type { List } from '../../lib/format/lists.js'
import { getUniqueStringBasedOnTimeStamp } from '../../components/utils/time.js'
class xCas {
  typeExercice: string
  titre: string
  html: HTMLDivElement
  constructor () {
    this.typeExercice = 'html xcas'
    this.titre = 'xCas'
    this.html = document.createElement('div')
    let firstTime:boolean = true
    const intro = document.createElement('p')
    const field = createTextInput({ autoCorrect: false })
    const button = createButon({ title: 'Exécuter' })
    const resultTitle = document.createElement('div')
    const result = document.createElement('div')
    result.setAttribute('id', 'xcas-results' + getUniqueStringBasedOnTimeStamp('-'))
    this.html.append(intro, field, button, resultTitle, result)
    // ToFix : Remettre ce titre quand la liste refonctionnera
    // intro.innerHTML = '<h1 id="h1-xcas">Fonctions utiles</h1>'
    const commandsList: List = {
      items: [
        { description: 'ifactor', text: ' : décomposition en produit de facteurs premiers' },
        { description: 'idivis', text: ' : liste des diviseurs' },
        { description: 'gcd', text: ' : PGCD' },
        { description: 'lcm', text: ' : PPCM' },
        { description: 'simplify', text: ' : simplifie une expression' },
        { description: 'expand', text: ' : développe une expression' },
        { description: 'factor', text: ' : factorise une expression' }
      ],
      style: 'puces',
      classOptions: 'xcas-help'
    }
    // ToFix
    // intro.innerHTML += createList(commandsList)

    button.addEventListener('click', () => {
      if (firstTime) {
        firstTime = false
        resultTitle.innerHTML += '<h1 id="h1-xcas">Résultats</h1>'
      }
      result.innerHTML += `${field.value} <span class="mx-2">➡︎</span> $${xcas(field.value)}$`
      result.innerHTML += '<br>'
      field.value = ''
      mathaleaRenderDiv(result)
    })
  }
}

export default xCas
