import ExternalApp from './_ExternalApp'

export const uuid = 'parcoursTables'
export const titre = 'Parcours avec les tables de multiplication'

class parcoursTables extends ExternalApp {
  constructor () {
    super('https://coopmaths.fr/apps/parcours')
  }
}

export default parcoursTables
