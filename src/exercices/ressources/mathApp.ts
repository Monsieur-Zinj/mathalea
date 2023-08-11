import { resultsByExercice } from '../../components/store'

class mathApp {
  typeExercice: string
  numeroExercice: number
  sup: string
  sup2: string
  sup3: string
  titre: string
  container: HTMLDivElement
  iframe: HTMLIFrameElement
  fieldUrl: HTMLInputElement
  fieldLargeur: HTMLInputElement
  fieldHauteur: HTMLInputElement
  button: HTMLButtonElement
  url: URL
  constructor () {
    this.typeExercice = 'html'
    this.titre = ''
    this.container = document.createElement('div')
    this.iframe = document.createElement('iframe')
    this.iframe.setAttribute('width', '400px')
    this.iframe.setAttribute('height', '300px')
    this.iframe.classList.add('my-10')
    this.iframe.setAttribute('src', 'https://coopmaths.fr/test')
    this.container.appendChild(this.iframe)
    const updateVideoSize = () => {
      this.iframe.setAttribute('width', '100%')
      this.iframe.setAttribute('height', this.iframe.offsetWidth * 0.75 + '')
    }
    const sendIdExercice = () => {
      const message = { type: 'mathaleaSendNumeroExercice', numeroExercice: this.numeroExercice }
      this.iframe.contentWindow.postMessage(message, '*')
    }
    window.addEventListener('resize', updateVideoSize)
    this.container.addEventListener('addedToDom', updateVideoSize)
    // On attend que l'iframe soit chargée pour envoyer le numéro d'exercice
    this.iframe.addEventListener('load', sendIdExercice)
  }

  get html () {
    this.handleScore()
    return this.container
  }

  async handleScore () {
    window.addEventListener('message', async (event) => {
      if (event.data?.type !== 'mathaleaSendScore') return
      const numberOfPoints = parseInt(event.data.score)
      const indice = parseInt(event.data.numeroExercice)
      const numberOfQuestions = numberOfPoints
      resultsByExercice.update((l) => {
        l[indice] = { numberOfPoints, numberOfQuestions, indice }
        return l
      })
    })
  }
}

export default mathApp
