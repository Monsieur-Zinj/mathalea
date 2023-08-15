import ExternalApp from './_ExternalApp'

export const uuid = 'challengeRelatif'
export const titre = 'Challenge relatif'

class challengeRelatif extends ExternalApp {
  constructor () {
    super('https://coopmaths.fr/challenge/?mathalea')
  }
}

export default challengeRelatif
