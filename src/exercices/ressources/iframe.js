import { exercicesParams, globalOptions } from '../../components/store'
import { get } from 'svelte/store'

class ressourceVideo {
  constructor () {
    this.typeExercice = 'html'
    this.titre = ''
    this.container = document.createElement('div')
    this.iframe = document.createElement('iframe')
    this.iframe.setAttribute('width', '100%')
    this.fieldUrl = document.createElement('input')
    this.fieldLargeur = document.createElement('input')
    this.fieldHauteur = document.createElement('input')
    this.fieldUrl.setAttribute('placeholder', 'URL')
    this.fieldLargeur.setAttribute('placeholder', 'Largeur')
    this.fieldHauteur.setAttribute('placeholder', 'Hauteur')
    this.button = document.createElement('this.button')
    this.button.innerHTML = 'Valider'
    this.fieldUrl.classList.add('mr-4', 'p-2', 'border-2', 'border-coopmaths-action', 'dark:border-coopmathsdark-action', 'focus:border-coopmaths-action-lightest', 'dark:focus:border-coopmathsdark-action-lightest', 'focus:outline-0', 'focus:ring-0', 'focus:border-1', 'bg-coopmaths-canvas', 'dark:bg-coopmathsdark-canvas', 'text-coopmaths-corpus-light', 'dark:text-coopmathsdark-corpus-light')
    this.fieldUrl.setAttribute('autocorrect', 'off')
    this.fieldUrl.setAttribute('spellcheck', 'false')
    this.fieldLargeur.classList.add('mr-4', 'p-2', 'border-2', 'border-coopmaths-action', 'dark:border-coopmathsdark-action', 'focus:border-coopmaths-action-lightest', 'dark:focus:border-coopmathsdark-action-lightest', 'focus:outline-0', 'focus:ring-0', 'focus:border-1', 'bg-coopmaths-canvas', 'dark:bg-coopmathsdark-canvas', 'text-coopmaths-corpus-light', 'dark:text-coopmathsdark-corpus-light')
    this.fieldHauteur.classList.add('mr-4', 'p-2', 'border-2', 'border-coopmaths-action', 'dark:border-coopmathsdark-action', 'focus:border-coopmaths-action-lightest', 'dark:focus:border-coopmathsdark-action-lightest', 'focus:outline-0', 'focus:ring-0', 'focus:border-1', 'bg-coopmaths-canvas', 'dark:bg-coopmathsdark-canvas', 'text-coopmaths-corpus-light', 'dark:text-coopmathsdark-corpus-light')
    this.button.classList.add('text-coopmaths-canvas', 'dark:text-coopmathsdark-canvas', 'bg-coopmaths-action', 'dark:bg-coopmathsdark-action',
      'hover:bg-coopmaths-action-lightest', 'dark:hover:bg-coopmathsdark-action-lightest', 'p-2')
    this.iframe.classList.add('my-10')
    this.container.appendChild(this.iframe)
    this.container.appendChild(this.fieldUrl)
    this.container.appendChild(this.fieldLargeur)
    this.container.appendChild(this.fieldHauteur)
    this.container.appendChild(this.button)
    this.button.addEventListener('click', () => {
      this.iframe.src = this.fieldUrl.value
      if (this.fieldLargeur.value) {
        this.iframe.setAttribute('width', this.fieldLargeur.value)
      }
      if (this.fieldHauteur.value) {
        this.iframe.setAttribute('height', this.fieldHauteur.value)
      } else {
        this.iframe.setAttribute('height', this.iframe.offsetWidth / 4 * 3)
      }
      this.sup = encodeURIComponent(this.fieldUrl.value)
      exercicesParams.update(l => {
        l[this.numeroExercice].sup = encodeURIComponent(this.fieldUrl.value)
        l[this.numeroExercice].sup2 = encodeURIComponent(this.fieldLargeur.value)
        l[this.numeroExercice].sup3 = encodeURIComponent(this.fieldHauteur.value)
        return l
      })
    })
  }

  get html () {
    if (get(globalOptions).v === 'eleve') {
      this.fieldHauteur.remove()
      this.fieldLargeur.remove()
      this.fieldUrl.remove()
      this.button.remove()
    }
    if (this.sup !== undefined) {
      this.iframe.src = decodeURIComponent(this.sup)
      this.fieldUrl.value = decodeURIComponent(this.sup)
    }
    if (this.sup2 !== undefined) {
      this.iframe.setAttribute('width', decodeURIComponent(this.sup2))
      this.fieldLargeur.value = decodeURIComponent(this.sup2)
    }
    if (this.sup3 !== undefined) {
      this.iframe.setAttribute('height', decodeURIComponent(this.sup3))
      this.fieldHauteur.value = decodeURIComponent(this.sup3)
    }
    return this.container
  }
}

export default ressourceVideo
