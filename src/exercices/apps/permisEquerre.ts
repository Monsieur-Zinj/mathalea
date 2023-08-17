import ExternalApp from './_ExternalApp'

export const uuid = 'permisEquerre'
export const titre = 'Permis équerre'

class permisEquerre extends ExternalApp {
  constructor () {
    super('https://mathix.org/permis_equerre/index.html?mathalea=1')
  }
}

export default permisEquerre
