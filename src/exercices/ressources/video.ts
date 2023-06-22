import { exercicesParams, globalOptions } from '../../components/store'
import { get } from 'svelte/store'
import { createButon, createIButton, createTextInput } from './components'

class ressourceVideo {
  typeExercice: string
  numeroExercice: number
  sup: string
  titre: string
  container: HTMLDivElement
  iframe: HTMLIFrameElement
  fieldUrl: HTMLInputElement
  iTooltip: HTMLButtonElement
  button: HTMLButtonElement
  constructor () {
    this.typeExercice = 'html'
    this.titre = 'Vidéo'
    this.container = document.createElement('div')
    this.iframe = document.createElement('iframe')
    this.iframe.setAttribute('width', '560')
    this.iframe.setAttribute('height', '315')
    this.iframe.setAttribute('title', 'YouTube video player')
    this.iframe.setAttribute('frameborder', '0')
    this.iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share')
    this.iframe.setAttribute('allowfullscreen', '')
    this.iframe.classList.add('my-10')
    this.fieldUrl = createTextInput({ placeholder: 'URL', autoCorrect: false })
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
    this.container.append(this.fieldUrl, this.button, this.iTooltip, this.iframe)
    this.button.addEventListener('click', () => {
      // On transforme https://youtu.be/Jup128waBI8 en https://www.youtube.com/embed/Jup128waBI8
      this.updateVideoFromUrl()
      this.sup = encodeURIComponent(this.fieldUrl.value)
      exercicesParams.update(l => {
        l[this.numeroExercice].sup = encodeURIComponent(this.fieldUrl.value)
        return l
      })
    })
  }

  get html () {
    if (get(globalOptions).v === 'eleve') {
      this.fieldUrl.remove()
      this.button.remove()
    }
    if (this.sup !== undefined) {
      this.iframe.src = decodeURIComponent(this.sup)
      this.fieldUrl.value = decodeURIComponent(this.sup)
      this.updateVideoFromUrl()
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
      console.log(url.toString())
      this.iframe.src = url.toString()
    } else if (url.hostname === 'podeduc.apps.education.fr') {
      this.iframe.src = this.fieldUrl.value + '/?is_iframe=true'
    } else if (this.fieldUrl.value.includes('/w/')) { // Gestion des url en provenance de peertube
      this.iframe.src = this.fieldUrl.value.replace('/w/', '/videos/embed/')
    } else {
      this.iframe.src = this.fieldUrl.value
    }
  }
}

export default ressourceVideo
