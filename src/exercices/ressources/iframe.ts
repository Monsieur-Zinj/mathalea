import { exercicesParams, globalOptions } from '../../lib/stores/generalStore'
import { get } from 'svelte/store'
import { createButon, createTextInput } from './_components'
import Exercice from '../Exercice'

export const uuid = 'iframe'
export const titre = 'Ressource externe'
class ressourceVideo extends Exercice {
  container: HTMLDivElement
  iframe: HTMLIFrameElement
  fieldUrl: HTMLInputElement
  fieldLargeur: HTMLInputElement
  fieldHauteur: HTMLInputElement
  button: HTMLButtonElement
  url: URL = new URL('https://coopmaths.fr/alea')
  constructor () {
    super()
    this.typeExercice = 'html'
    this.container = document.createElement('div')
    this.iframe = document.createElement('iframe')
    this.iframe.setAttribute('width', '100%')
    this.iframe.classList.add('my-10')
    this.fieldUrl = createTextInput({ placeholder: 'URL', autoCorrect: false })
    this.fieldLargeur = createTextInput({ placeholder: 'Largeur' })
    this.fieldHauteur = createTextInput({ placeholder: 'Hauteur' })
    this.button = createButon()
    this.container.append(this.fieldUrl, this.fieldLargeur, this.fieldHauteur, this.button, this.iframe)
    this.button.addEventListener('click', () => {
      this.iframe.src = this.fieldUrl.value
      if (this.fieldLargeur.value) {
        this.iframe.setAttribute('width', this.fieldLargeur.value)
      }
      if (this.fieldHauteur.value) {
        this.iframe.setAttribute('height', this.fieldHauteur.value)
      } else {
        this.iframe.setAttribute('height', (this.iframe.offsetWidth / 4 * 3).toString())
      }
      this.sup = encodeURIComponent(this.fieldUrl.value)
      exercicesParams.update(l => {
        if (this.numeroExercice !== undefined && l[this.numeroExercice] !== undefined) {
          l[this.numeroExercice].sup = encodeURIComponent(this.fieldUrl.value)
          l[this.numeroExercice].sup2 = encodeURIComponent(this.fieldLargeur.value)
          l[this.numeroExercice].sup3 = encodeURIComponent(this.fieldHauteur.value)
        }
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
    } else {
      this.iframe.setAttribute('width', '800')
    }
    if (this.sup3 !== undefined) {
      this.iframe.setAttribute('height', decodeURIComponent(this.sup3))
      this.fieldHauteur.value = decodeURIComponent(this.sup3)
    } else {
      this.iframe.setAttribute('height', '600')
    }
    return this.container
  }
}

export default ressourceVideo
