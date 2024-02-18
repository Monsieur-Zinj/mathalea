import ExternalApp from './_ExternalApp'

export const uuid = 'parallelogramme'
export const titre = 'Parallélogramme'

class parallelogramme extends ExternalApp {
  constructor () {
    // Todo : migrer sur l'url de la forge
    super('https://degrangem.github.io/Parallelogramme/?mathalea')
  }
}

export default parallelogramme
