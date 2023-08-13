import { resultsByExercice } from '../../components/store'

export const uuid = 'permisLitteral'
export const titre = 'Permis calcul littéral'

class challengeRelatif {
  typeExercice: string
  numeroExercice: number
  titre: string
  container: HTMLDivElement
  iframe: HTMLIFrameElement
  constructor () {
    this.typeExercice = 'html'
    this.titre = titre
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
    this.iframe.setAttribute('src', `https://www.mathix.org/permis_litteral/?mathalea&numeroExercice=${this.numeroExercice}`)
    this.handleScore()
    return this.container
  }

  async handleScore () {
    window.addEventListener('message', async (event) => {
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
