import { exercicesParams, globalOptions } from '../../lib/stores/generalStore'
import { get } from 'svelte/store'
import { createButon, createIButton, createTextInput } from './_components'
import { getUniqueStringBasedOnTimeStamp } from '../../lib/components/time'
import Exercice from '../Exercice'

export const uuid = 'video'
export const titre = 'Vidéo'

class ressourceVideo extends Exercice {
  container: HTMLDivElement
  iframe: HTMLIFrameElement
  fieldUrl: HTMLInputElement
  fieldText: HTMLInputElement
  teacherText: HTMLDivElement
  iTooltip: HTMLButtonElement
  button: HTMLButtonElement
  constructor () {
    super()
    this.typeExercice = 'html'
    this.titre = 'Vidéo'
    this.container = document.createElement('div')
    this.container.setAttribute('overflow', 'auto')
    this.iframe = document.createElement('iframe')
    this.iframe.setAttribute('width', '500')
    this.iframe.setAttribute('height', '315')
    this.iframe.setAttribute('title', 'YouTube video player')
    this.iframe.setAttribute('frameborder', '0')
    this.iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    )
    this.iframe.setAttribute('allowfullscreen', '')
    const updateVideoSize = () => {
      if (this.container.offsetWidth !== 0) {
        this.iframe.setAttribute('width', '100%')
        this.iframe.setAttribute('height', this.iframe.offsetWidth * 0.75 + '')
      }
    }
    this.teacherText = document.createElement('div')
    window.addEventListener('resize', updateVideoSize)
    this.container.addEventListener('addedToDom', updateVideoSize)

    // constitution d'une ID pour mise en forme dans app.css
    this.iframe.setAttribute(
      'id',
      'iframe-video' + getUniqueStringBasedOnTimeStamp('-')
    )
    // /!\ pas de mise en formee ici !!!
    // this.iframe.classList.add('my-10')
    this.fieldUrl = createTextInput({ placeholder: 'URL', autoCorrect: false })
    this.fieldText = createTextInput({ placeholder: 'Consigne éventuelle' })
    this.fieldText.style.display = 'block'
    this.button = createButon()
    const tooltip = `Formats supportés : 
- lien direct vers la vidéo
- peertube
- podeduc.apps.education.fr
- www.youtube.com
- youtu.be
- www.dailymotion.com
- dai.ly
- vimeo.com`
    this.iTooltip = createIButton({ tooltip, direction: 'bottom' })
    this.container.append(
      this.fieldUrl,
      this.iTooltip,
      this.fieldText,
      this.teacherText,
      this.button,
      this.iframe
    )
    this.button.addEventListener('click', () => {
      // On transforme https://youtu.be/Jup128waBI8 en https://www.youtube.com/embed/Jup128waBI8
      this.updateVideoFromUrl()
      this.sup = encodeURIComponent(this.fieldUrl.value)
      if (this.fieldText.value !== '') {
        this.sup2 = encodeURIComponent(this.fieldText.value)
      }
      exercicesParams.update((l) => {
        if (this.numeroExercice !== undefined && l[this.numeroExercice] !== undefined) {
          l[this.numeroExercice].sup = this.sup
          if (this.fieldText.value !== '') {
            l[this.numeroExercice].sup2 = encodeURIComponent(this.fieldText.value)
          }
        }
        return l
      })
    })
  }

  get html () {
    if (get(globalOptions).v === 'eleve') {
      this.fieldUrl.remove()
      this.fieldText.remove()
      this.button.remove()
      this.iTooltip.remove()
    }
    if (this.sup !== undefined) {
      try {
        this.iframe.src = decodeURIComponent(this.sup)
        this.fieldUrl.value = decodeURIComponent(this.sup)
      } catch (e) {
        console.error('Invalid URI: ', this.sup)
      }
      this.updateVideoFromUrl()
    }
    if (this.sup2 !== undefined) {
      try {
        this.teacherText.textContent = decodeURIComponent(this.sup2)
      } catch (e) {
        console.error('Invalid URI: ', this.sup2)
      }
    }
    return this.container
  }

  updateVideoFromUrl () {
    const url = new URL(this.fieldUrl.value)
    if (url.hostname === 'youtu.be') {
      url.hostname = 'www.youtube.com'
      url.pathname = '/embed' + url.pathname
      this.iframe.src = url.toString()
    } else if (url.hostname === 'www.youtube.com') {
      this.iframe.src = url.toString().replace('watch?v=', 'embed/')
    } else if (url.hostname === 'www.dailymotion.com') {
      url.pathname = '/embed' + url.pathname
      this.iframe.src = url.toString()
    } else if (url.hostname === 'dai.ly') {
      url.hostname = 'www.dailymotion.com'
      url.pathname = '/embed/video' + url.pathname
      this.iframe.src = url.toString()
    } else if (url.hostname === 'vimeo.com') {
      url.hostname = 'player.vimeo.com'
      url.pathname = '/video' + url.pathname
      this.iframe.src = url.toString()
    } else if (url.hostname === 'podeduc.apps.education.fr') {
      this.iframe.src = this.fieldUrl.value + '/?is_iframe=true'
    } else if (this.fieldUrl.value.includes('/w/')) {
      // Gestion des url en provenance de peertube
      this.iframe.src = this.fieldUrl.value.replace('/w/', '/videos/embed/')
    } else {
      this.iframe.src = this.fieldUrl.value
    }
    this.teacherText.textContent = this.fieldText.value
    this.titre = this.fieldText.value
  }
}

export default ressourceVideo
