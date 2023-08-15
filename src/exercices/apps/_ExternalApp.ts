import { get } from 'svelte/store'
import { globalOptions, resultsByExercice, exercicesParams } from '../../components/store'

const titre = 'Application externe'

class ExternalApp {
  typeExercice: string
  numeroExercice: number
  sup: string
  titre: string
  container: HTMLDivElement
  iframe: HTMLIFrameElement
  url: URL
  constructor (url: string) {
    this.url = new URL(url)
    this.titre = titre
    this.typeExercice = 'html'
    this.container = document.createElement('div')
    this.iframe = document.createElement('iframe')
    this.iframe.setAttribute('width', '400px')
    this.iframe.setAttribute('height', '300px')
    this.iframe.classList.add('my-10')
    this.iframe.setAttribute('allowfullscreen', '')
    this.container.appendChild(this.iframe)
    const updateIframeSize = () => {
      if (window.innerWidth > window.innerHeight) {
        this.iframe.setAttribute('width', '100%')
        this.iframe.setAttribute('height', (document.body.offsetWidth * 0.75).toString())
      } else {
        this.iframe.setAttribute('width', '100%')
        this.iframe.setAttribute('height', (document.body.offsetWidth * 1.5).toString())
      }
    }
    window.addEventListener('resize', updateIframeSize)
    window.addEventListener('orientationchange', updateIframeSize)
    this.container.addEventListener('addedToDom', updateIframeSize)
    window.addEventListener('message', (event) => {
      if (event.data?.type === 'mathaleaSettings' && event.data?.numeroExercice === this.numeroExercice) {
        this.sup = event.data.urlParams
        exercicesParams.update((l) => {
          l[this.numeroExercice].sup = event.data.urlParams
          return l
        })
      }
    })
  }

  get html () {
    this.handleScore()
    if (this.sup !== undefined) {
      const searchParams = new URLSearchParams(this.sup)
      for (const [key, value] of searchParams.entries()) {
        this.url.searchParams.append(key, value)
      }
    }
    if (get(globalOptions).v === 'eleve') {
      this.url.searchParams.append('v', 'eleve')
    }
    this.url.searchParams.append('numeroExercice', this.numeroExercice.toString())
    this.iframe.setAttribute('src', this.url.toString())
    return this.container
  }

  handleScore () {
    window.addEventListener('message', (event) => {
      if (event.data?.type !== 'mathaleaSendScore') return
      const numberOfPoints = parseInt(event.data.score)
      const indice = parseInt(event.data.numeroExercice)
      const numberOfQuestions = parseInt(event.data.numberOfQuestions)
      resultsByExercice.update((l) => {
        l[indice] = { numberOfPoints, numberOfQuestions, indice }
        return l
      })
    })
  }
}

export default ExternalApp
