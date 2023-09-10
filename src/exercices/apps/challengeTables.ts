import ExternalApp from './_ExternalApp'

export const uuid = 'challengeTables'
export const titre = 'Challenge tables'

class challengeTables extends ExternalApp {
  constructor () {
    super('https://coopmaths.fr/challenge/?mathalea&type=tables')
  }
}

export default challengeTables
