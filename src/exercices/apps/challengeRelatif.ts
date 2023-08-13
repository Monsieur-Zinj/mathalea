import { get } from 'svelte/store'
import { globalOptions, resultsByExercice, exercicesParams } from '../../components/store'

export const uuid = 'challengeRelatif'
export const titre = 'Challenge relatifs'

class challengeRelatif {
  typeExercice: string
  numeroExercice: number
  sup: string
  titre: string
  container: HTMLDivElement
  iframe: HTMLIFrameElement
  constructor () {
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
        this.sup = event.data.url
        exercicesParams.update((l) => {
          l[this.numeroExercice].sup = event.data.url
          return l
        })
      }
    })
  }

  get html () {
    this.handleScore()
    let url = `https://coopmaths.fr/challenge/?mathalea&numeroExercice=${this.numeroExercice}`
    if (this.sup !== undefined) {
      url = this.sup + `&numeroExercice=${this.numeroExercice}`
    }
    if (get(globalOptions).v === 'eleve') {
      url += '&v=eleve'
    }
    this.iframe.setAttribute('src', url)
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

export default challengeRelatif
