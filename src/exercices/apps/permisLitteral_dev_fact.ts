import ExternalApp from './_ExternalApp'

export const uuid = 'permisLitteralDevFact'
export const titre = 'Permis Littéral - Développer et factoriser'

class permisLitteralDevFact extends ExternalApp {
  constructor () {
    super('https://mathix.org/permis_litteral_dev_fact/index.html?mathalea=1')
  }
}

export default permisLitteralDevFact
