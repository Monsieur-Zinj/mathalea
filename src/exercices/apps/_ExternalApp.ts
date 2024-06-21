import { get } from 'svelte/store'
import { globalOptions, resultsByExercice, exercicesParams } from '../../lib/stores/generalStore'
import { sendToCapytaleSaveStudentAssignment } from '../../lib/handleCapytale'
import Exercice from '../Exercice'

const titre = 'Application externe'

class ExternalApp extends Exercice {
  typeExercice: string
  container: HTMLDivElement
  iframe: HTMLIFrameElement
  url: URL
  state: 'done' | ''
  type = 'app'
  constructor (url: string) {
    super()
    this.url = new URL(url)
    this.titre = titre
    this.typeExercice = 'html'
    this.state = ''
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
          if (this.numeroExercice !== undefined) {
            l[this.numeroExercice].sup = event.data.urlParams
          }
          return l
        })
      }
    })
  }

  get html () {
    exercicesParams.update((l) => {
      if (this.numeroExercice !== undefined) {
        l[this.numeroExercice].type = 'app'
      }
      return l
    })
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
    if (this.numeroExercice !== undefined) {
      this.url.searchParams.append('numeroExercice', this.numeroExercice.toString())
    }
    this.iframe.setAttribute('src', this.url.toString())
    return this.container
  }

  handleScore () {
    window.addEventListener('message', (event) => {
      if (event.data?.numeroExercice !== this.numeroExercice) return
      if (event.data?.type === 'mathaleaSendScore') {
        this.state = 'done'
        const numberOfPoints = parseInt(event.data.score)
        const indice = parseInt(event.data.numeroExercice)
        const numberOfQuestions = parseInt(event.data.numberOfQuestions)
        const answers = Array.isArray(event.data.finalState) ? event.data.finalState : [event.data.finalState]
        const type = 'app'
        resultsByExercice.update((l) => {
          l[indice] = { numberOfPoints, numberOfQuestions, indice, answers, type }
          return l
        })
        if (get(globalOptions).recorder === 'capytale') {
          sendToCapytaleSaveStudentAssignment({ indiceExercice: this.numeroExercice })
        }
      } else if (event.data?.type === 'mathaleaHasScore') {
        const numberOfPoints = parseInt(event.data.score)
        const indice = parseInt(event.data.numeroExercice)
        const numberOfQuestions = parseInt(event.data.numberOfQuestions)
        const answers = Array.isArray(event.data.finalState) ? event.data.finalState : [event.data.finalState]
        resultsByExercice.update((l) => {
          l[indice] = { numberOfPoints, numberOfQuestions, indice, answers }
          return l
        })
        const message = { type: 'mathaleaHasScore', score: numberOfPoints, numeroExercice: indice, numberOfQuestions, finalState: answers }
        if (this.iframe !== null && this.iframe.contentWindow !== null) {
          this.iframe.contentWindow.postMessage(message, '*')
        }
      } else if (event.data?.type === 'mathaleaAskScore') {
        const indice = parseInt(event.data.numeroExercice) || 0
        const results = get(resultsByExercice)[indice]
        if (typeof results !== 'undefined') {
          const message = { type: 'mathaleaHasScore', score: results.numberOfPoints, numeroExercice: indice, numberOfQuestions: results.numberOfQuestions, finalState: results.answers }
          if (this.iframe !== null && this.iframe.contentWindow !== null) {
            this.iframe.contentWindow.postMessage(message, '*')
          }
        }
      }
    })
  }
}

export default ExternalApp
