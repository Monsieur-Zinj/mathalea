import ExternalApp from './_ExternalApp'

export const uuid = 'permisLitteral'
export const titre = 'Permis Littéral'

class permisLitteral extends ExternalApp {
  constructor () {
    super('https://mathix.org/permis_litteral/index.html?mathalea=1')
  }
}

export default permisLitteral
