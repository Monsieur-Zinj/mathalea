import ExternalApp from './_ExternalApp'

export const uuid = 'equations'
export const titre = 'Équations'

class equations extends ExternalApp {
  constructor () {
    super('https://coopmaths.fr/apps/equations/?mathalea')
  }
}

export default equations
