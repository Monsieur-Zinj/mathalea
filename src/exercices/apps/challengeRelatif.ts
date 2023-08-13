import { get } from 'svelte/store'
import { globalOptions, resultsByExercice } from '../../components/store'

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
    const updateVideoSize = () => {
      if (window.innerWidth > window.innerHeight) {
        this.iframe.setAttribute('width', '100%')
        this.iframe.setAttribute('height', (document.body.offsetHeight * 0.75).toString())
      } else {
        this.iframe.setAttribute('width', '100%')
        this.iframe.setAttribute('height', (document.body.offsetHeight * 1.5).toString())
      }
    }
    window.addEventListener('resize', updateVideoSize)
    this.container.addEventListener('addedToDom', updateVideoSize)
  }

  get html () {
    this.handleScore()
    let url = `https://coopmaths.fr/challenge/?mathalea&numeroExercice=${this.numeroExercice}`

    if (this.sup !== undefined) {
      url += `&params=${this.sup}`
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
